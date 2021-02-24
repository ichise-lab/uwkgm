import React from 'react';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { useSelector } from 'react-redux';

import { apiEndpoint } from 'services/servers';
import { Canvas } from './canvas/canvas';
import { content as options } from './options/options.content';
import { EntitySearch } from './search/search';
import { getActiveCatalog } from 'services/catalogs/catalogs';
import { getStyles } from 'styles/styles';
import { init, updateGraph } from './graphs.action';
import { Language } from 'services/languages/languages';
import { Layout } from './layout/layout';
import { Options as GraphOptions } from './options/options';
import { OptionContainer } from 'components/console/templates/options';
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
        isFetchingNodes: false,
        selectedNodes: []
    }

    constructor(props) {
        super(props);
        this.isComponentMounted = false;
    }

    fetchNodes = uris => {
        this.setState(() => ({isFetchingNodes: true}), () => {
            request.json({ 
                url: apiEndpoint + '/databases/graphs/entities/find',
                params: {
                    uris: JSON.stringify(uris), 
                    query_limit: this.props.reducers.graphs.options.graph.fetchLimit,
                    graph: getActiveCatalog(this.props.reducers.catalogs).uri
                }
            }).then(data => {
                if (this.isComponentMounted) {
                    var graph = this.props.reducers.graphs.graph;
                    var ids = {};

                    // Convert result lookup IDs into local lookup IDs
                    for (let [uri, obj] of Object.entries(data.lookup)) {
                        ids[obj.id] = uri;

                        if (!(uri in graph.lookup)) {
                            graph.lookup[uri] = {
                                id: Object.keys(graph.lookup).length
                            };
                            graph.ids[graph.lookup[uri].id] = uri;
                        }

                        if (uris.includes(uri)) {
                            graph.lookup[uri].isMainNode = true;
                        }
                    }

                    // Convert result triple IDs into local triple IDs
                    for (let i = 0; i < data.triples.length; i++) {
                        const triple = {
                            source: graph.lookup[ids[data.triples[i][0]]].id,
                            predicate: graph.lookup[ids[data.triples[i][1]]].id,
                            target: graph.lookup[ids[data.triples[i][2]]].id,
                        };
                        var exist = false;

                        for (let n = 0; n < graph.triples.length; n++) {
                            if (triple.source === graph.triples[n].source &&
                                triple.predicate === graph.triples[n].predicate &&
                                triple.target === graph.triples[n].target) {
                                    exist = true;
                                }
                        }

                        if (!exist) {
                            graph.triples.push(triple);
                        }
                    }

                    // Convert result lookup dictionary into local lookup dictionary
                    for (let [node_uri, node_obj] of Object.entries(data.lookup)) {
                        if ('label' in node_obj) {
                            graph.lookup[node_uri].label = node_obj.label;
                        }

                        if ('types' in node_obj) {
                            graph.lookup[node_uri].types = [];
                            for (let i = 0; i < node_obj.types.length; i++) {
                                graph.lookup[node_uri].types.push(graph.lookup[ids[node_obj.types[i]]].id);
                            }
                        }

                        if ('literals' in node_obj) {
                            graph.lookup[node_uri].literals = {};
                            for (let [pred_id, pred_obj] of Object.entries(node_obj.literals)) {
                                graph.lookup[node_uri].literals[graph.lookup[ids[pred_id]].id] = pred_obj;
                            }
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

    handleWidgetOpen = items => {
        this.setState(() => ({widgets: items}));
    }

    handleWidgetClose = () => {
        this.setState(() => ({widgets: []})); 
    }

    handleRulePageToggle = () => {
        this.setState(() => ({isShowingRulePage: !this.state.isShowingRulePage}))
    }

    // Temporary function
    handleRulePageClose = () => {
        this.setState(() => ({isShowingRulePage: false}));
    }

    handleNodeAdd = node => {
        this.fetchNodes([node.entity]);
    }

    handleNodeSelect = id => {
        var selectedNodes = this.state.selectedNodes;

        if (selectedNodes.includes(id)) {
            selectedNodes.splice(selectedNodes.indexOf(id), 1);
        } else {
            selectedNodes.push(id);
        }

        this.setState(() => ({selectedNodes: selectedNodes}));
    }

    handleNodeExpand = () => {
        const graph = this.props.reducers.graphs.graph;
        const selectedNodes = this.state.selectedNodes;
        var uris = [];

        for (let i = 0; i < selectedNodes.length; i++) {
            uris.push(graph.ids[selectedNodes[i]]);
        }

        this.setState(() => ({selectedNodes: []}), () => {
            this.fetchNodes(uris);
        });
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
                lookup={this.props.reducers.graphs.graph.lookup}
                widgets={this.state.widgets}
                selectedNodes={this.state.selectedNodes}
                isShowingRulePage={this.state.isShowingRulePage}
                isFetchingNodes={this.state.isFetchingNodes}
                onWidgetOpen={this.handleWidgetOpen}
                onWidgetClose={this.handleWidgetClose}
                onRulePageClose={this.handleRulePageClose}
                onRulePageToggle={this.handleRulePageToggle}
                onNodeAdd={this.handleNodeAdd}
                onNodeSelect={this.handleNodeSelect}
                onNodeExpand={this.handleNodeExpand}
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
        lookup,
        widgets,
        selectedNodes,
        isShowingRulePage,
        isFetchingNodes,
        onWidgetOpen,
        onWidgetClose,
        onRulePageClose,
        onRulePageToggle,
        onNodeAdd,
        onNodeSelect,
        onNodeExpand
    } = props;

    const [zoomScale, setZoomScale] = React.useState(1);

    const handleZoomIn = () => {
        setZoomScale(zoomScale + .2);
    }

    const handleZoomOut = () => {
        if (zoomScale > 1) {
            setZoomScale(zoomScale - .2);
        }
    }

    const handleReset = () => {
        setZoomScale(1);
    }

    return (
        <React.Fragment>
            <div className={clsx([pageClasses.fixedContainer, classes.container, optionClasses.content], {[optionClasses.contentShift]: isOptionsOpen})}>
                <div className={clsx([pageClasses.fixedContent, classes.fixedContent])}>
                    {Object.keys(lookup).length > 0 ? 
                        <Canvas
                            zoomScale={zoomScale}
                            selectedNodes={selectedNodes}
                            onNodeSelect={onNodeSelect}
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
                            onNodeAdd={onNodeAdd} 
                        />
                    : ''}
                    {isShowingRulePage ? <Rules onRulePageToggle={onRulePageToggle} /> : ''}
                    {widgets.length ?
                        <Widgets
                            widgets={widgets}
                            onWidgetClose={onWidgetClose}
                        />
                    : ''}
                    <Tools 
                        selectedNodes={selectedNodes}
                        onRulePageClose={onRulePageClose}
                        onRulePageToggle={onRulePageToggle}
                        onNodeExpand={onNodeExpand}
                    />
                </div>
            </div>
            <OptionContainer
                title={<Language text={options.title} />}
                isOptionsOpen={isOptionsOpen}
            >
                <GraphOptions 
                    nodes={[]}
                    onWidgetOpen={onWidgetOpen}
                />
            </OptionContainer>
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
