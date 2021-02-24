import React from 'react';

import CloudCircleIcon from '@material-ui/icons/CloudCircle';
import FlareIcon from '@material-ui/icons/Flare';
import FlipToFrontIcon from '@material-ui/icons/FlipToFront';
import InputAdornment from '@material-ui/core/InputAdornment';
import LensIcon from '@material-ui/icons/Lens';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import SecurityIcon from '@material-ui/icons/Security';
import SpeedIcon from '@material-ui/icons/Speed';
import TextButton from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import { useTheme } from "@material-ui/core/styles";

import { apiEndpoint } from 'services/servers';
import { auth } from 'services/auth';
import { content, mockProgress } from './api.content';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { styles } from './api.css';

export class Api extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
            accessToken: auth.getTokens().access,
            refreshToken: auth.getTokens().refresh
        }
    }

    render() {
        return (
            <ApiFunc
                accessToken={this.state.accessToken}
                refreshToken={this.state.refreshToken}
            />
        );
    }
}

const ApiFunc = props => {
    const classes = getStyles(styles);
    const {
        accessToken,
        refreshToken
    } = props;

    return (
        <React.Fragment>
            <div className={classes.api.content}>
                <div className={classes.grid.container}>
                    <div className={classes.grid.row}>
                        <Server />
                        <Throttling />
                    </div>
                    <div className={classes.grid.row}>
                        <Spotlight />
                        <Authorization accessToken={accessToken} refreshToken={refreshToken} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const Server = props => {
    const colors = useTheme().palette.colors;
    const classes = getStyles(styles);

    return (
        <div className={classes.card.block}>
            <div className={classes.card.title}>
                <div className={classes.card.titleText}>
                    <Language text={content.server.title} />
                </div>
                <div className={classes.card.titleButton}>
                    <LensIcon style={{fontSize: '1.5em', marginRight: 5, color: colors.green}} />
                    <Language text={content.server.healthy} />
                </div>
            </div>
            <div className={classes.card.content}>
                <div className={classes.card.iconBlock}>
                    <CloudCircleIcon className={classes.card.icon} style={{color: colors.blue}} />
                </div>
                <div className={classes.card.detail}>
                    <b style={{fontSize: '.9em'}}><Language text={content.server.endpoint} /></b>
                    <p style={{fontSize: '.9em'}}><Language text={content.server.description} /></p>
                    <TextField
                        label={
                            <Typography>
                                <Language text={content.server.root} />
                            </Typography>
                        }
                        value={apiEndpoint + '/'}
                        variant="outlined"
                        style={{width: '100%', marginBottom: 30}}
                        InputProps={{
                            endAdornment: 
                                <InputAdornment position="end">
                                    <FlipToFrontIcon />
                                </InputAdornment>
                        }} 
                    />
                </div>
            </div>
        </div>
    );
}

const Throttling = props => {
    const theme = useTheme();
    const colors = theme.palette.colors;
    const classes = getStyles(styles.card);

    return (
        <div className={classes.block} style={{flex: '0 0 300px', minWidth: 300}}>
            <div className={classes.title}>
                <div className={classes.titleText}>
                    <Language text={content.throttle.title} />
                </div>
                <div className={classes.titleButton} style={{flex: '0 0 100px'}}>
                    
                </div>
            </div>
            <div className={classes.content}>
                <div className={classes.detail} style={{display: 'flex'}}>
                    <div style={{flex: 1, textAlign: 'center', borderRight: '1px solid ' + theme.palette.divider}}>
                        <SpeedIcon className={classes.icon} style={{color: colors.orange}} />
                        <div style={{fontSize: '.9em', fontWeight: 'bold'}}><Language text={content.throttle.base} /></div>
                        <div style={{fontSize: '2em', fontWeight: 'bold'}}>100</div>
                        <div style={{fontSize: '.85em'}}><Language text={content.throttle.unit} /></div>
                    </div>
                    <div style={{flex: 1, textAlign: 'center'}}>
                        <WhatshotIcon className={classes.icon} style={{color: colors.red}} />
                        <div style={{fontSize: '.9em', fontWeight: 'bold'}}><Language text={content.throttle.boost} /></div>
                        <div style={{fontSize: '2em', fontWeight: 'bold'}}>-</div>
                        <div style={{fontSize: '.85em'}}><Language text={content.throttle.unit} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Spotlight = props => {
    const colors = useTheme().palette.colors;
    const classes = getStyles(styles.card);

    return (
        <div className={classes.block}>
            <div className={classes.title}>
                <div className={classes.titleText}>
                    <Language text={content.spotlights.title} />
                </div>
            </div>
            <div className={classes.content}>
                <div className={classes.iconBlock}>
                    <FlareIcon className={classes.icon} style={{color: colors.yellow}} />
                </div>
                <div className={classes.detail} style={{paddingLeft: 0}}>
                    <b style={{fontSize: '.9em'}}><Language text={content.spotlights.works} /></b>
                    <List
                        component="div"
                        className={classes.list} 
                        dense={true}
                    >
                        {mockProgress.map((item, index) => (
                            <ListItem button key={index}>
                                <ListItemText primary={
                                    <Typography style={{fontSize: '.9em'}}>
                                        <Language text={item.text} />
                                    </Typography>
                                } />
                                <SpotlightStatus status={item.status} colors={colors} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </div>
        </div>
    );
}

const Authorization = (props) => {
    const colors = useTheme().palette.colors;
    const classes = getStyles(styles.card);
    const {
        accessToken,
        refreshToken
    } = props;

    const acessTokenExpires = new Date(auth.decodeToken(accessToken).exp * 1000);
    const refreshTokenExpires = auth.decodeToken(refreshToken) !== null ? new Date(auth.decodeToken(refreshToken).exp * 1000) : '';

    return (
        <div className={classes.block}>
            <div className={classes.title}>
                <div className={classes.titleText}>
                    <Language text={content.auth.title} />
                </div>
                <div className={classes.titleButton}>
                    <TextButton className={classes.cardButton}>
                        <Language text={content.auth.refresh} />
                    </TextButton>
                </div>
            </div>
            <div className={classes.content}>
                <div className={classes.iconBlock}>
                    <SecurityIcon className={classes.icon} style={{color: colors.orange}} />
                </div>
                <div className={classes.detail} style={{paddingLeft: 0}}>
                    <div style={{fontSize: '.9em', marginBottom: 20}}>
                        <Language text={content.auth.description} />
                    </div>
                    <div>
                        <TextField
                            label={
                                <Typography>
                                    <Language text={content.auth.accessToken} />
                                </Typography>
                            }
                            value={accessToken}
                            helperText={
                                <span>
                                    <Language text={content.auth.expires} /> {acessTokenExpires.toString()}
                                </span>
                            }
                            variant="outlined"
                            style={{width: '100%', marginBottom: 30}}
                            InputProps={{
                                endAdornment: 
                                    <InputAdornment position="end">
                                        <FlipToFrontIcon />
                                    </InputAdornment>
                            }} 
                        />
                        <TextField
                            label={
                                <Typography>
                                    <Language text={content.auth.refreshToken} />
                                </Typography>
                            }
                            value={refreshToken.length ? refreshToken : '-'}
                            helperText={
                                <span>
                                    <Language text={content.auth.expires} /> 
                                    {refreshTokenExpires.toString()}
                                </span>
                            }
                            variant="outlined"
                            style={{width: '100%'}}
                            InputProps={{
                                endAdornment: 
                                    <InputAdornment position="end">
                                        <FlipToFrontIcon />
                                    </InputAdornment>
                            }} 
                            />
                        </div>
                </div>
            </div>
        </div>
    );
}

const SpotlightStatus = props => {
    const { status, colors } = props;

    const rederColor = () => {
        if (status === 'finished') {
            return colors.green;
        } else if (status === 'working') {
            return colors.blue;
        } else if (status === 'pending') {
            return colors.yellow;
        } else {
            return colors.grey;
        }
    }

    return (
        <ListItemSecondaryAction>
            <LensIcon style={{
                fontSize: '.9em',
                color: rederColor()
            }} />
        </ListItemSecondaryAction>
    );
};
