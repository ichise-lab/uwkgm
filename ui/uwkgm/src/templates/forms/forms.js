import React from 'react';
import clsx from 'clsx';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import { ChromePicker } from 'react-color';

import { getStyles } from 'styles/styles';
import { styles } from './forms.css';

export const Selector = props => {
    const classes = getStyles(styles.form);
    const {
        choices,
        value,
        color,
        onClick
    } = props;

    const handleButtonClick = event => {
        onClick(event, choices, value);
    }

    return (
        <button 
            className={clsx([classes.block, classes.select], {[classes[color]]: typeof color !== 'undefined'})} 
            onClick={handleButtonClick}
        >
            <span>{'title' in choices[value] ? choices[value].title : value}</span>
            <KeyboardArrowDownIcon style={{fontSize: '1em'}} />
        </button>
    );
}

export const SelectorMenu = props => {
    const { 
        selector,
        choices,
        value,
        onSelect,
        onClose
    } = props;

    return (
        <Menu
            anchorEl={selector}
            keepMounted
            open={Boolean(selector)}
            onClose={onClose}
        >
            {Boolean(selector) ?
                Object.keys(choices).map((key, index) => (
                    <MenuItem 
                        key={index}
                        selected={value === key}
                        disabled={choices[key].disabled}
                        onClick={() => onSelect(key)}
                        dense
                    >{'title' in choices[key] ? choices[key].title : choices[key]}</MenuItem>
                ))
            : ''}
        </Menu>
    );
}

export const ColorPopover = props => {
    const {
        selector,
        onSelect,
        onClose,
        initColor
    } = props;

    const [color, setColor] = React.useState(initColor || {r: 0, g: 0, b: 0, a: 1});

    const handleColorChange = newColor => {
        onSelect(newColor);
        setColor(newColor.rgb);
    }

    return (
        <Popover
            anchorEl={Boolean(selector) ? selector : null}
            open={Boolean(selector)}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <ChromePicker 
                color={color}
                onChange={handleColorChange}
            />
        </Popover>
    );
}
