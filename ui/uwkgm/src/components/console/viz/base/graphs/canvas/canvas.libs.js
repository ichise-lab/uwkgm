import * as d3 from 'd3';

import { genLabelFromURI } from 'libs/rdf';

const convertRGBA = color => {
    return 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';
}

const verifyManualRule = (node, nodes, rule) => {
    if (rule.rule[0] === 'node') {
        if (rule.rule[1] === 'ofType' && rule.values[0].entity.uri !== null) {
            const type = rule.values[0].entity.uri;

            if (type in nodes) {
                const typeId = nodes[type].id;

                if ('types' in node && node.types.includes(typeId)) {
                    return true;
                }
            }
        }
    }

    return false;
}

export const handleCanvasDrag = simulation => {
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
        
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
        
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
        
    return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
}

export const handleNodeMouseOver = (node, caller) => {
    caller.canvasGraph.states[node.id].isHovering = true;
    caller.hoveringNode = node;
    caller.update();
}

export const handleNodeMouseLeave = (node, caller) => {
    caller.canvasGraph.states[node.id].isHovering = false;
    caller.hoveringNode = null;
    caller.update();
}

export const handleNodeClick = (node, onNodeSelect, caller) => {
    for (let state of Object.values(caller.canvasGraph.states)) {
        state.isSelected = false;
    }

    caller.canvasGraph.states[node.id].isSelected = true;
    onNodeSelect(node.id);
    caller.update();
}

export const defineArrows = (svg, name, refX, fill) => {
    svg.append('svg:defs').selectAll('marker')
        .data([name])
        .enter().append('svg:marker')
        .attr('id', String)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', refX)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('fill', fill)
        .attr('d', 'M0,-5L10,0L0,5');
}

export const initCanvasGraphNodes = graph => {
    var canvasGraph = {nodes: [], triples: [], states: {}};

    for (let [uri, obj] of Object.entries(graph.lookup)) {
        canvasGraph.nodes.push({
            id: obj.id
        });
        canvasGraph.states[obj.id] = {
            isHovering: false,
            isSelected: false,
            incomings: [],
            outgoings: [],
            styles: {node: {}, label: {}}
        };
    }

    for (let i = 0; i < graph.triples.length; i++) {
        canvasGraph.states[graph.triples[i].target].incomings.push(graph.triples[i].source);
        canvasGraph.states[graph.triples[i].source].outgoings.push(graph.triples[i].target);
    }

    return canvasGraph;
}

export const initCanvasGraphLinks = (canvasGraph, graph) => {
    var filteredNodes = [];
    var canvasTriples = [];

    for (let i = 0; i < canvasGraph.nodes.length; i++) {
        filteredNodes.push(canvasGraph.nodes[i].id);
    }

    for (let i = 0; i < graph.triples.length; i++) {
        if (filteredNodes.includes(graph.triples[i].source) &&
            filteredNodes.includes(graph.triples[i].target)) {
            canvasTriples.push({
                source: graph.triples[i].source,
                predicate: graph.triples[i].predicate,
                target: graph.triples[i].target
            });
        }
    }

    canvasGraph.triples = canvasTriples;
}

export const filterMinLinks = (canvasGraph, options) => {
    if (options.graph.minLinks > 1) {
        var canvasNodes = [];
        var neighborDict = {};

        for (let i = 0; i < canvasGraph.triples.length; i++) {
            const sorceId = canvasGraph.triples[i].source;
            const targetId = canvasGraph.triples[i].target;

            if (!(sorceId in neighborDict)) {
                neighborDict[sorceId] = 1;
            } else {
                neighborDict[sorceId]++;
            }

            if (!(targetId in neighborDict)) {
                neighborDict[targetId] = 1;
            } else {
                neighborDict[targetId]++;
            }
        }

        for (let i = 0; i < canvasGraph.nodes.length; i++) {
            if (neighborDict[canvasGraph.nodes[i].id] >= options.graph.minLinks) {
                canvasNodes.push(canvasGraph.nodes[i]);
            }
        }

        canvasGraph.nodes = canvasNodes;
    }
}

export const filterHiddenNodes = canvasGraph => {
    var canvasNodes = [];
    var canvasStates = {};

    for (let i = 0; i < canvasGraph.nodes.length; i++) {
        if (canvasGraph.states[canvasGraph.nodes[i].id].incomings.length > 0 ||
            canvasGraph.states[canvasGraph.nodes[i].id].outgoings.length > 0) {
            canvasNodes.push(canvasGraph.nodes[i]);
            canvasStates[canvasGraph.nodes[i].id] = canvasGraph.states[canvasGraph.nodes[i].id]
        }
    }

    canvasGraph.nodes = canvasNodes;
    canvasGraph.states = canvasStates;
}

export const filterNodesByRules = (canvasGraph, graph, rules) => {
    var notApplicableVisible = true;

    for (let rule of rules) {
        if (rule.rule[1] === 'notApplicable') {
            notApplicableVisible = rule.visible;
        }
    }

    if (!notApplicableVisible) {
        var canvasNodes = [];

        for (let i = 0; i < canvasGraph.nodes.length; i++) {
            var node = graph.lookup[graph.ids[canvasGraph.nodes[i].id]];

            for (let n = 0; n < rules.length; n++) {
                if (('isMainNode' in node && node.isMainNode) ||
                    (rules[n].rule[1] !== 'notApplicable' && 
                     verifyManualRule(node, graph.lookup, rules[n]))) {
                    canvasNodes.push(canvasGraph.nodes[i])
                }
            }
        }
        
        canvasGraph.nodes = canvasNodes;
    }
}

export const areGraphsIdentical = (graphA, graphB) => {
    const aNodes = Object.keys(graphA.nodes);
    const bNodes = Object.keys(graphB.nodes);

    if (aNodes.length === bNodes.length) {
        for (let i = 0; i < aNodes.length; i++) {
            if (!(aNodes[i] in graphB.nodes)) {
                return false;
            }
        }
    } else {
        return false;
    }

    return true;
}

export const setNodeOptionStyles = (state, options) => {
    const nodeType = state.isMainNode ? 'main' : 'minor';

    for (let element of ['node', 'label']) {
        for (let [key, value] of Object.entries(options.styles.nodes[nodeType][element])) {
            if (typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value && 'a' in value) {
                state.styles[element][key] = convertRGBA(value);
            } else {
                state.styles[element][key] = value;
            }
        }
    }

    state.styles.icon = null;
}

export const setNodeColor = (node, selectedNodes, defaultColor, theme, caller) => {
    if (selectedNodes.length > 0 && selectedNodes.includes(node.id)) {
        return theme === 'light' ? '#000' : '#FFF';
    } else {
        return defaultColor;
    }
}

export const setNodeOpacity = (node, selectedNodes, caller) => {
    const state = caller.canvasGraph.states[node.id];

    if (selectedNodes.length > 0) {
        if (selectedNodes.includes(node.id) || (caller.hoveringNode !== null && caller.hoveringNode.id === node.id)) {
            return 1;
        } else {
            return .3;
        }
    }

    if (state.isMainNode) {
        return 1;
    } else {
        if (caller.hoveringNode !== null && !(state.isHovering || caller.hoveringNode.id in state.incomings || caller.hoveringNode.id in state.outgoings)) {
            return .3;
        } else {
            return 1;
        }
    }
}

export const setNodeLabel = (node, selectedNodes, graph, options, caller) => {
    function genLabel() {
        if ('label' in graph.lookup[graph.ids[node.id]]) {
            return graph.lookup[graph.ids[node.id]].label;
        } else {
            return genLabelFromURI(graph.ids[node.id]);
        }
    }

    const state = caller.canvasGraph.nodes[node.id];

    if (selectedNodes.length > 0) {
        if (selectedNodes.includes(node.id) || (caller.hoveringNode !== null && caller.hoveringNode.id === node.id)) {
            return genLabel();
        } else {
            return '';
        }
    }

    if (options.graph.showAllNodeLabels ||
        (options.graph.showMainNodeLabels && graph.lookup[graph.ids[node.id]].isMainNode) ||
        (options.graph.showHoverNodeLabels && caller.canvasGraph.states[node.id].isHovering)) {
        return genLabel();
    } else {
        return '';
    }
}

export const setLinkLabel = (link, graph) => {
    if ('label' in graph.lookup[graph.ids[link.predicate]]) {
        return graph.lookup[graph.ids[link.predicate]].label;
    } else {
        return genLabelFromURI(graph.ids[link.predicate]);
    }
}

export const setLinkColor = (link, theme, caller) => {
    if (caller.hoveringNode !== null) {
        if (caller.canvasGraph.states[link.source.id].isHovering || 
            caller.canvasGraph.states[link.target.id].isHovering) {
            return theme === 'light' ? '#888' : '#CCC';
        } else {
            return theme === 'light' ? 'rgba(0, 0, 0, .08)' : 'rgba(255, 255, 255, .08)';
        }
    }

    return theme === 'light' ? 'rgba(0, 0, 0, .08)' : 'rgba(255, 255, 255, .08)';
}

export const setArrowColor = (link, selectedNodes, caller) => {
    if (caller.hoveringNode != null) {
        if (caller.canvasGraph.states[link.source.id].isHovering || 
            caller.canvasGraph.states[link.target.id].isHovering) {
            return 'url(#hovering)';
        } else {
            return 'url(#notHovering)';
        }
    }

    if (selectedNodes.length > 0) {
        return 'url(#notHovering)';
    } else {
        return 'url(#default)';
    }
}

const shouldShowLinkLabel = (link, graph, options, caller) => {
    if (options.graph.showAllLinkLabels) {
        return true;
    } else if (options.graph.showHoverLinkLabels && caller.hoveringNode !== null) {
        if (caller.hoveringNode.id === link.source.id && graph.lookup[graph.ids[link.source.id]].isMainNode) {
            if (graph.lookup[graph.ids[link.target.id]].isMainNode) {
                return true;
            }
        } else if (caller.hoveringNode.id === link.target.id && graph.lookup[graph.ids[link.target.id]].isMainNode) {
            if (graph.lookup[graph.ids[link.source.id]].isMainNode) {
                return true;
            }
        } else if (caller.hoveringNode.id === link.source.id && graph.lookup[graph.ids[link.target.id]].isMainNode) {
            return true;
        } else if (caller.hoveringNode.id === link.target.id && graph.lookup[graph.ids[link.source.id]].isMainNode) {
            return true;
        }
    }

    return false;
}

export const setLinkPath = (link, graph, options, caller) => {
    const showLabel = () => 'M ' + link.source.x + ' ' + link.source.y + ' L ' + link.target.x + ' ' + link.target.y;
    return shouldShowLinkLabel(link, graph, options, caller) ? showLabel() : '';
}

export const setLinkLabelTransform = (link, graph, options, caller, holder) => {
    function showLabel() {
        if (link.target.x < link.source.x) {
            const bbox = holder.getBBox();
            const rx = bbox.x + bbox.width / 2;
            const ry = bbox.y + bbox.height / 2;
            return 'rotate(180 ' + rx + ' ' + ry + ')';
        } else {
            return 'rotate(0)';
        }
    }

    return shouldShowLinkLabel(link, graph, options, caller) ? showLabel() : '';
}

export const setLinkLabelColor = (link, graph, options, theme, caller) => {
    const color = theme === 'dark' ? '#CCC' : '#888';
    return shouldShowLinkLabel(link, graph, options, caller) ? color : 'rgba(0, 0, 0, 0)';
}

export const setLinkLabelSize = options => {
    return options.styles.links.label.fontSize;
}

export const setNodeRuleStyles = (id, state, graph, rules) => {
    const applyStyles = (nodeStyles, ruleStyles) => {
        for (let element of ['node', 'label']) {
            for (let [key, value] of Object.entries(ruleStyles[element])) {
                if (value !== null) {
                    if (typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value && 'a' in value) {
                        nodeStyles[element][key] = convertRGBA(value);
                    } else {
                        nodeStyles[element][key] = value;
                    }
                }
            }
        }

        if (ruleStyles.icon !== null) { nodeStyles.icon = ruleStyles.icon; }
    }

    for (let i = rules.length - 1; i >= 0; i--) {
        if (verifyManualRule(graph.lookup[graph.ids[id]], graph.lookup, rules[i])) {
            applyStyles(state.styles, rules[i].styles);
        }
    }
}
