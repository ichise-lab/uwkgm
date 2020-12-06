import React from 'react';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Draggable from 'react-draggable';
import { ChromePicker } from 'react-color';

import { getStyles } from 'styles/styles';
import { SliderBlock } from 'components/console/templates/options';
import { styles } from './widgets.css';

export class Widgets extends React.Component {
    state = {
        draggable: {
            x: 0,
            y: 0,
            opacity: 0
        }
    }

    constructor(props) {
        super(props);

        this.innerContainer = React.createRef();
        this.draggable = React.createRef();
    }

    initDraggable = items => {
        this.setState(() => ({
            draggable: {x: this.innerContainer.current.offsetWidth - 245, y: 20}
        }));
    }

    handleControlledDrag = (event, position) => {
        this.setState(() => ({draggable: {x: position.x, y: position.y, opacity: 1}}));
    }

    handleClickAway = () => {
        if (this.props.widgets.length) {

            this.props.widgets.map(widget => {
                if ('onClose' in widget) {
                    widget.onClose();
                }

                return null;
            });

            this.props.closeWidgets();
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.initDraggable();
        }, 1);
    }

    render() {
        return (
            <WidgetsFunc 
                x={this.state.draggable.x}
                y={this.state.draggable.y}
                opacity={this.state.draggable.opacity}
                innerContainer={this.innerContainer}
                widgets={this.props.widgets}
                onClickAway={this.handleClickAway}
                onControlledDrag={this.handleControlledDrag}
            />
        );
    }
}

export const WidgetsFunc = props => {
    const classes = getStyles(styles.widgets);
    const {
        x,
        y,
        opacity,
        innerContainer,
        widgets,
        onClickAway,
        onControlledDrag
    } = props;

    return (
        <div style={{position: 'absolute', overflow: 'hidden', width: '100%', height: 'calc(100% - 114px)', left: 0, top: 114, opacity: opacity}} ref={innerContainer}>
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <ClickAwayListener onClickAway={onClickAway}>
                    <Draggable 
                        bounds="parent" 
                        position={{
                            x: x, 
                            y: y}} 
                        onDrag={onControlledDrag} 
                    >
                        <div className={classes.container}>
                            {widgets.map((widget, widgetIndex) => (
                                <Widget
                                    block={widget.type !== 'colorPicker'}
                                    style={widget.type === 'colorPicker' ? {paddingTop: 0} : {}}
                                    key={widgetIndex}
                                >
                                    {widget.type === 'colorPicker' ? <ColorPicker 
                                        onColorChange={widget.onColorChange} 
                                        initColor={'initColor' in widget ? widget.initColor : '#22194D'}
                                    /> : ''}
                                    {widget.type === 'range' ? <Range 
                                        label={widget.label}
                                        initValue={'initValue' in widget ? widget.initValue : 0}
                                        min={widget.min}
                                        max={widget.max}
                                        step={widget.step}
                                        disabled={'disabled' in widget ? widget.disabled : false}
                                        flexMin={'flexMin' in widget ? widget.flexMin : false}
                                        flexMax={'flexMax' in widget ? widget.flexMax : false}
                                        onChange={'onChange' in widget ? widget.onChange : null}
                                        onChangeCommitted={'onChangeCommitted' in widget ? widget.onChangeCommitted : null}
                                    /> : ''}
                                </Widget>
                            ))}
                        </div>
                    </Draggable>
                </ClickAwayListener>
            </div>
        </div>
    );
}

export const Widget = props => {
    const classes = getStyles(styles.widgets);
    const { block, style } = props;

    return (
        <div
            className={block ? classes.block : ''}
            style={style}
        >
            {props.children}
        </div>
    );
}

export const ColorPicker = props => {
    const { 
        onColorChange, 
        initColor 
    } = props;
    
    const [color, setColor] = React.useState(initColor);

    const handleColorChange = newColor => {
        onColorChange(newColor);
        setColor(newColor.rgb);
    }

    return (
        <ChromePicker 
            color={color}
            onChange={handleColorChange}
        />
    );
}

export const Range = props => {
    const { 
        label,
        initValue,
        min,
        max,
        step,
        disabled,
        flexMin,
        flexMax,
        onChange,
        onChangeCommitted
    } = props;

    const [value, setValue] = React.useState(initValue);

    const handleChange = newValue => {
        if (onChange !== null) {
            onChange(newValue);
        }

        setValue(value);
    }

    const handleChangeCommitted = newValue => {
        if (onChangeCommitted !== null) {
            onChangeCommitted(newValue);
        }

        setValue(value);
    }

    return (
        <div>
            <SliderBlock
                label={label}
                value={value}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                flexMin={flexMin}
                flexMax={flexMax}
                onChange={handleChange}
                onChangeCommitted={handleChangeCommitted}
            />
        </div>
    );
}
