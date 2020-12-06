import React from 'react';
import clsx from 'clsx';
import { connect } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloudCircleIcon from '@material-ui/icons/CloudCircle';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import DnsIcon from '@material-ui/icons/Dns';
import Drawer from '@material-ui/core/Drawer';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import LockIcon from '@material-ui/icons/Lock';
import Popover from '@material-ui/core/Popover';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import SettingsIcon from '@material-ui/icons/Settings';
import ShareIcon from '@material-ui/icons/Share';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import logoGreyImg from 'assets/images/logos/32x32-grey.png';
import logoImg from 'assets/images/logos/32x32.png';
import { auth } from 'services/auth';
import { content } from './nav.content';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { styles } from './nav.css';

const iconMap = {
    settings_applications: <SettingsApplicationsIcon />,
    dns: <DnsIcon />,
    home: <HomeIcon />,
    cloud_circle: <CloudCircleIcon />,
    share: <ShareIcon />,
    settings: <SettingsIcon />,
    account_circle: <AccountCircleIcon />
};

export class NavClass extends React.Component {
    state = {
        sections: [],
        groups: [],
        opens: []
    }

    handleToggle = (index) => {
        var opens = this.state.opens;
        opens[index] = !opens[index];
        this.setState((state, props) => ({opens: opens}));
    }

    componentDidMount() {
        var sections = [];
        var groups = [];
        var opens = [];

        content.map((section, index) => {
            sections.push(groups.length);
            for (var i = 0; i < section.items.length; i++) {
                groups.push(section.items[i]);
                opens.push(true);
            }
            return null;
        })

        sections.shift();

        this.setState((state, props) => ({
            sections: sections,
            groups: groups,
            opens: opens
        }));
    }

    render() {
        return (
            <React.Fragment>
                <NavExtendedFunc 
                    opens={this.state.opens}
                    groups={this.state.groups}
                    isNavOpen={this.props.isNavOpen}
                    onToggle={this.handleToggle}
                    onNavClose={this.props.onNavClose}
                />
                <NavShrinkedFunc 
                    groups={this.state.groups}
                    isNavOpen={this.props.isNavOpen}
                />
            </React.Fragment>
        );
    }
}

const NavExtendedFunc = props => {
    const classes = getStyles(styles.extended);
    const theme = useTheme();
    const {
        opens,
        groups,
        isNavOpen,
        onToggle,
        onNavClose
    } = props;

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={isNavOpen}
            classes={{
                paper: classes.paper,
            }}
            style={{backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.default}}
        >
            <div className={classes.header}>
                <div>
                    <Link to="/"><img src={theme.palette.type === 'light' ? logoImg : logoGreyImg} alt="UWKGM" /></Link>
                </div>
                <div>UWKGM</div>
                <IconButton onClick={onNavClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
            {groups !== null ?
                groups.map((group, index) => {
                    return (
                        <React.Fragment key={index}>
                            {(!('restriction' in group) || (group.restriction === 'admin' && auth.isAdmin())) ?
                                <React.Fragment>
                                    <NavExtendedGroup
                                        index={index}
                                        group={group}
                                        opens={opens}
                                        onToggle={onToggle} />
                                    <Divider />
                                </React.Fragment>
                            : ''}
                        </React.Fragment>
                    );
                })
            : ''}
        </Drawer>
    );
}

const NavExtendedGroup = props => {
    const classes = getStyles(styles.extended);
    const { 
        opens, 
        index, 
        group,
        onToggle
    } = props;

    return (
        <List className={classes.group} dense={true}>
            <ListItem button onClick={() => {onToggle(index)}}>
                <ListItemIcon className={classes.groupIconBlock}>
                    {iconMap[group.icon]}
                </ListItemIcon>
                <ListItemText primary={
                    <Typography className={classes.groupTitle} style={{fontSize: '.9em'}}>
                        <Language text={group.title} />
                    </Typography>
                } />
                {opens[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={opens[index]} timeout="auto" unmountOnExit>
                <List component="div" dense={true} disablePadding>
                    {(group.items.map((item, index) => (
                        <NavItem key={index} item={item} parent="extended" />
                    )))}
                </List>
            </Collapse>
        </List>
    );
}

const NavShrinkedFunc = props => {
    const classes = getStyles(styles.shrinked);
    const { groups } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openingGroup, setOpeningGroup] = React.useState(null);

    const handleMenuClick = (event, group) => {
        setAnchorEl(event.currentTarget);
        setOpeningGroup(group);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
        setOpeningGroup(null);
    };

    return (
        <div className={classes.container}>
            {groups !== null ?
                groups.map((group, index) => {
                    return (
                        (!('restriction' in group) || (group.restriction === 'admin' && auth.isAdmin())) ?
                            <div key={index} className={classes.itemBlock}>
                                <Tooltip title={<Language text={group.title} />} placement="right">
                                    <IconButton onClick={event => handleMenuClick(event, group)}>
                                        {iconMap[group.icon]}
                                    </IconButton>
                                </Tooltip>
                            </div>
                        : ''
                    );
                })
            : '' }
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {openingGroup !== null ?
                    <NavShrinkedGroup group={openingGroup} onItemClick={handleMenuClose} />
                : ''}
            </Popover>
        </div>
    );
}

const NavShrinkedGroup = props => {
    const { group, onItemClick } = props;

    return (
        <List component="div" style={{minWidth: 200}}>
            {group.items.map((item, index) => (
                <NavItem key={index} item={item} onItemClick={onItemClick} />
            ))}
        </List>
    );
}

const NavItem = props => {
    const classes = getStyles(styles.extended);
    const { item, parent, onItemClick } = props;
    const { url } = useRouteMatch();

    return (
        (!('restriction' in item) || (item.restriction === 'admin' && auth.isAdmin())) ?
            <Link to={('link' in item) ? item.link : '#'} className={classes.linkedItem} style={{textDecoration: 'none'}}>
                <ListItem button className={clsx({[parent === 'extended']: classes.nestedItem})} onClick={onItemClick}>
                    <ListItemText primary={
                        <Typography className={classes.itemTitle} style={{fontSize: '.9em'}}>
                            <Language text={item.title} />
                        </Typography>
                    } />
                    <ListItemSecondaryAction>
                        {('bubble' in item) ? 
                            <Avatar className={classes.bubble}>{item.bubble}</Avatar> 
                        : ''}
                        {('notification' in item) ? 
                            <Avatar className={clsx([classes.bubble, classes.notification])}>{item.notification}</Avatar> 
                        : ''}
                        {('developing' in item) ?
                            <TimelapseIcon style={{opacity: .3}} />
                        : ''}
                        {('extLink' in item) ?
                            <LinkIcon />
                        : ''}
                        {('locked' in item) ?
                            <LockIcon />
                        : ''}
                    </ListItemSecondaryAction>
                </ListItem>
            </Link>
        : ''
    );
}

const mapStateToProps = state => {
    return {
        reducers: {
            language: state.languageReducer
        }
    };
}

export const Nav = connect(mapStateToProps)(NavClass);
