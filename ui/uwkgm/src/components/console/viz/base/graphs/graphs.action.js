export const init = (graph, options) => ({
    type: 'INIT',
    payload: {
        graph,
        options
    }
});

export const updateGraph = graph => ({
    type: 'UPDATE_GRAPH',
    payload: {
        graph
    }
});

export const updateSearch = search => ({
    type: 'UPDATE_SEARCH',
    payload: {
        search
    }
});

export const updateTools = tools => ({
    type: 'UPDATE_TOOLS',
    payload: {
        tools
    }
})

export const updateOptions = options => ({
    type: 'UPDATE_OPTIONS',
    payload: {
        options
    }
});
