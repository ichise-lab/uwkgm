export const init = (isTreeLoaded, activeBranch, activeEndpoint, tree) => ({
    type: 'INIT_EXPLORER',
    payload: {
        isTreeLoaded,
        activeBranch,
        activeEndpoint,
        tree
    }
});

export const updateActiveBranch = (activeBranch, activeEndpoint) => ({
    type: 'UPDATE_ACTIVE_BRANCH',
    payload: {
        activeBranch,
        activeEndpoint
    }
});

export const updateEndpointParams = activeEndpoint => ({
    type: 'UPDATE_ENDPOINT_PARAMS',
    payload: {
        activeEndpoint
    }
});

export const updateResult = (activeEndpoint, tree) => ({
    type: 'UPDATE_RESULT',
    payload: {
        activeEndpoint,
        tree
    }
});
