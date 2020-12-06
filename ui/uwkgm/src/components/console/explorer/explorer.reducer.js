const initialState = {
    isTreeLoaded: false,
    activeBranch: null,
    activeEndpoint: null,
    params: null,
    tree: null
}

export const explorerReducer = (state=initialState, action) => {
    switch (action.type) {
        case 'INIT_EXPLORER': {
            const { isTreeLoaded, activeBranch, activeEndpoint, tree } = action.payload;
            return {
                ...state,
                isTreeLoaded,
                activeBranch,
                activeEndpoint: Object.assign({}, activeEndpoint),
                tree
            }
        }
        case 'UPDATE_ACTIVE_BRANCH': {
            const { activeBranch, activeEndpoint } = action.payload;
            return {
                ...state,
                activeBranch,
                activeEndpoint: Object.assign({}, activeEndpoint)
            }
        }
        case 'UPDATE_ENDPOINT_PARAMS': {
            const { activeEndpoint } = action.payload;
            return {
                ...state,
                activeEndpoint: Object.assign({}, activeEndpoint)
            }
        }
        case 'UPDATE_RESULT': {
            const { activeEndpoint, tree } = action.payload;
            return {
                ...state,
                tree: Object.assign({}, tree),
                activeEndpoint: Object.assign({}, activeEndpoint)
            }
        }
        default:
            return state
    }
}
