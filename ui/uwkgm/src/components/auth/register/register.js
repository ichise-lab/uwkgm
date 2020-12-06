import React from 'react';
import { Link, useHistory } from "react-router-dom";

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LockIcon from '@material-ui/icons/Lock';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';

import { apiEndpoint } from 'services/servers';
import { auth } from 'services/auth';
import { Code } from './code/code';
import { getStyles } from 'styles/styles';
import { Language, LanguageSelector } from 'services/languages/languages';
import { styles } from './register.css';

import castleImg from 'assets/images/login/castle.png';

export default class Register extends React.Component {
    code = null
    password = ''
    confirmPassword = ''

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            validPassword: null,
            invalidPassword: null,
            success: false
        };
    }

    checkPasswords = () => {
        this.setState(() => ({validPassword: this.password.length >= 8 && this.password === this.confirmPassword}))
    }

    handleCodeVerified = (code, username, email) => {
        this.code = code;
        
        this.setState(() => ({
            username: username,
            email: email
        }));
    }

    handlePasswordChange = event => {
        this.password = event.currentTarget.value;
        this.checkPasswords();
    }

    handleConfirmPasswordChange = event => {
        this.confirmPassword = event.currentTarget.value;
        this.checkPasswords();
    }

    handleSubmit = event => {
        event.preventDefault();

        const settings = {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: this.code,
                password: this.password
            })
        }

        const response = fetch(apiEndpoint + '/accounts/' + this.state.username + '/register', settings)
            .then(res => {
                if (res.status === 200) {
                    this.setState(() => ({success: true}));
 
                } else if (res.status === 400) {
                    this.setState(() => ({invalidPassword: true}));

                } else {
                    alert("An unknown error occurred. Please try again.")
                }
            });
    }

    render() {
        return (
            <RegisterFunc 
                code={this.code}
                username={this.state.username}
                email={this.state.email}
                password={this.password}
                validPassword={this.state.validPassword}
                invalidPassword={this.state.invalidPassword}
                success={this.state.success}
                snackbar={this.props.snackbar}
                onCodeVerified={this.handleCodeVerified}
                onPasswordChange={this.handlePasswordChange}
                onConfirmPasswordChange={this.handleConfirmPasswordChange}
                onSubmit={this.handleSubmit}
            />
        );
    }
}

const RegisterFunc = props => {
    const classes = getStyles(styles.register);
    const { 
        code,
        email,
        password,
        success,
        snackbar,
        onCodeVerified 
    } = props;
    
    return (
        <div className={classes.body}>
            {success ?
                <Success 
                    email={email}
                    password={password}
                    snackbar={snackbar}
                />
            :
                code !== null ?
                    <Form {...props} />
                :
                    <Code onCodeVerified={onCodeVerified} />
            }
        </div>
    );
}

const Form = props => {
    const classes = getStyles(styles.form);
    const theme = useTheme();
    const history = useHistory();

    const { 
        username,
        email,
        validPassword,
        invalidPassword,
        onPasswordChange,
        onConfirmPasswordChange,
        onSubmit
    } = props;

    const handleCancelClick = () => {
        history.replace({pathname: '/home'});
    }

    return (
        <div className={classes.container}>
            <div className={classes.leftPanel}>
                <img src={castleImg} alt="kgize" className={classes.castle} />
            </div>
            <div className={classes.rightPanel}>
                <form onSubmit={onSubmit}>
                    <div>
                        <h1 className={classes.title}>UWKGM</h1>
                        <div className={classes.registration}>Registration</div>
                    </div>
                    <div className={classes.messageBlock}>
                        Your account has already been created. You only need to change your password to activate it.
                    </div>
                    <div className={classes.inputBlock}>
                        <TextField 
                            label="Username"
                            value={username}
                            className={classes.textField}
                            required
                            disabled
                        />
                        <TextField 
                            label="Email"
                            value={email}
                            className={classes.textField}
                            required
                            disabled
                        />
                        <TextField 
                            label="Password"
                            type="password"
                            error={invalidPassword}
                            className={classes.textField}
                            onChange={onPasswordChange}
                            required
                        />
                        <Tooltip title="Your password will be encrypted using the PBKDF2 algorithm with a SHA256 hash.">
                            <LockIcon className={classes.icon} />
                        </Tooltip>
                        <TextField 
                            label="Confirm Password"
                            type="password"
                            error={invalidPassword}
                            className={classes.textField}
                            onChange={onConfirmPasswordChange}
                            required
                        />
                    </div>
                    <div className={classes.explainBlock}>
                        Your password can’t be too similar to your other personal information, must contain at least 8 characters,
                        can’t be a commonly used password, and can’t be entirely numeric.
                    </div>
                    <div className={classes.buttonsBlock}>
                        <div>
                            <button type="submit" className="btn btn-primary" disabled={!validPassword}>
                                Create Account
                            </button>
                            <button type="button" className="btn btn-outline-secondary" style={{color: theme.palette.text.primary}} onClick={handleCancelClick}>
                                Cancel
                            </button>
                            <LanguageSelector className={classes.languageSelector} />
                        </div>
                    </div>
                    <div className={classes.footer}>
                        <ul>
                            <li><Link to="/home">Home</Link></li>
                            <li style={{opacity: .3}}>Help</li>
                            <li style={{opacity: .3}}>Privacy</li>
                            <li style={{opacity: .3}}>Terms</li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
    );
}

const Success = props => {
    const classes = getStyles(styles);
    const theme = useTheme();
    const history = useHistory();

    const { email, password, snackbar } = props;

    const handleContinueClick = () => {
        auth.login(history, {from: {pathname: "/console"}}, email, password, () => {}, () => {});
        snackbar.open('Successfully logged in as ' + email, 'success', 2000);
    }

    return (
        <React.Fragment>
            <div className={classes.success.container}>
                <div>
                    <CheckCircleIcon className={classes.success.icon} />
                </div>
                <h2 className={classes.success.title}>
                    You're All Set!
                </h2>
                <div className={classes.success.messageBlock}>
                    Your account is now active. <br />
                    Welcome to UWKGM.
                </div>
                <div className={classes.success.buttonBlock}>
                    <button type="button" className="btn btn-outline-secondary" style={{color: theme.palette.text.primary}} onClick={handleContinueClick}>
                        Continue
                    </button>
                </div>
            </div>
            <div className={classes.bottom.container}>
                Protected by reCAPTCHA <br />
                &copy; 2020 Ichise Lab
            </div>
        </React.Fragment>
    );
}