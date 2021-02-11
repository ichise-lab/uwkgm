import React, { Suspense } from 'react';
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch
} from "react-router-dom";
import { connect } from "react-redux";

import 'bootstrap/dist/css/bootstrap.min.css';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { ThemeProvider } from "@material-ui/core/styles";

import { SnackbarProvider, useSnackbar } from 'notistack';

import './App.scss';
import { auth } from 'services/auth';
import { darkTheme, lightTheme } from 'services/themes/themes.css';
import { Demo } from 'components/auth/demo/demo';
import { Login } from 'components/auth/login/login';
import { LoadingScreen } from 'components/common/loaders/screen/screen';

export class AppClass extends React.Component {
    snackbar = {
        position: {vertical: 'bottom', horizontal: 'center'},
        actions: {
            basic: () => {},
            closable: key => {
                return (
                    <React.Fragment>
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                        >
                            <CloseIcon />
                        </IconButton>
                    </React.Fragment>
                )
            }
        }
    }

    constructor(props) {
        super(props);

        this.Console = React.lazy(() => import('components/console/console'));
        this.Home = React.lazy(() => import('components/home/home'));
        this.Register = React.lazy(() => import('components/auth/register/register'));
    }

    componentDidMount() {
        this.snackbar.open('Running version ' + process.env.REACT_APP_VERSION + ' in ' + process.env.REACT_APP_ENV + ' environment', 'success', 3000);
    }

    render() {
        this.snackbar.action = this.snackbar.actions.basic;

        return (
            <ThemeProvider theme={this.props.reducers.themes.theme === 'light' ? lightTheme : darkTheme}>
                <SnackbarProvider 
                    maxSnack={3}
                    anchorOrigin={this.snackbar.position}
                    action={this.snackbar.action}
                >
                    <AppFunc
                        snackbar={this.snackbar}
                        Console={this.Console}
                        Home={this.Home}
                        Register={this.Register}
                    />
                </SnackbarProvider>
            </ThemeProvider>
        );
    }
}

const AppFunc = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { snackbar, Console, Home, Register } = props;

    snackbar.open = (message, variant, duration = 6000) => {
        enqueueSnackbar(message, {variant: variant, autoHideDuration: duration});
    };

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
                <Route path="/home">
                    <Suspense fallback={<LoadingScreen text="Loading UWKGM..." />}>
                        <Home />
                    </Suspense>
                </Route>
                <Route path="/login">
                    <Login snackbar={snackbar} />
                </Route>
                <Route path="/register">
                    <Suspense fallback={<LoadingScreen text="Loading registration page..." />}>
                        <Register snackbar={snackbar} />
                    </Suspense>
                </Route>
                <Route path="/demo">
                    <Demo />
                </Route>
                <Route path="/logout">
                    <Logout snackbar={snackbar} />
                </Route>
                <PrivateRoute path="/console">
                    <Suspense fallback={<LoadingScreen text="Loading console..." />}>
                        <Console />
                    </Suspense>
                </PrivateRoute>
            </Switch>
        </Router>
    );
}

const PrivateRoute = ({ children, ...rest }) => (
    <Route
        {...rest}
        render={({ location }) =>
            auth.isLoggedin() ? ( children ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: location }
                    }}
                />
            )
        }
    />
);

class Logout extends React.Component {
    componentDidMount() {
        auth.logout(this.props.snackbar);
    }

    render() {
        return (
            <Redirect to="/home" />
        );
    }
}

const mapStateToProps = state => {
    return {
        reducers: {
            themes: state.themeReducer,
            languages: state.languageReducer
        }
    };
}

export const App = connect(mapStateToProps)(AppClass);
