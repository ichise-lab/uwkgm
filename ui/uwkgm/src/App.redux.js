import { createStore } from "redux";
import { combineReducers } from "redux";

import { consoleReducer } from 'components/console/console.reducer';
import { explorerReducer } from 'components/console/explorer/explorer.reducer';
import { languageReducer } from 'services/languages/languages.reducer';
import { catalogReducer } from 'services/catalogs/catalogs.reducer';
import { themeReducer } from 'services/themes/themes.reducer';
import { vizBaseGraphReducer } from 'components/console/viz/base/graphs/graphs.reducer';

const staticReducers = {
    consoleReducer,
    explorerReducer,
    languageReducer,
    catalogReducer,
    themeReducer,
    vizBaseGraphReducer
}

const configureStore = (initialState) => {
    const store = createStore(createReducer(), initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    store.asyncReducers = {}
  
    store.injectReducer = (key, asyncReducer) => {
        store.asyncReducers[key] = asyncReducer
        store.replaceReducer(createReducer(store.asyncReducers))
    }

    return store
}
  
function createReducer(asyncReducers) {
    return combineReducers({
        ...staticReducers,
        ...asyncReducers
    });
}

export const store = configureStore()
