import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import { content } from './options.content';
import { defaultLanguage, Language } from 'services/languages/languages';
import { getStyles } from 'styles/styles';
import { 
    GroupedButton,
    GroupedButtonBlock,
    Section,
    SelectBlock,
    SliderBlock,
    SubHeader,
    SwitchBlock,
    Tab,
    Tabs
} from 'components/console/templates/options';
import { styles as optionStyles} from 'components/console/templates/options.css';
import { styles } from './options.css';
import { updateOptions } from '../graphs.action';

import FontColorIcon from 'assets/icons/FontColor';
import LabelBackgroundIcon from 'assets/icons/LabelBackground';
import LabelBorderIcon from 'assets/icons/LabelBorder';
import NodeColorIcon from 'assets/icons/NodeColor';
import NodeBorderIcon from 'assets/icons/NodeBorder';

export class OptionsClass extends React.Component {
    constructor(props) {
        super(props);

        this.nSections = 3;
        var opens = [false, true, false];

        this.state = {opens: opens};
    }

    handleSectionToggle = (index) => {
        var opens = this.state.opens;
        opens[index] = !opens[index];
        this.setState((state, props) => ({opens: opens}));
    }

    handleColorSetAdd = async color => {
        var options = this.props.reducers.graphs.options;
        options.styles.colorSet.push(color);
        this.props.actions.graphs.updateOptions(options);
    }

    handleColorSetChange = async (index, color) => {
        var options = this.props.reducers.graphs.options;
        options.styles.colorSet[index] = color.rgb;
        this.props.actions.graphs.updateOptions(options);
    }

    handleColorSetRemove = async index => {
        var options = this.props.reducers.graphs.options;
        var newSet = [];

        for (let i = 0; i < options.styles.colorSet.length; i++) {
            if (i !== index) {
                newSet.push(options.styles.colorSet[i]);
            }
        }

        options.styles.colorSet = newSet;
        this.props.actions.graphs.updateOptions(options);
    }

    render() {
        return (
            <OptionsFunc 
                graph={this.props.reducers.graphs.graph}
                options={this.props.reducers.graphs.options}
                updateOptions={this.props.actions.graphs.updateOptions}
                language={this.props.reducers.languages.language}
                isOpens={this.state.opens} 
                openWidgets={this.props.openWidgets}
                onSectionToggle={this.handleSectionToggle}
                nodes={this.props.nodes}
                onColorSetAdd={this.handleColorSetAdd}
                onColorSetChange={this.handleColorSetChange}
                onColorSetRemove={this.handleColorSetRemove}
                onDeleteNode={this.props.handleDeleteNode}
            />
        );
    }
}

const OptionsFunc = (props) => {
    const { 
        graph,
        options,
        updateOptions,
        language,
        isOpens,
        openWidgets,
        onSectionToggle,
        nodes,
        onMainLinkChange,
        onColorSetAdd,
        onColorSetChange,
        onColorSetRemove,
        onDeleteNode
    } = props;

    return (
        <React.Fragment>
            <Graph 
                options={options}
                updateOptions={updateOptions}
                isOpens={isOpens}
                onSectionToggle={onSectionToggle}
                onMainLinkChange={onMainLinkChange}
            />
            <Styles
                options={options}
                updateOptions={updateOptions}
                language={language}
                isOpens={isOpens}
                openWidgets={openWidgets}
                onSectionToggle={onSectionToggle}
                onColorSetAdd={onColorSetAdd}
                onColorSetChange={onColorSetChange}
                onColorSetRemove={onColorSetRemove}
            />
            <Nodes
                graph={graph}
                isOpens={isOpens}
                onSectionToggle={onSectionToggle}
                nodes={nodes}
                onDeleteNode={onDeleteNode}
            />
        </React.Fragment>
    );
}

const Graph = props => {
    const optionClasses = getStyles(optionStyles.options);
    const {
        options,
        updateOptions,
        isOpens,
        onSectionToggle,
    } = props;

    const handleOptionChange = async (key, value) => {
        var newOptions = options;
        newOptions.graph[key] = value;
        updateOptions(newOptions);
    }

    const handleMainLinkChange = async (key, value) => {
        var newOptions = options;

        if (key === 'showIncomingLinks' && !value && newOptions.graph.showOutgoingLinks === false) {
            newOptions.graph.showOutgoingLinks = true;
        } else if (key === 'showOutgoingLinks' && !value && newOptions.graph.showIncomingLinks === false) {
            newOptions.graph.showIncomingLinks = true;
        }

        newOptions.graph[key] = value;
        updateOptions(newOptions);
    }

    return (
        <Section
            title={<Language text={content.graph.graph} />}
            isOpen={isOpens[0]}
            isFoldable={true}
            onToggle={() => onSectionToggle(0)}
            contentPaddingTop={15}
        >
            <SubHeader title={<Language text={content.graph.links} />} />
            <SelectBlock
                label={<Language text={content.graph.sortBy} />}
                options={[{title: 'None', value: 'none'}]}
                onChange={value => {handleOptionChange('sortBy', value)}}
                value={options.graph.sortBy}
            />
            <SliderBlock
                label={<Language text={content.graph.minLinks} />}
                onChangeCommitted={value => {handleOptionChange('minLinks', value)}}
                value={options.graph.minLinks}
                min={0}
                max={10}
                step={1}
            />
            <SliderBlock
                label={<Language text={content.graph.maxLinks} />}
                onChangeCommitted={value => {handleOptionChange('maxLinks', value)}}
                value={options.graph.maxLinks}
                min={0}
                max={20}
                step={1}
                disabled
            />
            <SliderBlock
                label={<Language text={content.graph.fetchLimit} />}
                onChangeCommitted={value => {handleOptionChange('fetchLimit', value)}}
                value={options.graph.fetchLimit}
                min={0}
                max={10000}
                step={100}
                flexMax
                disabled
            />
            <SwitchBlock
                label={<Language text={content.graph.inComings} />}
                checked={options.graph.showIncomingLinks}
                onChange={value => {handleMainLinkChange('showIncomingLinks', value)}}
            />
            <SwitchBlock
                label={<Language text={content.graph.outGoings} />}
                checked={options.graph.showOutgoingLinks}
                onChange={value => {handleMainLinkChange('showOutgoingLinks', value)}}
            />
            <SwitchBlock
                label={<Language text={content.graph.showExtNeighbors} />}
                checked={options.graph.showExtNeighbors}
                onChange={value => {handleMainLinkChange('showExtNeighbors', value)}}
            />
            <SubHeader title={<Language text={content.graph.nodeLabels} />} />
            <div className={optionClasses.doubleColumnBlock}>
                <SwitchBlock
                    label={<Language text={content.graph.all} />}
                    checked={options.graph.showAllNodeLabels}
                    onChange={value => {handleOptionChange('showAllNodeLabels', value)}}
                />
                <SwitchBlock
                    label={<Language text={content.graph.mainNodes} />}
                    checked={options.graph.showMainNodeLabels}
                    onChange={value => {handleOptionChange('showMainNodeLabels', value)}}
                />
            </div>
            <div className={optionClasses.doubleColumnBlock}>
                <SwitchBlock
                    label={<Language text={content.graph.selected} />}
                    checked={options.graph.showSelectedNodeLabels}
                    onChange={value => {handleOptionChange('showSelectedNodeLabels', value)}}
                    disabled
                />
                <SwitchBlock
                    label={<Language text={content.graph.hover} />}
                    checked={options.graph.showHoverNodeLabels}
                    onChange={value => {handleOptionChange('showHoverNodeLabels', value)}}
                />
            </div>
            <SubHeader title={<Language text={content.graph.linkLabels} />} />
            <div className={optionClasses.doubleColumnBlock}>
                <SwitchBlock
                    label={<Language text={content.graph.all} />}
                    checked={options.graph.showAllLinkLabels}
                    onChange={value => {handleOptionChange('showAllLinkLabels', value)}}
                />
                <SwitchBlock
                    label={<Language text={content.graph.selected} />}
                    checked={options.graph.showSelectedLinkLabels}
                    onChange={value => {handleOptionChange('showSelectedLinkLabels', value)}}
                    disabled
                />
            </div>
            <SwitchBlock
                label={<Language text={content.graph.hover} />}
                checked={options.graph.showHoverLinkLabels}
                onChange={value => {handleOptionChange('showHoverLinkLabels', value)}}
            />
        </Section>
    );
}

const Styles = props => {
    const { 
        options,
        updateOptions,
        language,
        isOpens,
        openWidgets,
        onSectionToggle,
        onColorSetAdd,
        onColorSetChange,
        onColorSetRemove
    } = props;

    return (
        <Section 
            title={<Language text={content.styles.appearance} />}
            isOpen={isOpens[1]}
            isFoldable={true}
            onToggle={() => onSectionToggle(1)}
            contentPaddingTop={15}
        >
            <ColorSet 
                options={options}
                updateOptions={updateOptions}
                language={language}
                openWidgets={openWidgets}
                onColorSetAdd={onColorSetAdd}
                onColorSetChange={onColorSetChange}
                onColorSetRemove={onColorSetRemove}
            />
            <Tabs>
                <Tab title="Main">
                    <NodeStyles 
                        options={options}
                        updateOptions={updateOptions}
                        nodeType="main"
                        openWidgets={openWidgets}
                    />
                </Tab>
                <Tab title="Nodes">
                    <NodeStyles 
                        options={options}
                        updateOptions={updateOptions}
                        nodeType="minor"
                        openWidgets={openWidgets}
                    />
                </Tab>
                <Tab title="Links">
                    <div style={{textAlign: 'center'}}>
                        No customization
                    </div>
                </Tab>
            </Tabs>
        </Section>
    );
}

const ColorSet = props => {
    const [focusedColor, setFocusedColor] = React.useState(null);
    const classes = getStyles(styles.colorSet);
    const optionClasses = getStyles(optionStyles.options);
    const { 
        options,
        language,
        openWidgets,
        onColorSetChange,
        onColorSetRemove
    } = props;

    const colorSet = options.styles.colorSet;
    const focusedItemStyle = {
        width: 30,
        height: 30,
        top: -3,
        left: -3,
        borderRadius: 7
    };

    const handleWidgetClose = () => {
        setFocusedColor(null);
    }

    const handleColorClick = index => {
        setFocusedColor(index);
        openWidgets([
            {type: 'colorPicker', onColorChange: color => onColorSetChange(index, color), initColor: colorSet[index], onClose: handleWidgetClose}
        ]);
    }

    const handleColorAdd = () => {
        
    }

    const handleColorRemove = index => {
        const message = content.styles.confirmColorSetRemove;

        if (window.confirm(language in message ? message[language] : message[defaultLanguage])) {
            setFocusedColor(null);
            onColorSetRemove(index);
        }
    }

    return (
        <div className={optionClasses.block}>
            <div className={classes.label}>Color Collection</div>
            <div className={classes.container}>
                {colorSet.map((color, colorIndex) => (
                    <div
                        key={colorIndex}
                        className={classes.block}
                    >
                        <div 
                            className={classes.item}
                            style={Object.assign({
                                backgroundColor: 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')'
                            }, focusedColor === null ? {} : focusedColor === colorIndex ? focusedItemStyle : {} )}
                            onClick={() => handleColorClick(colorIndex)}
                        >
                            
                        </div>
                        <div className={classes.delete} onClick={() => handleColorRemove(colorIndex)}>
                            <CancelIcon className={classes.deleteIcon} />
                        </div>
                    </div>
                ))}
                <div className={classes.block}>
                    <div className={classes.add} onClick={handleColorAdd}>
                        <AddIcon className={classes.addIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const NodeStyles = props => {
    const theme = useTheme();
    const { 
        options,
        updateOptions,
        nodeType,
        openWidgets
    } = props;

    const handleOptionChange = async (element, key, value) => {
        var newOptions = options;
        newOptions.styles.nodes[nodeType][element][key] = value;
        updateOptions(newOptions);
    }

    const handleColorValueChange = async (element, key, color) => {
        var newOptions = options;
        console.log(element);
        console.log(key);
        newOptions.styles.nodes[nodeType][element][key] = color.rgb;
        updateOptions(newOptions);
    }

    const handleWidgetValueChange = async (element, key, value) => {
        var newOptions = options;
        newOptions.styles.nodes[nodeType][element][key] = value;
        updateOptions(newOptions);
    }

    const handleColorClick = (element, key) => {
        openWidgets([
            {type: 'colorPicker', onColorChange: color => handleColorValueChange(element, key, color)}
        ]);
    }

    const handleBorderClick = element => {
        openWidgets([
            {type: 'colorPicker', onColorChange: color => handleColorValueChange(element, 'borderColor', color)},
            {
                type: 'range',
                label: 'Border',
                initValue: options.styles.nodes[nodeType].label.borderWidth,
                min: 0,
                max: 10,
                step: 1,
                flexMax: true,
                onChangeCommitted: width => handleWidgetValueChange(element, 'borderWidth', width)
            }
        ]);
    }

    const iconColors = {
        fill: theme.palette.type === 'light' ? theme.palette.colors.blue : theme.palette.colors.orange,
        stroke: theme.palette.type === 'light' ? theme.palette.colors.blue : theme.palette.colors.orange,
        text: theme.palette.text.primary
    };

    return (
        <React.Fragment>
            <SubHeader title={<Language text={content.styles[nodeType + 'Nodes']} />} />
            <SelectBlock
                label={<Language text={content.styles.fontFamily} />}
                options={[{title: "D3js' Default", value: 'default'}]}
                value={'default'}
                onChange={value => {handleOptionChange('label', 'fontFamily', value)}}
            />
            <SliderBlock
                label={<Language text={content.styles.fontSize} />}
                onChangeCommitted={value => {handleOptionChange('label', 'fontSize', value)}}
                value={options.styles.nodes[nodeType].label.fontSize}
                min={0}
                max={48}
                step={2}
            />
            <GroupedButtonBlock label="Label Styles">
                <GroupedButton tooltip={<Language text={content.styles.fontColor} />} onClick={() => handleColorClick('label', 'fontColor')}>
                    <FontColorIcon size="20" fill={iconColors.fill} stroke={iconColors.text} />
                </GroupedButton>
                <GroupedButton tooltip={<Language text={content.styles.labelBackground} />} onClick={() => handleColorClick('label', 'backgroundColor')}>
                    <LabelBackgroundIcon size="20" fill={iconColors.fill} />
                </GroupedButton>
                <GroupedButton tooltip={<Language text={content.styles.labelBorder} />} onClick={() => handleBorderClick('label')}>
                    <LabelBorderIcon size="20" aStroke={iconColors.text} borderStroke={iconColors.stroke} />
                </GroupedButton>
            </GroupedButtonBlock>
            <SliderBlock
                label={<Language text={content.styles.nodeSize} />}
                onChangeCommitted={value => {handleOptionChange('node', 'size', value)}}
                value={options.styles.nodes[nodeType].node.size}
                min={1}
                max={20}
                step={1}
            />
            <GroupedButtonBlock label="Node Styles">
                <GroupedButton tooltip={<Language text={content.styles.nodeColor} />} onClick={() => handleColorClick('node', 'backgroundColor')}>
                    <NodeColorIcon size="20" fill={iconColors.fill} />
                </GroupedButton>
                <GroupedButton tooltip={<Language text={content.styles.nodeBorder} />} onClick={() => handleBorderClick('node')} >
                    <NodeBorderIcon size="20" stroke={iconColors.stroke} />
                </GroupedButton>
            </GroupedButtonBlock>
        </React.Fragment>
    );
}

const Nodes = props => {
    const classes = getStyles(styles.options);
    const { 
        graph,
        isOpens,
        onSectionToggle,
        nodes,
        onDeleteNode
    } = props;

    return (
        Object.keys(nodes).length > 0 ?
            <Section
                title={<Language text={content.nodes.nodes} />}
                isOpen={isOpens[2]}
                isFoldable={true}
                onToggle={() => onSectionToggle(2)}
            > 
                <List dense={true} style={{margin: 0, padding: 0}}>
                    {Object.keys(nodes).map((node, nodeIndex) => (
                        graph.nodes[node].isMainNode ?
                            <ListItem button key={nodeIndex}>
                                <ListItemText 
                                    primary={
                                        <Typography className={classes.nodeLabel}>
                                            {graph.nodes[node].label.text}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography className={classes.nodeEntity}>
                                            {node}
                                        </Typography>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton 
                                        edge="end" 
                                        aria-label="delete"
                                        onClick={event => {onDeleteNode(nodeIndex)}}
                                        style={{opacity: .5}}
                                        disabled
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        : ''
                    ))}
                </List>
            </Section>
        : ''
    );
}

const mapStateToProps = state => {
    return {
        reducers: {
            graphs: state.vizBaseGraphReducer,
            languages: state.languageReducer
        }
    };
}

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            graphs: {
                updateOptions: bindActionCreators(updateOptions, dispatch)
            }
        }
    };
}

export const Options = connect(mapStateToProps, mapDispatchToProps)(OptionsClass)
