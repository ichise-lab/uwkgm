import * as d3 from 'd3';

const countExistingIds = (ids, filteredGraph) => {
    var counter = 0;

    for (let id of Object.keys(ids)) {
        if (filteredGraph.ids[id] in filteredGraph.nodes) {
            counter++;
        }
    }

    return counter;
}

const anyExistingIds = (ids, filteredGraph) => {
    for (let id of Object.keys(ids)) {
        if (filteredGraph.ids[id] in filteredGraph.nodes) {
            return true;
        }
    }

    return false;
}

const convertRGBA = color => {
    return 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';
}

const verifyManualRule = (node, nodes, rule) => {
    if (rule.rule[0] === 'node') {
        if (rule.rule[1] === 'ofType' && rule.values[0].entity.uri !== null) {
            const type = rule.values[0].entity.uri;

            if (type in nodes) {
                const typeId = nodes[type].id;

                if (node.types.includes(typeId)) {
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

export const handleNodeMouseOver = (node, graph, caller) => {
    graph.nodes[graph.ids[node.id]].isHovering = true;
    caller.hoveringNode = node;
    caller.update();
}

export const handleNodeMouseLeave = (node, graph, caller) => {
    graph.nodes[graph.ids[node.id]].isHovering = false;
    caller.hoveringNode = null;
    caller.update();
}

export const handleNodeClick = (node, graph, caller) => {
    for (let key of Object.keys(graph.nodes)) {
        graph.nodes[key].selected = false;
    }

    graph.nodes[graph.ids[node.id]].selected = true;
    caller.selected = node;
    caller.update();
}

export const makeLabelfromURI = entity => {
    const urlSections = entity.split('/');
    const identifierSections = urlSections[urlSections.length - 1].split('#');
    const label = identifierSections[identifierSections.length - 1]
        .replace(/([A-Z])/g, ' $1')
        .trim();
    
    return label.length ? label : entity;
}

export const createD3Data = filteredGraph => {
    var data = {nodes: [], links: []};

    for (let node of Object.values(filteredGraph.nodes)) {
        data.nodes.push({id: node.id});
    }

    for (let [link, pred] of Object.entries(filteredGraph.links)) {
        const ids = link.split('-');
        data.links.push({source: parseInt(ids[0]), predicate: parseInt(pred), target: parseInt(ids[1])});
    }

    return data;
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

export const initNodes = filteredGraph => {
    var filteredNodes = {};

    for (let [entity, node] of Object.entries(filteredGraph.nodes)) {
        node.isHovering = false;
        node.selected = false;
        filteredNodes[entity] = node;
    }

    filteredGraph.nodes = filteredNodes;
}

export const createLinks = filteredGraph => {
    var filteredLinks = {};

    for (let node of Object.values(filteredGraph.nodes)) {
        for (let [objId, predId] of Object.entries(node.outgoings)) {
            if (filteredGraph.ids[node.id] in filteredGraph.nodes && filteredGraph.ids[objId] in filteredGraph.nodes) {
                filteredLinks[node.id + '-' + objId] = predId;
            }
        }
    }

    filteredGraph.links = filteredLinks;
}

export const filterMinLinks = (filteredGraph, options) => {
    var filteredNodes = {};

    if (options.graph.minLinks > 1) {
        for (let [entity, obj] of Object.entries(filteredGraph.nodes)) {
            if (countExistingIds(obj.incomings, filteredGraph) + countExistingIds(obj.outgoings, filteredGraph) >= options.graph.minLinks) {
                filteredNodes[entity] = obj;
            }
        }

        filteredGraph.nodes = filteredNodes;
    }
}

export const filterDirectedLinks = (filteredGraph, options) => {
    var filteredNodes = {};

    if (options.graph.showIncomingLinks && !options.graph.showOutgoingLinks) {
        for (let [entity, obj] of Object.entries(filteredGraph.nodes)) {
            if (obj.isMainNode || anyExistingIds(obj.outgoings, filteredGraph)) {
                filteredNodes[entity] = obj;
            }
        }

        filteredGraph.nodes = filteredNodes;

    } else if (!options.graph.showIncomingLinks && options.graph.showOutgoingLinks) {
        for (let [entity, obj] of Object.entries(filteredGraph.nodes)) {
            if (obj.isMainNode || anyExistingIds(obj.incomings, filteredGraph)) {
                filteredNodes[entity] = obj;
            }
        }

        filteredGraph.nodes = filteredNodes;
    }
}

export const filterExtNeighbors = (filteredGraph, options) => {
    var filteredNodes = {};

    if (!options.graph.showExtNeighbors) {
        for (let [entity, obj] of Object.entries(filteredGraph.nodes)) {
            if (obj.isMainNode) {
                filteredNodes[entity] = obj;
            } else {
                for (let objId of Object.keys(obj.incomings)) {
                    if (filteredGraph.ids[objId] in filteredGraph.nodes && 
                        filteredGraph.nodes[filteredGraph.ids[objId]].isMainNode) {
                        filteredNodes[entity] = obj;
                    }
                }
            }
        }

        filteredGraph.nodes = filteredNodes;
    }
}

export const filterNodesByRules = (filteredGraph, graph, rules) => {
    var visibility = {};
    var notApplicableVisible = true;
    var filteredNodes = {};

    for (let rule of rules) {
        if (rule.rule[1] === 'notApplicable') {
            notApplicableVisible = rule.visible;
        }
    }

    for (let [entity, node] of Object.entries(filteredGraph.nodes)) {
        visibility[entity] = notApplicableVisible;

        for (let i = rules.length - 1; i >= 0; i--) {
            if (rules[i].rule[1] !== 'notApplicable' && verifyManualRule(node, graph.nodes, rules[i])) {
                visibility[entity] = rules[i].visible;
            }
        }
    }

    for (let [entity, obj] of Object.entries(filteredGraph.nodes)) {
        if (obj.isMainNode || visibility[entity]) {
            filteredNodes[entity] = obj;
        }
    }

    filteredGraph.nodes = filteredNodes;
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

export const setNodeOptionStyles = (node, options) => {
    const nodeType = node.isMainNode ? 'main' : 'minor';
    node.styles = {node: {}, label: {}}

    for (let element of ['node', 'label']) {
        for (let [key, value] of Object.entries(options.styles.nodes[nodeType][element])) {
            if (typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value && 'a' in value) {
                node.styles[element][key] = convertRGBA(value);
            } else {
                node.styles[element][key] = value;
            }
        }
    }

    node.styles.icon = null;
}

export const setNodeHoverOpacity = (node, hoveringNode, graph, filteredGraph) => {
    const targetNode = filteredGraph.nodes[graph.ids[node.id]];

    if (targetNode.isMainNode) {
        return 1;
    } else {
        if (hoveringNode !== null && !(targetNode.isHovering || hoveringNode.id in targetNode.incomings || hoveringNode.id in targetNode.outgoings)) {
            return .3;
        } else {
            return 1;
        }
    }
}

export const setNodeLabel = (node, graph) => {
    for (let uri of graph.rdf.labels.uris) {
        if (uri in graph.nodes && graph.nodes[uri].id in graph.nodes[graph.ids[node.predicate]].attributes) {
            return graph.nodes[graph.ids[node.predicate]].attributes[graph.ids[uri]];
        }
    }

    return makeLabelfromURI(graph.ids[node.predicate]);
}

export const setNodeHoverLabel = (node, graph, filteredGraph, options) => {
    const targetNode = filteredGraph.nodes[graph.ids[node.id]];

    if (options.graph.showAllNodeLabels ||
        (options.graph.showMainNodeLabels && targetNode.isMainNode) ||
        (options.graph.showHoverNodeLabels && targetNode.isHovering)) {
        return targetNode.label.text;
    } else {
        return '';
    }
}

export const setLinkColor = (link, hoveringNode, filteredGraph, theme) => {
    if (hoveringNode !== null) {
        if (filteredGraph.nodes[filteredGraph.ids[link.source.id]].isHovering || 
            filteredGraph.nodes[filteredGraph.ids[link.target.id]].isHovering) {
            return theme === 'light' ? '#888' : '#CCC';
        } else {
            return theme === 'light' ? 'rgba(0, 0, 0, .08)' : 'rgba(255, 255, 255, .08)';
        }
    }

    return theme === 'light' ? 'rgba(0, 0, 0, .08)' : 'rgba(255, 255, 255, .08)';
}

export const setArrowColor = (link, hoveringNode, filteredGraph) => {
    if (hoveringNode != null) {
        if (filteredGraph.nodes[filteredGraph.ids[link.source.id]].isHovering || 
            filteredGraph.nodes[filteredGraph.ids[link.target.id]].isHovering) {
            return 'url(#hovering)';
        } else {
            return 'url(#notHovering)';
        }
    }

    return 'url(#default)';
}

const shouldShowLinkLabel = (link, hoveringNode, filteredGraph, options) => {
    if (options.graph.showAllLinkLabels) {
        return true;
    } else if (options.graph.showHoverLinkLabels && hoveringNode !== null) {
        if (hoveringNode.id === link.source.id && filteredGraph.nodes[filteredGraph.ids[link.source.id]].isMainNode) {
            if (filteredGraph.nodes[filteredGraph.ids[link.target.id]].isMainNode) {
                return true;
            }
        } else if (hoveringNode.id === link.target.id && filteredGraph.nodes[filteredGraph.ids[link.target.id]].isMainNode) {
            if (filteredGraph.nodes[filteredGraph.ids[link.source.id]].isMainNode) {
                return true;
            }
        } else if (hoveringNode.id === link.source.id && filteredGraph.nodes[filteredGraph.ids[link.target.id]].isMainNode) {
            return true;
        } else if (hoveringNode.id === link.target.id && filteredGraph.nodes[filteredGraph.ids[link.source.id]].isMainNode) {
            return true;
        }
    }

    return false;
}

export const setLinkPath = (link, hoveringNode, filteredGraph, options) => {
    const showLabel = () => 'M ' + link.source.x + ' ' + link.source.y + ' L ' + link.target.x + ' ' + link.target.y;
    return shouldShowLinkLabel(link, hoveringNode, filteredGraph, options) ? showLabel() : '';
}

export const setLinkLabelTransform = (link, hoveringNode, filteredGraph, options, caller) => {
    function showLabel() {
        if (link.target.x < link.source.x) {
            const bbox = caller.getBBox();
            const rx = bbox.x + bbox.width / 2;
            const ry = bbox.y + bbox.height / 2;
            return 'rotate(180 ' + rx + ' ' + ry + ')';
        } else {
            return 'rotate(0)';
        }
    }

    return shouldShowLinkLabel(link, hoveringNode, filteredGraph, options) ? showLabel() : '';
}

export const setLinkLabelColor = (link, hoveringNode, filteredGraph, options, theme) => {
    const color = theme === 'dark' ? '#CCC' : '#888';
    return shouldShowLinkLabel(link, hoveringNode, filteredGraph, options) ? color : 'rgba(0, 0, 0, 0)';
}

export const setLinkLabelSize = options => {
    return options.styles.links.label.fontSize;
}

export const setNodeRuleStyles = (node, graph, rules) => {
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
        if (verifyManualRule(node, graph.nodes, rules[i])) {
            applyStyles(node.styles, rules[i].styles);
        }
    }
}
