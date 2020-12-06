import { initGraph } from './catalogs';

const initState = {graph: initGraph};

export const catalogReducer = (state=initState, action) => {
    switch (action.type) {
        case 'UPDATE_CATALOG': {
            const { graph } = action.payload;
            return {
                ...state,
                graph
            }
        }
        default: {
            return state;
        }
    }
}
