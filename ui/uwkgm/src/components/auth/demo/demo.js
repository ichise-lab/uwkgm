import React from 'react';
import { useHistory } from "react-router-dom";

import decode from 'jwt-decode';

import TextField from '@material-ui/core/TextField';
import { useTheme } from '@material-ui/core/styles';

import { apiEndpoint } from 'services/servers';
import { getStyles } from 'styles/styles';
import { styles } from './demo.css';

import logoGreyImg from 'assets/images/logos/64x64-grey.png';
import logoImg from 'assets/images/logos/64x64.png';

export const Demo = props => {
    const classes = getStyles(styles);
    const theme = useTheme();
    const history = useHistory();

    const [code, setCode] = React.useState('');
    const [error, setError] = React.useState(null);

    const handleCodeChange = event => {
        setCode(event.currentTarget.value);
    }

    const handleSubmit = event => {
        event.preventDefault();

        const settings = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: code
            })
        }

        fetch(apiEndpoint + '/accounts/tokens/verify', settings)
            .then(res => {
                if (res.status === 200) {
                    let access = decode(code);

                    window.localStorage.setItem('access', code);
                    window.localStorage.setItem('refresh', '');
                    window.localStorage.setItem('username', access.username);
                    window.localStorage.setItem('email', access.email);
                    window.localStorage.setItem('groups', 'user_demo');
                    window.localStorage.setItem('isAdmin', false);
                    window.localStorage.setItem('accessExpires', access.exp * 1000);
                    
                    history.replace({pathname: '/console'});

                } else if (res.status === 401) {
                    setError('Invalid token');

                } else {
                    setError('Unknown error');
                }
            })
    }

    const handleCancelClick = () => {
        history.replace({pathname: '/home'});
    }

    return (
        <div className={classes.demo.body}>
            <div className={classes.demo.container}>
                <form onSubmit={handleSubmit}>
                    <div className={classes.demo.upperBlock}>
                        <div>
                            <img src={theme.palette.type === 'light' ? logoImg : logoGreyImg} alt="Home" />
                        </div>
                        <div>
                            <h1 className={classes.demo.title}>UWKGM</h1>
                            <div className={classes.demo.liveDemo}>Live Demo</div>
                        </div>
                    </div>
                    <div className={classes.demo.messageBlock}>
                        The administrators require a validation code for live demo. <br />
                        Please contact them directly to get your code.
                    </div>
                    <div className={classes.demo.inputBlock}>
                        <TextField 
                            className={classes.demo.input} 
                            label="Validation Code" 
                            error={error}
                            onChange={handleCodeChange}
                            required
                        />
                    </div>
                    <div className={classes.demo.buttonBlock}>
                        <button type="submit" className="btn btn-primary">
                            Verify
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={handleCancelClick}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            <div className={classes.bottom.container}>
                Protected by reCAPTCHA <br />
                &copy; 2020 Ichise Lab
            </div>
        </div>
    );
}