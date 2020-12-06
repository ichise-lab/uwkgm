import { reassignObject } from 'libs/object';
import { initState } from './console';

export const consoleReducer = (state=initState, action) => {
    switch (action.type) {
        case 'UPDATE_APP_BAR': {
            return {
                ...state,
                appBar: reassignObject(state.appBar, action.payload)
            }
        }
        case 'UPDATE_PAGE': {
            return {
                ...state,
                page: reassignObject(state.page, action.payload)
            }
        }
        case 'UPDATE_OPTION_PANEL': {
            return {
                ...state,
                options: reassignObject(state.options, action.payload)
            }
        }
        default: {
            return state;
        }
    }
}
