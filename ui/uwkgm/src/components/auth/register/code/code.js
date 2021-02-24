import React from 'react';
import { useHistory } from "react-router-dom";

import TextField from '@material-ui/core/TextField';
import { useTheme } from '@material-ui/core/styles';

import { apiEndpoint } from 'services/servers';
import { getStyles } from 'styles/styles';
import { publicURL } from 'services/servers';
import { styles } from './code.css';

import logoGreyImg from 'assets/images/logos/64x64-grey.png';
import logoImg from 'assets/images/logos/64x64.png';

export const Code = props => {
    const classes = getStyles(styles);
    const theme = useTheme();
    const history = useHistory();

    const { onCodeVerified } = props;

    const [code, setCode] = React.useState('');
    const [error, setError] = React.useState(null);

    const verifyCode = () => {
        const settings = {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code
            })
        }

        fetch(apiEndpoint + '/accounts/register/code/apply', settings)
            .then(res => {
                if (res.status === 200) {
                    res.json().then((result) => {
                        onCodeVerified(code, result.username, result.email);
                    });

                } else if (res.status === 400) {
                    res.json().then((result) => {
                        console.log(result);
                        if (result.code === 'account_already_registered') {
                            setError('Account already registered');
                            alert('This account has already been registered. Please log in using username/password instead.')
                        } else {
                            setError('Unknown error');
                            alert('Unknown error occurred. Please try again.');
                        }
                    });

                } else if (res.status === 401) {
                    setError('Invalid token');

                } else {
                    setError('Unknown error');
                    alert('Unknown error occurred. Please try again.');
                }
            })
    }

    const handleCodeChange = event => {
        setCode(event.currentTarget.value);
    }

    const handleSubmit = event => {
        event.preventDefault();
        verifyCode();
    }

    const handleLoginClick = () => {
        history.replace({pathname: `${publicURL}/console`});
    }

    const handleCancelClick = () => {
        history.replace({pathname: `${publicURL}/home`});
    }

    return (
        <React.Fragment>
            <div className={classes.code.container}>
                <form onSubmit={handleSubmit}>
                    <div className={classes.code.upperBlock}>
                        <div>
                            <img src={theme.palette.type === 'light' ? logoImg : logoGreyImg} alt="Home" />
                        </div>
                        <div>
                            <h1 className={classes.code.title}>UWKGM</h1>
                            <div className={classes.code.registration}>Registration</div>
                        </div>
                    </div>
                    <div className={classes.code.messageBlock}>
                        The administrators require a validation code for registration. <br />
                        Please contact them directly to get your code.
                    </div>
                    <div className={classes.code.inputBlock}>
                        <TextField 
                            className={classes.code.input} 
                            label="Validation Code" 
                            error={error}
                            onChange={handleCodeChange}
                            required
                        />
                    </div>
                    <div className={classes.code.buttonBlock}>
                        <button type="submit" className="btn btn-primary">
                            Verify
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={handleLoginClick}>
                            Log In
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
        </React.Fragment>
    );
}
