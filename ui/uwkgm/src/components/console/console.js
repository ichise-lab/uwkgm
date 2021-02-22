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
import ShareIcon from '@material-ui/icons/Share';
import Toolbar from '@material-ui/core/Toolbar';
import TuneIcon from '@material-ui/icons/Tune';
import Typography from '@material-ui/core/Typography';
import { useTheme } from "@material-ui/core/styles";

import { CatalogSelector, getActiveCatalog } from 'services/catalogs/catalogs';
import { content } from './console.content';
import { Dashboard } from './dashboard/dashboard';
import { Demo } from './demo/demo';
import { fetchCatalogs } from 'services/catalogs/catalogs';
import { getStyles } from 'styles/styles';
import { Language, LanguageSelector } from 'services/languages/languages';
import { Nav } from './nav/nav';
import { LoadingScreen } from 'components/common/loaders/screen/screen';
import { publicURL } from 'services/servers';
import { styles } from './console.css';
import { updateActiveCatalog, updateCatalogs } from 'services/catalogs/catalogs.action';
import { updateOptions } from './console.action';

export const initState = {
    appBar: {
        color: null,
        backgroundColor: null,
        title: null
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

        this.Catalogs = React.lazy(() => import('./catalogs/catalogs'));
        this.Entity = React.lazy(() => import('./entity/entity'));
        this.Explorer = React.lazy(() => import('./explorer/explorer'));
        this.Mods = React.lazy(() => import('./mods/mods'));
        this.Visualizer = React.lazy(() => import('./viz/viz'));
        this.isComponentMounted = false;
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
        this.isComponentMounted = true;
        this.setAppBarColor('white');
        fetchCatalogs(this.props.reducers.catalogs, this.props.actions.catalogs);
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    render() {
        return (
            <ConsoleFunc 
                consoleReducer={this.props.reducers.console}
                catalogReducer={this.props.reducers.catalogs}
                isNavOpen={this.state.isNavOpen}
                onNavOpen={this.handleNavOpen}
                onNavClose={this.handleNavClose}
                isOptionOpen={this.props.reducers.console.options.isOpen}
                onOptionOpen={this.handleOptionOpen}
                Catalogs={this.Catalogs}
                Entity={this.Entity}
                Explorer={this.Explorer}
                Mods={this.Mods}
                Visualizer={this.Visualizer}
            />
        );
    }
}

const ConsoleFunc = props => {
    const theme = useTheme();
    const classes = getStyles(styles.console);
    const history = useHistory();

    const { url } = useRouteMatch();
    const {
        consoleReducer,
        catalogReducer,
        isNavOpen,
        onNavOpen,
        onNavClose,
        isOptionOpen,
        onOptionOpen,
        Catalogs,
        Entity,
        Explorer,
        Mods,
        Visualizer
    } = props;

    const [accountEl, setAccountEl] = React.useState(null);
    const [showedDemoIntro, setShowedDemoIntro] = React.useState(false);

    const appBarStyles = {
        color: consoleReducer.appBar.color === null ? theme.palette.text.primary : consoleReducer.appBar.color,
        backgroundColor: consoleReducer.appBar.backgroundColor === null ? theme.palette.background.appBar : consoleReducer.appBar.backgroundColor
    }
    
    const buttonStyles = {
        color: consoleReducer.appBar.color === null ? theme.palette.text.primary : consoleReducer.appBar.color,
    }

    const pageStyles = {
        backgroundColor: consoleReducer.page.backgroundColor === null ? theme.palette.background.default : consoleReducer.page.backgroundColor
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
        history.replace({pathname: `${publicURL}/logout`});
    }

    return (
        catalogReducer.catalogs === null ?
            <LoadingScreen text="Loading console..." />
        :
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
                            {consoleReducer.appBar.title !== null ?
                                consoleReducer.appBar.title.map((text, id) => (
                                    <React.Fragment key={id}>
                                        <span className={classes.toolbarTitleDot}>&middot; </span>
                                        <span className={classes.toolbarTitleText}>{text}</span>
                                    </React.Fragment>
                                ))
                            : '' }
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
                        <Route path={`${url}/catalogs`}>
                            <Suspense fallback={<LoadingScreen text="Loading catalogs..." noCopyright />}>
                                <Catalogs />
                            </Suspense>
                        </Route>
                        <Route path={`${url}/api/explorer`}>
                            <Suspense fallback={<LoadingScreen text="Loading API explorer..." noCopyright />}>
                                <Explorer />
                            </Suspense>
                        </Route>
                        <Route path={`${url}/entity`}>
                            <Suspense fallback={<LoadingScreen text="Loading entity editor..." noCopyright />}>
                                <Entity />
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
                <StatusBar 
                    activeCatalog={getActiveCatalog(catalogReducer)}
                />
                {window.localStorage.getItem('groups').includes('user_demo') && window.localStorage.getItem('showed_demo_intro') !== 'true' && !showedDemoIntro ?
                    <Demo onClose={handleDemoIntroClose} />
                : ''}
            </div>
    );
}

const StatusBar = props => {
    const classes = getStyles(styles.statusBar);
    const { activeCatalog }  = props;

    return (
        <div className={classes.container}>
            <div className={classes.left}>
                Ready
            </div>
            <div className={classes.right}>
                {activeCatalog !== null ?
                    <React.Fragment>
                        <div><ShareIcon className={classes.icon} /></div>
                        <div>{activeCatalog.title}</div>
                    </React.Fragment>
                : ''}
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
            console: state.consoleReducer,
            catalogs: state.catalogReducer
        }
    };
}

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            console: {
                updateOptions: bindActionCreators(updateOptions, dispatch)
            },
            catalogs: {
                updateCatalogs: bindActionCreators(updateCatalogs, dispatch),
                updateActiveCatalog: bindActionCreators(updateActiveCatalog, dispatch)
            }
        }
    };
}

const Console = connect(mapStateToProps, mapDispatchToProps)(ConsoleClass);
export default Console;