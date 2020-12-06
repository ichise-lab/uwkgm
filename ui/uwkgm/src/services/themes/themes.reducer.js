import { initTheme } from './themes';

const initState = {theme: initTheme};

export const themeReducer = (state=initState, action) => {
    switch (action.type) {
        case 'UPDATE_THEME': {
            const { theme } = action.payload;
            return {
                ...state,
                theme
            }
        }
        default: {
            return state;
        }
    }
}
