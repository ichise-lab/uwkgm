import React from 'react';
import * as d3 from 'd3';
import { connect } from "react-redux";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { getStyles } from 'styles/styles';
import { styles } from './canvas.css';
import {
    areGraphsIdentical,
    createD3Data,
    createLinks,
    defineArrows,
    filterMinLinks,
    filterDirectedLinks,
    filterExtNeighbors,
    filterNodesByRules,
    handleCanvasDrag,
    handleNodeMouseOver,
    handleNodeMouseLeave,
    handleNodeClick,
    initNodes,
    setArrowColor,
    setLinkColor,
    setLinkLabelTransform,
    setLinkLabelSize,
    setLinkLabelColor,
    setLinkPath,
    setNodeHoverLabel,
    setNodeHoverOpacity,
    setNodeLabel,
    setNodeOptionStyles,
    setNodeRuleStyles
} from './canvas.libs';

export class CanvasClass extends React.Component {
    constructor(props) {
        super(props);

        this.canvas = React.createRef();
        this.container = React.createRef();

        this.hoveringNode = null;
    }

    filter(filteredGraph) {
        const graph = this.props.reducers.graphs.graph;
        const tools = this.props.reducers.graphs.tools;
        const options = this.props.reducers.graphs.options;

        initNodes(filteredGraph);

        filterExtNeighbors(filteredGraph, options);
        filterDirectedLinks(filteredGraph, options);
        filterMinLinks(filteredGraph, options);
        filterNodesByRules(filteredGraph, graph, tools.rules.manual);

        createLinks(filteredGraph);
    }

    style(filteredGraph) {
        const graph = this.props.reducers.graphs.graph;
        const tools = this.props.reducers.graphs.tools;
        const options = this.props.reducers.graphs.options;

        for (let node of Object.values(filteredGraph.nodes)) {
            setNodeOptionStyles(node, options);
            setNodeRuleStyles(node, graph, tools.rules.manual);
        }
    }

    draw() {
        var filteredGraph = Object.assign({}, this.props.reducers.graphs.graph);
        this.filter(filteredGraph);
        this.style(filteredGraph);

        if ('filteredGraph' in this && areGraphsIdentical(this.filteredGraph, filteredGraph)) {
            this.update();
        } else {
            this.filteredGraph = filteredGraph;
            this.renderGraph();
        }
    }

    renderGraph() {
        const graph = this.props.reducers.graphs.graph;
        const data = createD3Data(this.filteredGraph);
        const canvasWidth = this.container.current.offsetWidth;
        const canvasHeight = this.container.current.offsetHeight;

        var simulation = d3.forceSimulation(data.nodes)
            .force('link', d3.forceLink(data.links).id(d => d.id))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('x', d3.forceX())
            .force('y', d3.forceY());

        if ('storedCanvas' in this) this.storedCanvas.selectAll('*').remove();
        
        var svg = d3.select(this.canvas.current)
            .attr('viewBox', [-canvasWidth / 2, -canvasHeight / 2, canvasWidth, canvasHeight]);
        
        defineArrows(svg, 'default', 15, '#AAA');
        defineArrows(svg, 'hovering', 15, '#888');
        defineArrows(svg, 'notHovering', 15, 'rgba(0, 0, 0, 0)');

        this.links = svg.append('g')
            .selectAll('.line')
            .data(data.links)
            .join('g');

        this.lines = this.links.append('line')
            .attr('stroke-width', '1.5px')
            .attr('marker-end', 'url(#default)');

        this.linkPaths = svg.selectAll(".edgepath")
            .data(data.links)
            .enter()
            .append('path')
            .attr('class', 'edgepath')
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)
            .attr('id', (d, i) => 'edgepath' + i)
            .style("pointer-events", "none");
        
        this.linkLabels = svg.selectAll(".edgelabel")
            .data(data.links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attr('class', 'edgelabel')
            .attr('id', (d, i) => 'edgelabel' + i);

        this.linkLabels.append('textPath')
            .attr('xlink:href', (d, i) => '#edgepath' + i)
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(d => setNodeLabel(d, graph));

        this.nodes = svg.append('g')
            .selectAll('.node')
            .data(data.nodes)
            .join('g')
            .call(handleCanvasDrag(simulation));
        
        this.circles = this.nodes.append('circle')
            .style('cursor', 'pointer');

        this.icons = this.nodes.append('path')

        this.nodeLabels = this.nodes.append('text');
        this.nodeBackgrounds = this.nodes.insert('rect', 'text');

        this.circles.on('mouseover', d => handleNodeMouseOver(d, graph, this));
        this.circles.on('mouseout', d => handleNodeMouseLeave(d, graph, this));
        this.circles.on('click', d => handleNodeClick(d, graph, this));
        this.icons.on('mouseover', d => handleNodeMouseOver(d, graph, this));
        this.icons.on('mouseout', d => handleNodeMouseLeave(d, graph, this));
        this.icons.on('click', d => handleNodeClick(d, graph, this));
        
        simulation.nodes(data.nodes).on("tick", () => {
            this.update();
        });
        
        this.storedCanvas = svg;
    }

    update() {
        function getBBox(selection) {
            selection.each(function(d) {
                d.bbox = this.getBBox();
            });
        }

        const getStyle = node => {
            return this.filteredGraph.nodes[this.filteredGraph.ids[node.id]].styles;
        }

        const graph = this.props.reducers.graphs.graph;
        const options = this.props.reducers.graphs.options;
        const self = this;

        this.nodes
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        this.circles
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        this.icons
            .attr('d', d => getStyle(d).icon)
            .attr('fill', d => getStyle(d).node.backgroundColor)
            .attr('opacity', d => setNodeHoverOpacity(d, this.hoveringNode, graph, this.filteredGraph))
            .attr('transform', d => 'translate(' + (d.x - 12) + ', ' + (d.y - 12) + ')')
            
        this.nodeLabels
            .attr('x', d => d.x + getStyle(d).node.size)
            .attr('y', d => d.y + getStyle(d).node.size)
            .attr('fill', d => getStyle(d).label.fontColor)
            .attr('font-size', d => getStyle(d).label.fontSize)
            .attr('font-weight', d => getStyle(d).label.fontWeight)
            .text(d => setNodeHoverLabel(d, this.filteredGraph, graph, options))
            .call(getBBox);
            
        this.lines
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        this.nodes.selectAll('circle')
            .attr('r', d => getStyle(d).node.size)
            .attr('fill', d => getStyle(d).node.backgroundColor)
            .attr('opacity', d => getStyle(d).icon === null ? setNodeHoverOpacity(d, this.hoveringNode, graph, this.filteredGraph) : 0);
        
        this.links.selectAll('line')
            .attr('stroke', d => setLinkColor(d, this.hoveringNode, this.filteredGraph))
            .attr('marker-end', d => setArrowColor(d, this.hoveringNode, this.filteredGraph));

        this.linkPaths
            .attr('d', d => setLinkPath(d, this.hoveringNode, this.filteredGraph, options));

        this.linkLabels
            .attr('font-size', setLinkLabelSize(options))
            .attr('fill', d => setLinkLabelColor(d, this.hoveringNode, this.filteredGraph, options, this.props.reducers.theme.theme))
            .attr('transform', function(d) { return setLinkLabelTransform(d, self.hoveringNode, self.filteredGraph, options, this)});

        this.nodeBackgrounds
            .attr('x', d => d.bbox.x)
            .attr('y', d => d.bbox.y)
            .attr('width', d => d.bbox.width)
            .attr('height', d => d.bbox.height)
            .attr('fill', d => getStyle(d).label.backgroundColor)
            .attr('stroke', d => getStyle(d).label.borderColor)
            .attr('stroke-width', d => getStyle(d).label.borderWidth);
    }

    componentDidMount() {
        this.draw();

        // Fix svg's height being automatically set to zero when
        // a material-ui's animation is triggered or during window.resize event.
        this.canvas.current.style.height = this.container.current.offsetHeight;
        window.addEventListener('resize', () => {
            if (this.canvas !== null && this.canvas.current != null) {
                this.canvas.current.style.height = this.container.current.offsetHeight;
            }
        });
    }

    componentDidUpdate() {
        this.draw();
    }
    
    render() {
        return (
            <CanvasFunc
                canvasRef={this.canvas}
                containerRef={this.container}
                zoomScale={this.props.zoomScale}
            />
        );
    }
}

const CanvasFunc = props => {
    const classes = getStyles(styles.canvas);
    const { 
        canvasRef,
        containerRef,
        zoomScale
    } = props;

    return (
        <div ref={containerRef} className={classes.container}>
            <TransformWrapper
                defaultScale={1}
                scale={zoomScale}
            >
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => {

                    return (
                        <TransformComponent>
                            <svg ref={canvasRef} />
                        </TransformComponent>
                    );
                }}
            </TransformWrapper>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        reducers: {
            graphs: state.vizBaseGraphReducer,
            theme: state.themeReducer
        }
    };
}

export const Canvas = connect(mapStateToProps)(CanvasClass)
