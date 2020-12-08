import React from 'react';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import { getStyles } from 'styles/styles';
import { styles } from './options.css';
import { updateOptions } from 'components/console/console.action';


export class OptionsClass extends React.Component {
    handleOptionsClose = () => {
        var options = this.props.reducers.console.options;
        options.isOpen = false;
        this.props.actions.console.updateOptions(options);
    }

    componentDidMount() {
        var options = this.props.reducers.console.options;
        options.isOpen = true;
        this.props.actions.console.updateOptions(options);
    }

    render() {
        return (
            <OptionsFunc 
                title={this.props.title}
                isOptionsOpen={this.props.reducers.console.options.isOpen}
                onOptionsClose={this.handleOptionsClose}
                disabled={this.props.disabled}
                children={this.props.children}
            />
        );
    }
}

export const OptionsFunc = props => {
    const classes = getStyles(styles.options);
    const theme = useTheme();
    const { 
        title,
        isOptionsOpen,
        onOptionsClose,
        disabled
    } = props;

    return (
        <Drawer
            variant="persistent"
            anchor="right"
            open={isOptionsOpen}
            classes={{paper: classes.paper}}
        >
            <div className={classes.header}>
                <div>
                    <IconButton onClick={onOptionsClose}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <div>{title}</div>
                <div></div>
            </div>
            <Divider />
            <form>
                {props.children}
            </form>
            {disabled ?
                <div className={classes.disabled} />
            : ''}
        </Drawer>
    );
}

export const FlexContent = props => {
    const classes = getStyles(styles).options;
    const { isOptionsOpen } = props;

    return (
        <div
            className={clsx(classes.content, {
                [classes.contentShift]: isOptionsOpen,
            })}
        >
            {props.children}
        </div>
    );
}

export const Section = props => {
    const classes = getStyles(styles.section);
    const {
        title,
        isOpen,
        isFoldable,
        onToggle,
        contentPaddingTop,
        contentPaddingBottom
    } = props;

    return (
        <React.Fragment>
            <div className={classes.block}>
                <div className={classes.head}>
                    <div className={classes.title}>
                        {title}
                    </div>
                    {(isFoldable === true) ?
                        <div className={classes.expand}>
                            <IconButton size="small" onClick={onToggle}>
                                {(isOpen === true) ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </div>
                    : ''}
                </div>
                <div className={classes.content}>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <div style={{
                            paddingTop: ('contentPaddingTop' in props) ? contentPaddingTop : 0,
                            paddingBottom: ('contentPaddingBottom' in props) ? contentPaddingBottom : 0
                        }}>
                            {props.children}
                        </div>
                    </Collapse>
                </div>
            </div>
            <Divider />
        </React.Fragment>
    );
}

export const SubHeader = props => {
    const classes = getStyles(styles.options);
    const {
        title
    } = props;

    return (
        <div className={classes.block}>
            <div className={classes.subHeader}>
                {title}
            </div>
        </div>
    );
}

export const Tabs = props => {
    const classes = getStyles(styles.tab);
    const children = React.Children.toArray(props.children);

    const [openingTab, setTabOpen] = React.useState(0);

    const handleSelectTab = newValue => {
        setTabOpen(newValue);
    }

    return (
        <React.Fragment>
            <div className={classes.container}>
                <div className={classes.block}>
                    {children.map((child, childIndex) => (
                        <div 
                            key={childIndex} 
                            className={clsx(classes.item, 
                                {[classes.itemSelected]: childIndex === openingTab})}
                            onClick={() => handleSelectTab(childIndex)}>
                            {child.props.title}
                        </div>
                    ))}
                </div>
            </div>
            {children.map((child, childIndex) => (
                childIndex === openingTab ? child : ''
            ))}
        </React.Fragment>
    );
}

export const Tab = props => {
    return (
        <div>{props.children}</div>
    );
}

export const SelectBlock = props => {
    const classes = getStyles(styles);
    const {
        label,
        value,
        options,
        onChange
    } = props;

    const handleChange = event => {
        if (typeof onChange !== 'undefined') {
            onChange(event.target.value);
        }
    }
    
    return (
        <div className={classes.options.block}>
            <FormControl className={classes.select.formControl}>
                <InputLabel>{label}</InputLabel>
                <Select
                    value={value}
                    onChange={handleChange}
                >
                    {options.map((item, index) => (
                        <MenuItem value={item.value} key={index}>
                            {item.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export const SliderBlock = props => {
    const classes = getStyles(styles);
    const theme = useTheme();
    const {
        label,
        value,
        min,
        max,
        step,
        disabled,
        flexMin,
        flexMax,
        onChange,
        onChangeCommitted
    } = props;

    const [internalValue, setInternalValue] = React.useState(value);

    const fitValueInRange = (newValue) => {
        if (!flexMin && newValue < min) {
            return min;
        } else if (!flexMax && newValue > max) {
            return max;
        } else {
            return newValue;
        }
    }

    const handleChangeCommitted = () => {
        if (typeof onChangeCommitted !== 'undefined') {
            onChangeCommitted(internalValue);
        }
    }

    const handleSliderChange = (event, newValue) => {
        setInternalValue(newValue);

        if (typeof onChange !== 'undefined') {
            onChange(newValue);
        }
    }

    const handleInputChange = event => {
        const newValue = fitValueInRange(event.target.value);
        setInternalValue(newValue);

        if (typeof onChangeCommitted !== 'undefined') {
            onChangeCommitted(newValue);
        }
    }

    return (
        <div className={clsx(classes.options.block, classes.slider.block)}>
            <div className={classes.slider.content}>
                <div>
                    <div className={classes.slider.title}>{label}</div>
                    <Slider
                        value={parseInt(internalValue) || min}
                        max={max}
                        color={theme.palette.type === 'dark' ? 'secondary' : 'primary'}
                        disabled={disabled}
                        onChange={handleSliderChange}
                        onChangeCommitted={handleChangeCommitted}
                    />
                </div>
                <div>
                    <Input
                        value={internalValue}
                        disabled={disabled}
                        onChange={handleInputChange}
                        onBlur={handleChangeCommitted}
                        inputProps={{
                            step: {step},
                            min: {min},
                            max: {max},
                            type: 'number'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export const SwitchBlock = props => {
    const classes = getStyles(styles);
    const theme = useTheme();
    const {
        label,
        checked,
        value,
        disabled,
        onChange
    } = props;

    const handleChange = event => {
        onChange(event.target.checked)
    }

    return (
        <div className={clsx(classes.options.block, classes.switch.block)}>
            <FormControlLabel
                control={
                    <Switch 
                        checked={checked}
                        onChange={handleChange}
                        value={value}
                        size="small"
                        color={theme.palette.type === 'dark' ? 'secondary' : 'primary'}
                        className={classes.switch.switch}
                        disabled={disabled}
                    />
                }
                label={
                    <Typography className={classes.switch.label}>
                        {label}
                    </Typography>
                }
            />
        </div>
    );
}

export const GroupedButtonBlock = props => {
    const classes = getStyles(styles);
    const { label } = props;

    return (
        <div className={classes.options.block}>
            {'label' in props ? 
                <div className={classes.groupedButton.label}>{label}</div> : 
            ''}
            <div className={classes.groupedButton.container}>
                {props.children}
            </div>
        </div>
    );
}

export const GroupedButton = props => {
    const classes = getStyles(styles.groupedButton);
    const { onClick, tooltip } = props;

    return (
        'tooltip' in props ?
            <Tooltip title={tooltip} arrow>
                <div className={classes.item} onClick={onClick}>
                    {props.children}
                    <div className={classes.divider} />
                </div>
            </Tooltip>
        :
            <div className={classes.item} onClick={onClick}>
                {props.children}
                <div className={classes.divider} />
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

export const Options = connect(mapStateToProps, mapDispatchToProps)(OptionsClass);
