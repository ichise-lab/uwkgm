import { initTheme } from 'services/themes/themes';

const initialState = {
    graph: {
        lookup: {},
        triples: [],
        ids: {}
    },
    search: {
        label: '',
        isFocused: false
    },
    tools: {
        rules: {
            manual: []
        }
    },
    options: {
        graph: {
            sortBy: 'none',
            fetchLimit: 10000,
            minLinks: 1,
            maxLinks: 10,
            showAllNodeLabels: false,
            showMainNodeLabels: true,
            showSelectedNodeLabels: true,
            showHoverNodeLabels: true,
            showAllLinkLabels: false,
            showSelectedLinkLabels: true,
            showHoverLinkLabels: true,
            showIncomingLinks: false,
            showOutgoingLinks: true,
        },
        styles: {
            nodes: {
                main: {
                    node: {
                        size: 6,
                        backgroundColor: initTheme === 'dark' ? {r: 200, g: 200, b: 200, a: 1} : {r: 100, g: 100, b: 100, a: 1},
                        borderColor: {r: 0, g: 0, b: 0, a: 0},
                        borderWidth: 0,
                    },
                    label: {
                        fontFamily: 'default',
                        fontSize: 12,
                        fontWeight: 'bold',
                        fontColor: initTheme === 'dark' ? {r: 220, g: 220, b: 220, a: 1} : {r: 100, g: 100, b: 100, a: 1},
                        backgroundColor: {r: 0, g: 0, b: 0, a: 0},
                        borderWidth: 1,
                        borderColor: {r: 0, g: 0, b: 0, a: 0}
                    }
                },
                minor: {
                    node: {
                        size: 6,
                        backgroundColor: initTheme === 'dark' ? {r: 120, g: 120, b: 120, a: 1} : {r: 100, g: 100, b: 100, a: 1},
                        borderColor: {r: 0, g: 0, b: 0, a: 0},
                        borderWidth: 0,
                    },
                    label: {
                        fontFamily: 'default',
                        fontSize: 12,
                        fontWeight: 'bold',
                        fontColor: initTheme === 'dark' ? {r: 220, g: 220, b: 220, a: 1} : {r: 100, g: 100, b: 100, a: 1},
                        backgroundColor: {r: 0, g: 0, b: 0, a: 0},
                        borderWidth: 1,
                        borderColor: {r: 0, g: 0, b: 0, a: 0}
                    }
                }
            },
            links: {
                label: {
                    fontSize: 10
                }
            },
            colorSet: [
                {r: 202, g: 81, b: 22, a: 1},
                {r: 64, g: 186, b: 213, a: 1},
                {r: 88, g: 28, b: 12, a: 1},
                {r: 252, g: 191, b: 30, a: 1},
                {r: 18, g: 1, b: 54, a: 1},
                {r: 3, g: 90, b: 166, a: 1},
                {r: 214, g: 52, b: 71, a: 1},
                {r: 255, g: 164, b: 27, a: 1},
                {r: 88, g: 180, b: 174, a: 1},
                {r: 144, g: 12, b: 63, a: 1},
                {r: 255, g: 226, b: 119, a: 1},
                {r: 81, g: 43, b: 88, a: 1},
                {r: 59, g: 105, b: 120, a: 1},
                {r: 249, g: 179, b: 132, a: 1},
                {r: 255, g: 226, b: 188, a: 1},
                {r: 241, g: 227, b: 203, a: 1},
            ]
        }
    }
}

export const vizBaseGraphReducer = (state=initialState, action) => {
    switch (action.type) {
        case 'INIT': {
            const { graph, canvas, search, options } = action.payload;
            return {
                ...state,
                graph: Object.assign({}, graph),
                canvas: Object.assign({}, canvas),
                search: Object.assign({}, search),
                options: Object.assign({}, options)
            }
        }
        case 'UPDATE_GRAPH': {
            const { graph } = action.payload;
            return {
                ...state,
                graph: Object.assign({}, graph)
            }
        }
        case 'UPDATE_SEARCH': {
            const { search } = action.payload;
            return {
                ...state,
                search: Object.assign({}, search)
            }
        }
        case 'UPDATE_TOOLS': {
            const { tools } = action.payload;
            return {
                ...state,
                tools: Object.assign({}, tools)
            }
        }
        case 'UPDATE_OPTIONS': {
            const { options } = action.payload;
            return {
                ...state,
                options: Object.assign({}, options)
            }
        }
        default:
            return state
    }
}
