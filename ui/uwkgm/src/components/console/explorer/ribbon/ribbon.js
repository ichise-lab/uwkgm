import React from 'react';
import clsx from 'clsx';

import Box from '@material-ui/core/Box';
import Button from 'react-bootstrap/Button';
import InfoIcon from '@material-ui/icons/Info';
import FormControl from '@material-ui/core/FormControl';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Spinner from 'react-bootstrap/Spinner';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { auth } from 'services/auth';
import { content } from './ribbon.content';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { styles } from './ribbon.css';

export const Ribbon = props => {
    const classes = getStyles(styles);
    const { 
        server,
        version,
        isProcessing,
        onSubmit,
        onParamChange,
        onBranchChange,
        isTreeLoaded,
        activeBranch,
        activeEndpoint,
        tree
    } = props;

    const getSameLevelChildren = (tree, branch) => {
        if (branch.length > 1) {
            const node = branch[0];
            branch.shift();
            return getSameLevelChildren(tree[node], branch);
        } else {
            var choices = [];

            if ('*' in tree) {
                tree['*'].map((endpoint, index) => {
                    choices.push(endpoint.name);
                    return null;
                });

            }

            Object.keys(tree).map((node, index) => {
                if (node !== '*') {
                    choices.push(node);
                }
                return null;
            });

            return choices;
        }
    }

    var branch = [];

    return (
        <div className={classes.ribbon.container}>
            <form>
                <div className={classes.form.row}>
                    <FormControl className={clsx(classes.form.control, classes.ribbon.method)}>
                        <InputLabel>
                            <Language text={content.uri.method} />
                        </InputLabel>
                        <Select value="get">
                            <MenuItem value="get">GET</MenuItem>
                        </Select>
                    </FormControl>
                    <div className={classes.ribbon.nodesBlock}>
                        <FormControl className={clsx(classes.form.control, classes.ribbon.api)}>
                            <TextField 
                                label={
                                    <Typography>
                                        <Language text={content.uri.root} />
                                    </Typography>
                                }
                                value={server} 
                                style={{width: '100%'}}
                            />
                        </FormControl>
                        <FormControl className={clsx(classes.form.control, classes.ribbon.version)}>
                            <InputLabel>
                                <Language text={content.uri.version} />
                            </InputLabel>
                            <Select value={version}>
                                <MenuItem value={version}>{version}</MenuItem>
                            </Select>
                        </FormControl>
                        {(isTreeLoaded === true) ?
                            activeBranch.map((value, index) => {
                                branch.push(value);
                                return (
                                    <Node 
                                        activeChoice={value} 
                                        choices={getSameLevelChildren(tree, branch.slice())}
                                        onBranchChange={onBranchChange}
                                        branchLevel={index}
                                        key={index} 
                                    />
                                );
                            })
                        : ''}
                    </div>
                    <div className={classes.ribbon.buttonsBlock}>
                        <React.Fragment>
                            <Button 
                                variant="success" 
                                type="button" 
                                style={{marginRight: 15, width: 70}} 
                                disabled={isProcessing}
                                onClick={onSubmit}
                            >
                                {(isProcessing) ?
                                    <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                : <Language text={content.send} />}
                            </Button>
                        </React.Fragment>
                    </div>
                </div>
                <RibbonTabs 
                    activeEndpoint={activeEndpoint} 
                    onParamChange={onParamChange} 
                />
                <Description activeEndpoint={activeEndpoint} />
            </form>
        </div>
    );
}

const Node = props => {
    const classes = getStyles(styles.form);
    const { 
        activeChoice, 
        choices, 
        branchLevel,
        onBranchChange 
    } = props;

    return (
        <FormControl className={classes.control}>
            <InputLabel>
                {branchLevel === 0 ? <Language text={content.uri.api} /> : ''}
            </InputLabel>
            <Select value={activeChoice} onChange={(event) => onBranchChange(event, branchLevel)}>
                {
                    choices.map((value, index) => {
                        return <MenuItem value={value} key={index}>{value}</MenuItem>
                    })
                }
            </Select>
        </FormControl>
    );
}

const RibbonTabs = props => {
    const classes = getStyles(styles);
    const { activeEndpoint, onParamChange } = props
    const [ value, setValue ] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.form.row}>
            <Paper className={classes.ribbon.paper}>
                <div className={classes.ribbon.requestConfigBlock}>
                    <Tabs value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        orientation="vertical"
                        onChange={handleChange}
                        className={classes.ribbon.tabs}
                    >
                        <Tab label={<Language text={content.params} />} />
                        <Tab label={<Language text={content.auth} />} />
                    </Tabs>
                    <TabPanel 
                        value={value} 
                        index={0} 
                        className={classes.ribbon.panel}
                    >
                        <ParamsTab
                            activeEndpoint={activeEndpoint} 
                            onParamChange={onParamChange}
                        />
                    </TabPanel>
                    <TabPanel
                        value={value}
                        index={1}
                        className={classes.ribbon.panel}
                    >
                        <AuthTab />
                    </TabPanel>
                </div>
            </Paper>
        </div>
    );
}

const TabPanel = props => {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        <Box p={3}>{children}</Box>
      </Typography>
    );
  }

const ParamsTab = props => {
    const classes = getStyles(styles.ribbon);
    const { activeEndpoint, onParamChange } = props;
    const meta = activeEndpoint;
    
    const renderParam = (param, index, required) => {
        return (
            <Param name={param.name}
                   value={param.value}
                   annotation={param.annotation}
                   description={param.description}
                   onParamChange={onParamChange}
                   required={required}
                   key={index} />
        );
    };

    return (
        (meta !== null) ?
            <div className={classes.paramsBlock}>
                {meta.arguments.required.map((param, index) => {
                    return renderParam(param, index, true);
                })}
                {meta.arguments.optional.map((param, index) => {
                    return renderParam(param, index, false);
                })}
            </div>
        : ''
    );
}

const Param = props => {
    const classes = getStyles(styles.param);
    const { 
        name, 
        value,
        required,
        annotation, 
        description, 
        onParamChange
    } = props;

    return (
        <div className={classes.container}>
            <div className={classes.input}>
                <FormControl className={classes.form}>
                    <TextField 
                        required={required}
                        label={name}
                        value={value}
                        placeholder={annotation}
                        variant="outlined"
                        onChange={(event) => onParamChange(event, name)}
                        InputProps={{
                            endAdornment: 
                                <InputAdornment position="end">
                                    <Tooltip 
                                        title={annotation} 
                                        classes={{
                                            tooltip: classes.helpTooltip,
                                            arrow: classes.helpArrow
                                        }} 
                                        arrow
                                    >
                                        <HelpOutlineIcon className={classes.help} />
                                    </Tooltip>
                                </InputAdornment>
                        }} />
                </FormControl>
            </div>
            <div className={classes.description}>{description}</div>
        </div>
    );
}

const Description = props => {
    const classes = getStyles(styles.ribbon);
    const { activeEndpoint } = props;
    const meta = activeEndpoint;

    return (
        <div className={classes.endpointDescription}>
            <div>
                <InfoIcon style={{ fontSize: 48 }} />
            </div>
            <div>
                <div>
                    {(meta !== null) ? meta.description : ''}
                </div>
                <div>
                    <b>Returns: </b>
                    {(meta !== null && 'return' in meta) ? meta.return.description: ''}
                </div>
            </div>
        </div>
    );
}

const AuthTab = props => {
    const classes = getStyles(styles);
    const accessToken = auth.getTokens().access;
    const refreshToken = auth.getTokens().refresh;

    const acessTokenExpires = new Date(auth.decodeToken(accessToken).exp * 1000);
    const refreshTokenExpires = auth.decodeToken(refreshToken) !== null ? new Date(auth.decodeToken(refreshToken).exp * 1000) : '';

    return (
        <React.Fragment>
            <div className={classes.ribbon.paramsBlock}>
                <div className={classes.param.container}>
                    <div className={classes.param.input}>
                        <FormControl className={classes.param.form}>
                            <TextField 
                                label={<Language text={content.accessToken} />}
                                value={accessToken}
                                variant="outlined"
                            />
                        </FormControl>
                    </div>
                    <div className={classes.param.description}>
                        <Language text={content.expires} /> {acessTokenExpires.toString()}
                    </div>
                </div>
            </div>
            <div className={classes.ribbon.paramsBlock}>
                <div className={classes.param.container}>
                    <div className={classes.param.input}>
                        <FormControl className={classes.param.form}>
                            <TextField 
                                label={<Language text={content.refreshToken} />}
                                value={refreshToken.length ? refreshToken : '-'}
                                variant="outlined"
                            />
                        </FormControl>
                    </div>
                    <div className={classes.param.description}>
                        <Language text={content.expires} /> 
                        {refreshTokenExpires.toString()}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
