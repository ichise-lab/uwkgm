import React, { Suspense } from 'react';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import {
    Redirect,
    Route,
    Switch,
    useRouteMatch
} from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
import CallMadeIcon from '@material-ui/icons/CallMade';
import AssistantPhotoIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LockIcon from '@material-ui/icons/Lock';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import TuneIcon from '@material-ui/icons/Tune';
import Typography from '@material-ui/core/Typography';
import { useTheme } from "@material-ui/core/styles";

import { CatalogSelector } from 'services/catalogs/catalogs';
import { content } from './console.content';
import { Dashboard } from './dashboard/dashboard';
import { Demo } from './demo/demo';
import { getStyles } from 'styles/styles';
import { Language, LanguageSelector } from 'services/languages/languages';
import { Nav } from './nav/nav';
import { LoadingScreen } from 'components/common/loaders/screen/screen';
import { styles } from './console.css';
import { updateOptions } from './console.action';

export const initState = {
    appBar: {
        color: null,
        backgroundColor: null
    },
    page: {
        padding: null,
        backgroundColor: null
    },
    options: {
        isOpen: true
    }
}

export class ConsoleClass extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isNavOpen: false,
            appBarColor: 'White',
            shouldPadContent: true,
            contentBgColor: 'white'
        };

        this.Explorer = React.lazy(() => import('./explorer/explorer'));
        this.Mods = React.lazy(() => import('./mods/mods'));
        this.Visualizer = React.lazy(() => import('./viz/viz'));
    }

    handleNavOpen = () => {
        this.setState(() => ({isNavOpen: true}));
    };

    handleNavClose = () => {
        this.setState(() => ({isNavOpen: false}));
    };

    handleOptionOpen = () => {
        var options = this.props.reducers.console.options;
        options.isOpen = true;
        this.props.actions.console.updateOptions(options);
    }

    setAppBarColor = ([firstLetter, ...rest]) => {
        const color = [firstLetter.toLocaleUpperCase(), ...rest].join('');

        if (color !== this.state.appBarColor) {
            this.setState(() => ({
                appBarColor: [firstLetter.toLocaleUpperCase(), ...rest].join(''),
            }));
        }
    }

    setContentPadding = (shouldPad) => {
        this.setState(() => ({shouldPadContent: shouldPad}));
    }

    setContentBgColor = (color) => {
        this.setState(() => ({contentBgColor: color}));
    }

    componentDidMount() {
        this.setAppBarColor('white');
    }

    render() {
        return (
            <ConsoleFunc 
                isNavOpen={this.state.isNavOpen}
                onNavOpen={this.handleNavOpen}
                onNavClose={this.handleNavClose}
                isOptionOpen={this.props.reducers.console.options.isOpen}
                onOptionOpen={this.handleOptionOpen}
                Explorer={this.Explorer}
                Mods={this.Mods}
                Visualizer={this.Visualizer}
            />
        );
    }
}

const ConsoleFunc = props => {
    const reducer = useSelector(state => state.consoleReducer);
    const theme = useTheme();
    const classes = getStyles(styles.console);
    const history = useHistory();

    const { url } = useRouteMatch();
    const {
        isNavOpen,
        onNavOpen,
        onNavClose,
        isOptionOpen,
        onOptionOpen,
        Explorer,
        Mods,
        Visualizer
    } = props;

    const [accountEl, setAccountEl] = React.useState(null);
    const [showedDemoIntro, setShowedDemoIntro] = React.useState(false);

    const appBarStyles = {
        color: reducer.appBar.color === null ? theme.palette.text.primary : reducer.appBar.color,
        backgroundColor: reducer.appBar.backgroundColor === null ? theme.palette.background.appBar : reducer.appBar.backgroundColor
    }
    
    const buttonStyles = {
        color: reducer.appBar.color === null ? theme.palette.text.primary : reducer.appBar.color,
    }

    const pageStyles = {
        backgroundColor: reducer.page.backgroundColor === null ? theme.palette.background.default : reducer.page.backgroundColor
    }

    const handleAccountMenuOpen = event => {
        setAccountEl(event.currentTarget);
    }

    const handleAccountMenuClose = () => {
        setAccountEl(null);
    }

    const handleDemoIntroClose = () => {
        window.localStorage.setItem('showed_demo_intro', true);
        setShowedDemoIntro(true);
    }

    const handleLogOut = () => {
        history.replace({pathname: '/logout'});
    }

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {[classes.appBarShift]: isNavOpen,})} 
                style={appBarStyles}
            >
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={onNavOpen}
                        edge="start"
                        className={clsx(classes.menuButton, isNavOpen && classes.hide)} >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.toolbarTitle}>
                        <Language text={content.appBar.console} />
                    </Typography>
                    <div>
                        <LanguageSelector style={buttonStyles} />
                        <CatalogSelector style={buttonStyles} />
                        <IconButton aria-label="account" onClick={handleAccountMenuOpen}>
                            <AccountCircleIcon style={buttonStyles}  />
                        </IconButton>
                        {!isOptionOpen ?
                            <IconButton aria-label="options" onClick={onOptionOpen}>
                                <TuneIcon style={buttonStyles} />
                            </IconButton>
                        : ''}
                        <Menu 
                            anchorEl={accountEl}
                            open={Boolean(accountEl)}
                            onClose={handleAccountMenuClose}
                            keepMounted
                        >
                            <MenuItem onClick={handleAccountMenuClose}>
                                <ListItemIcon>
                                    <LockIcon />
                                </ListItemIcon>
                                <ListItemText primary="Manage" />
                            </MenuItem>
                            <MenuItem onClick={handleLogOut}>
                                <ListItemIcon>
                                    <CallMadeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Log out" />
                            </MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Nav 
                isNavOpen={isNavOpen}
                onNavClose={onNavClose}
            />
            <div 
                className={
                    clsx(classes.content, {
                        [classes.contentShift]: isNavOpen,
                    })}
                style={pageStyles}
            >
                <Switch>
                    <Route exact path={`${url}/`}>
                        <Redirect to={`${url}/home/dashboard`} />
                    </Route>
                    <Route path={`${url}/home/dashboard`}>
                        <Dashboard />
                    </Route>
                    <Route path={`${url}/api/explorer`}>
                        <Suspense fallback={<LoadingScreen text="Loading API explorer..." noCopyright />}>
                            <Explorer />
                        </Suspense>
                    </Route>
                    <Route path={`${url}/mods`}>
                        <Suspense fallback={<LoadingScreen text="Loading modifiers..." noCopyright />}>
                            <Mods />
                        </Suspense>
                    </Route>
                    <Route path={`${url}/graphs/visualizer`}>
                        <Suspense fallback={<LoadingScreen text="Loading visualizer..." noCopyright />}>
                            <Visualizer />
                        </Suspense>
                    </Route>
                </Switch>
            </div>
            <StatusBar />
            {window.localStorage.getItem('groups').includes('user_demo') && window.localStorage.getItem('showed_demo_intro') !== 'true' && !showedDemoIntro ?
                <Demo onClose={handleDemoIntroClose} />
            : ''}
        </div>
    );
}

const StatusBar = props => {
    const classes = getStyles(styles.statusBar);

    return (
        <div className={classes.container}>
            <div className={classes.left}>
                Ready
            </div>
            <div className={classes.right}>
                <div><AccountCircleIcon className={classes.icon} /></div>
                <div>{window.localStorage.getItem('email')}</div>
                {window.localStorage.getItem('groups').includes('user_demo') ?
                    <React.Fragment>
                        <div><AssistantPhotoIcon className={classes.icon} /></div>
                        <div>Live Demo</div>
                    </React.Fragment>
                : ''}
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        reducers: {
            console: state.consoleReducer
        }
    };
}

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            console: {
                updateOptions: bindActionCreators(updateOptions, dispatch)
            }
        }
    };
}

const Console = connect(mapStateToProps, mapDispatchToProps)(ConsoleClass);
export default Console;