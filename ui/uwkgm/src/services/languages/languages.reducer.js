import { initLanguage } from './languages';

const initState = {language: initLanguage};

export const languageReducer = (state=initState, action) => {
    switch (action.type) {
        case 'UPDATE_LANGUAGE': {
            const { language } = action.payload;
            return {
                ...state,
                language
            }
        }
        default: {
            return state;
        }
    }
}
