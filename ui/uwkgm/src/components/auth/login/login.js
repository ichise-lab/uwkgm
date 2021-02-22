import React from 'react';
import {
    Link,
    useHistory,
    useLocation
} from "react-router-dom";

import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useTheme } from "@material-ui/core/styles";

import { auth } from 'services/auth';
import { content } from './login.content';
import { getStyles } from 'styles/styles';
import { Language, LanguageSelector } from 'services/languages/languages';
import { publicURL } from 'services/servers';
import { styles } from './login.css';

import castleImg from 'assets/images/login/castle.png';

export const Login = props => {
    const classes = getStyles(styles.login);
    const theme = useTheme();
    const { snackbar } = props;

    const [values, setValues] = React.useState({
        email: '',
        password: '',
        isLoginInvalid: false
    })

    const history = useHistory();
    const location = useLocation();

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };

    const handleSubmit = event => {
        const redirectTo = location.state || {from: {pathname: `${publicURL}/console`}};

        event.preventDefault();
        auth.login(
            history, 
            redirectTo, 
            values.email, 
            values.password, 
            handleInvalidLogin,
            handleSuccessfulLogin
        );
    }

    const handleInvalidLogin = () => {
        snackbar.open('Invalid email or password', 'error', 2000);
        setValues({...values, isLoginInvalid: true});
    }

    const handleSuccessfulLogin = (access) => {
        snackbar.open('Successfully logged in as ' + access.email, 'success', 2000)
    }

    const handleRegisterClick = () => {
        history.replace({pathname: '/register'});
    }

    return (
        <div className={classes.body}>
            <div className={classes.container}>
                <form onSubmit={handleSubmit}>
                    <div className={classes.leftPanel}>
                        <div><img src={castleImg} alt="kgize" className={classes.castle} /></div>
                    </div>
                    <div className={classes.rightPanel}>
                        <h1><Language text={content.uwkgm} /></h1>
                        <p><Language text={content.description} /></p>
                        <div className={classes.form}>
                            <TextField
                                error={values.isLoginInvalid}
                                label={
                                    <Typography style={{display: 'inline-block'}}>
                                        <Language text={content.email} />
                                    </Typography>
                                }
                                margin="normal"
                                className={classes.textField}
                                onChange={handleChange('email')}
                                required
                                />
                            <TextField
                                error={values.isLoginInvalid}
                                label={
                                    <Typography style={{display: 'inline-block'}}>
                                        <Language text={content.password} />
                                    </Typography>
                                }
                                type="password"
                                autoComplete="current-password"
                                margin="normal"
                                className={classes.textField}
                                onChange={handleChange('password')}
                                required
                                />
                            <br />
                            <label className={classes.checkboxContainer}>
                                <Checkbox 
                                    value="saveLogin"
                                    label={
                                        <Typography style={{display: 'inline-block'}}>
                                            <Language text={content.save} />
                                        </Typography>
                                    }
                                    className={classes.checkbox}
                                    disabled
                                    />
                                <div className={classes.checkboxLabel}>
                                    <Language text={content.save} />
                                </div>
                            </label>
                        </div>
                        <div className={classes.messageBlock}>
                            <Language text={content.createDisabled} />
                        </div>
                        <div className={classes.buttonsBlock}>
                            <div>
                                <button type="submit" className="btn btn-primary">
                                    <Language text={content.login} />
                                </button>
                                <button type="button" className="btn btn-outline-secondary" style={{color: theme.palette.text.primary}} onClick={handleRegisterClick}>
                                    <Language text={content.create} />
                                </button>
                                <LanguageSelector className={classes.languageSelector} />
                            </div>
                        </div>
                        <div className={classes.footer}>
                            <ul>
                                <li><Link to="/home"><Language text={content.home} /></Link></li>
                                <li style={{opacity: .3}}><Language text={content.help} /></li>
                                <li style={{opacity: .3}}><Language text={content.privacy} /></li>
                                <li style={{opacity: .3}}><Language text={content.terms} /></li>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
