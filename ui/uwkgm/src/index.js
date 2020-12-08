import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css';
import * as serviceWorker from './serviceWorker';
import { App } from './App';
import { store } from './App.redux';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

ReactDOM.render(
    <Provider store={store}>
        <GoogleReCaptchaProvider
            reCaptchaKey="6LdZKPMZAAAAAFwLT-nPOzlyYprQAWr_xyr7bY9C"
        >
            <App />
        </GoogleReCaptchaProvider>
    </Provider> 
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
