const initState = {catalogs: null, active: null};

export const catalogReducer = (state=initState, action) => {
    switch (action.type) {
        case 'UPDATE_CATALOGS': {
            const { catalogs } = action.payload;
            return {
                ...state,
                catalogs
            }
        }
        case 'UPDATE_ACTIVE_CATALOG': {
            const { name } = action.payload;
            return {
                ...state,
                active: name
            }
        }
        default: {
            return state;
        }
    }
}
