import decode from 'jwt-decode';

import { authEndpoint } from 'services/servers';

export const auth = {
    login: (history, redirectTo, email, password, handleInvalidLogin, handleSuccessfulLogin) => {
        const settings = {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })};

        const response = fetch(authEndpoint + '/accounts/tokens/obtain', settings)
            .then(res => {
                if (res.status === 200) {
                    res.json().then((result) => {
                        let access = decode(result.access);
                        let refresh = decode(result.refresh);

                        window.localStorage.setItem('access', result.access);
                        window.localStorage.setItem('refresh', result.refresh);
                        window.localStorage.setItem('username', access.username);
                        window.localStorage.setItem('email', access.email);
                        window.localStorage.setItem('groups', access.groups);
                        window.localStorage.setItem('isAdmin', access.isAdmin);
                        window.localStorage.setItem('accessExpires', access.exp * 1000);
                        window.localStorage.setItem('refreshExpires', refresh.exp * 1000);

                        history.replace({pathname: redirectTo.from.pathname});
                        handleSuccessfulLogin(access);
                    })
                } else if (res.status === 401 || res.status === 404) {
                    handleInvalidLogin();
                }
                return res;
            });
        
        return response;
    },

    isLoggedin: () => {
        let accessExpires = window.localStorage.getItem('accessExpires');
        let refreshExpires = window.localStorage.getItem('refreshExpires');

        if (accessExpires !== null) {
            return new Date() < accessExpires;
        } else {
            return refreshExpires !== null && new Date() < refreshExpires;
        }
    },

    isAdmin: () => {
        return window.localStorage.getItem('isAdmin') === 'true';
    },

    getEmail: () => {
        return window.localStorage.getItem('email');
    },

    logout: (snackbar) => {
        window.localStorage.removeItem('access');
        window.localStorage.removeItem('refresh');
        window.localStorage.removeItem('username');
        window.localStorage.removeItem('email');
        window.localStorage.removeItem('groups');
        window.localStorage.removeItem('isAdmin');
        window.localStorage.removeItem('catalog');
        window.localStorage.removeItem('accessExpires');
        window.localStorage.removeItem('refreshExpires');
        window.localStorage.removeItem('showed_demo_intro');

        snackbar.open('Successfully logged out', 'success', 2000);
    },

    getTokens: () => {
        return {'access': window.localStorage.getItem('access'),
                'refresh': window.localStorage.getItem('refresh')};
    },

    decodeToken: token => {
        try {
            return decode(token);
        } catch {
            return null;
        }
    }
};
