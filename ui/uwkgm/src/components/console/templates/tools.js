import React from 'react';

import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';

import { getStyles } from 'styles/styles';
import { styles } from './tools.css';

export const getIconColors = theme => ({
    fill: theme.palette.type === 'light' ? theme.palette.colors.blue : theme.palette.colors.orange,
    stroke: theme.palette.type === 'light' ? theme.palette.colors.blue : theme.palette.colors.orange,
    text: theme.palette.text.primary,
    disabled: '#888'
});

export const LargeButton = props => {
    const classes = getStyles(styles).button;
    const theme = useTheme();
    const { icon, text, disabled, nonclickable, onClick } = props;
    const color = nonclickable === 'true' ? theme.palette.text.primary : disabled ? '#888' : null;
    
    return (
        <Button className={classes.singleBlock} onClick={onClick} {...props}>
            <div className={classes.singleContent}>
                <div style={{color: color}}>{icon}</div>
                <div style={{color: color}}>{text}</div>
            </div>
        </Button>
    );
}

export const SmallButton = props => {
    const classes = getStyles(styles).button;
    const { icon, text } = props;

    return (
        <Tooltip title={text} arrow>
            <span>
                <Button size="small" className={classes.icon} {...props}>
                    {icon}
                </Button>
            </span>
        </Tooltip>
    );
}

export const DoubleBlock = props => {
    const classes = getStyles(styles);
    const { style } = props;

    return (
        <div className={classes.tools.doubleBlock} style={style}>
            <div className={classes.button.upperBlockPadder} />
            {props.children}
        </div>
    );
}

export const Select = props => {
    const classes = getStyles(styles).select;
    const { width, icon, value, textAlign, disabled } = props;
    const color = disabled ? '#888' : 'white';

    return (
        <div className={classes.container} style={{width: width}}>
            <div className={classes.block}>
                <div className={classes.textBlock}>
                    {'icon' in props ? <div className={classes.iconBlock}>{icon}</div> : ''}
                    <div className={classes.text} style={{textAlign: textAlign || 'left', color: color}}>{value}</div>
                </div>
                <div className={classes.arrowBlock}>
                    <KeyboardArrowDownIcon style={{position: 'absolute', fontSize: 18, color: color}} />
                </div>
            </div>
        </div>
    );
}
