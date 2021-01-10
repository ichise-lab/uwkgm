import React from 'react';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { useSelector } from 'react-redux';

import { apiEndpoint } from 'services/servers';
import { Canvas } from './canvas/canvas';
import { content as options } from './options/options.content';
import { EntitySearch } from './search/search';
import { getStyles } from 'styles/styles';
import { init, updateGraph } from './graphs.action';
import { Language } from 'services/languages/languages';
import { Layout } from './layout/layout';
import { Options as GraphOptions } from './options/options';
import { Options } from 'components/console/templates/options';
import { Placeholder } from './placeholder/placeholder';
import { request } from 'services/http';
import { Rules } from './rules/rules';
import { styles as optionStyles } from 'components/console/templates/options.css';
import { styles as pageStyles } from 'components/console/templates/page.css';
import { styles } from './graphs.css';
import { Tools } from './tools/tools';
import { Widgets } from './widgets/widgets';

export class GraphsClass extends React.Component {
    state = {
        widgets: [],
        isShowingRulePage: false,
        isFetchingNodes: false
    }

    constructor(props) {
        super(props);
        this.isComponentMounted = false;
    }

    fetchNodes = entities => {
        this.setState(() => ({isFetchingNodes: true}), () => {
            request.json({ 
                url: apiEndpoint + '/cui/graphs/entities/find',
                params: {
                    entities: JSON.stringify(entities), 
                    query_limit: this.props.reducers.graphs.options.graph.fetchLimit,
                    graph: this.props.reducers.catalogs.active
                }
            }).then(data => {
                if (this.isComponentMounted) {
                    var graph = this.props.reducers.graphs.graph;
    
                    const nGraphNodes = Object.keys(graph.nodes).length;
                    var entity_i = 0;
                    var ids = {};
    
                    // Register entities in the response to local index system
                    for (let [entity, obj] of Object.entries(data.nodes)) {
                        if (!(entity in graph.nodes)) {
                            graph.nodes[entity] = {id: nGraphNodes + entity_i, incomings: {}, outgoings: {}, attributes: {}, label: null, types: []};
                            graph.ids[nGraphNodes + entity_i] = entity;
                            entity_i++;
                        }
    
                        graph.nodes[entity].isMainNode = graph.nodes[entity].isMainNode || entities.includes(entity);
                        ids[obj.id] = entity;
                    }
    
                    // Find IDs for predefined labels and types
                    graph.rdf.labels.ids = 'label' in graph.nodes ? [graph.nodes['label'].id] : [];
                    graph.rdf.types.ids = 'type' in graph.nodes ? [graph.nodes['type'].id] : [];
    
                    for (let label of graph.rdf.labels.uris) {
                        if (label in graph.nodes) {
                            graph.rdf.labels.ids.push(graph.nodes[label].id);
                        }
                    }
    
                    for (let type of graph.rdf.types.uris) {
                        if (type in graph.nodes) {
                            graph.rdf.types.ids.push(graph.nodes[type].id);
                        }
                    }
    
                    // Register incoming and outgoing links
                    for (let [entity, obj] of Object.entries(data.nodes)) {     
                        if ('outgoings' in obj) {
                            for (let [predId, objIds] of Object.entries(obj.outgoings)) {
                                objIds.map(objId => {
                                    const graphSbjId = graph.nodes[entity].id;
                                    const graphPredId = graph.nodes[ids[predId]].id;
                                    const graphObjId = graph.nodes[ids[objId]].id;
    
                                    if (!(graphObjId in graph.nodes[entity].outgoings)) {
                                        graph.nodes[entity].outgoings[graphObjId] = graphPredId;
    
                                        if (graph.rdf.types.ids.includes(graphPredId)) {
                                            graph.nodes[entity].types.push(graphObjId);
                                        }
                                    }
    
                                    if (!(graph.nodes[entity].id in graph.nodes[ids[objId]].incomings)) {
                                        graph.nodes[ids[objId]].incomings[graph.nodes[entity].id] = graphPredId;
                                    }
    
                                    graph.links[graphSbjId + '-' + graphObjId] = graphPredId;
    
                                    return null;
                                });
                            }
                        }
    
                        if ('attributes' in obj) {
                            for (let [attr, value] of Object.entries(obj.attributes)) {
                                const attrId = graph.nodes[ids[attr]].id;
                                graph.nodes[entity].attributes[attrId] = value;
    
                                // Register node label
                                if (graph.rdf.labels.ids.includes(attrId)) {
                                    graph.nodes[entity].label = {text: value, predicate: graph.nodes[ids[attr]]};
                                }
                            }
                        }
    
                        if (graph.nodes[entity].label === null) {
                            graph.nodes[entity].label = {text: makeLabelfromURI(entity), predicate: null};
                        }
                    }
    
                    this.props.actions.graphs.updateGraph(graph);
                    this.setState(() => ({isFetchingNodes: false}));
                }
            }).catch(error => {
                alert("An error occurred while fetching nodes. Please try again.");
                this.setState(() => ({isFetchingNodes: false}));
            });
        });
    }

    openWidgets = items => {
        this.setState(() => ({widgets: items}));
    }

    closeWidgets = () => {
        this.setState(() => ({widgets: []})); 
    }

    toggleRulePage = () => {
        this.setState(() => ({isShowingRulePage: !this.state.isShowingRulePage}))
    }

    // Temporary function
    closeRulePage = () => {
        this.setState(() => ({isShowingRulePage: false}));
    }

    handleAddNode = node => {
        this.fetchNodes([node.entity]);
    }

    componentDidMount() {
        this.isComponentMounted = true;
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    render() {
        return(
            <GraphsFunc
                nodes={this.props.reducers.graphs.graph.nodes}
                rules={this.props.reducers.graphs.tools.rules}
                widgets={this.state.widgets}
                openWidgets={this.openWidgets}
                closeWidgets={this.closeWidgets}
                closeRulePage={this.closeRulePage}
                toggleRulePage={this.toggleRulePage}
                isShowingRulePage={this.state.isShowingRulePage}
                isFetchingNodes={this.state.isFetchingNodes}
                onAddNode={this.handleAddNode}
            />
        );
    }
}

const GraphsFunc = (props) => {
    const isOptionsOpen = useSelector(state => state.consoleReducer).options.isOpen;
    const classes = getStyles(styles.graphs);
    const pageClasses = getStyles(pageStyles.page);
    const optionClasses = getStyles(optionStyles.options);
    const {
        nodes,
        // rules,
        widgets,
        openWidgets,
        closeWidgets,
        closeRulePage,
        toggleRulePage,
        isShowingRulePage,
        isFetchingNodes,
        onAddNode
    } = props;

    const [zoomScale, setZoomScale] = React.useState(1);

    const handleZoomIn = event => {
        setZoomScale(zoomScale + .2);
    }

    const handleZoomOut = event => {
        if (zoomScale > 1) {
            setZoomScale(zoomScale - .2);
        }
    }

    const handleReset = event => {
        setZoomScale(1);
    }

    return (
        <React.Fragment>
            <div className={clsx([pageClasses.fixedContainer, classes.container, optionClasses.content], {[optionClasses.contentShift]: isOptionsOpen})}>
                <div className={clsx([pageClasses.fixedContent, classes.fixedContent])}>
                    {Object.keys(nodes).length > 0 ? 
                        <Canvas
                            zoomScale={zoomScale}
                        /> 
                    : 
                        <Placeholder />
                    }
                    <Layout  
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onReset={handleReset}
                    />
                    {!isShowingRulePage ? 
                        <EntitySearch 
                            isFetchingNodes={isFetchingNodes}
                            onAddNode={onAddNode} 
                        />
                    : ''}
                    {isShowingRulePage ? <Rules toggleRulePage={toggleRulePage} /> : ''}
                    {widgets.length ?
                        <Widgets
                            widgets={widgets}
                            closeWidgets={closeWidgets}
                        />
                    : ''}
                    <Tools 
                        closeRulePage={closeRulePage}
                        toggleRulePage={toggleRulePage}
                    />
                </div>
            </div>
            <Options
                title={<Language text={options.title} />}
                isOptionsOpen={isOptionsOpen}
            >
                <GraphOptions 
                    nodes={nodes}
                    openWidgets={openWidgets}
                />
            </Options>
        </React.Fragment>
    );
}

const makeLabelfromURI = entity => {
    const urlSections = entity.split('/');
    const identifierSections = urlSections[urlSections.length - 1].split('#');
    const label = identifierSections[identifierSections.length - 1]
        .replace(/([A-Z])/g, ' $1')
        .trim();
    
    return label.length ? label : entity;
}

const mapStateToProps = state => {
    return {
        reducers: {
            catalogs: state.catalogReducer,
            console: state.consoleReducer,
            graphs: state.vizBaseGraphReducer
        }
    };
}

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            graphs: {
                init: bindActionCreators(init, dispatch),
                updateGraph: bindActionCreators(updateGraph, dispatch)
            }
        }
    };
}

export const Graphs = connect(mapStateToProps, mapDispatchToProps)(GraphsClass);
