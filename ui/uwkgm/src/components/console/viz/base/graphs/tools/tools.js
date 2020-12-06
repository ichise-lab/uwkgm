import React from 'react';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CodeIcon from '@material-ui/icons/Code';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import LensIcon from '@material-ui/icons/Lens';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MemoryIcon from '@material-ui/icons/Memory';
import PolicyIcon from '@material-ui/icons/Policy';
import Popover from '@material-ui/core/Popover';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import ShareIcon from '@material-ui/icons/Share';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import { useTheme } from '@material-ui/core/styles';

import { content } from './tools.content';
import { getStyles } from 'styles/styles';
import { 
    getIconColors,
    DoubleBlock,
    LargeButton, 
    Select,
    SmallButton
} from 'components/console/templates/tools';
import { Language } from 'services/languages/languages';
import { styles } from 'components/console/templates/tools.css';

import FontColorIcon from 'assets/icons/FontColor';
import LabelBackgroundIcon from 'assets/icons/LabelBackground';
import LabelBorderIcon from 'assets/icons/LabelBorder';
import NodeBorderIcon from 'assets/icons/NodeBorder';
import NodeColorIcon from 'assets/icons/NodeColor';

export class Tools extends React.Component {
    render() {
        return (
            <ToolsFunc
                toggleRulePage={this.props.toggleRulePage}
            />
        );
    }
}

export const ToolsFunc = props => {
    const classes = getStyles(styles);
    const theme = useTheme();
    const iconColors = getIconColors(theme);
    const { toggleRulePage } = props;

    const [menuEl, setMenuEl] = React.useState(null);
    const [menuKey, setMenuKey] = React.useState(null);

    const menus = {
        package: [
            {text: 'Basic', icon: <MemoryIcon />}
        ],
        module: [
            {text: 'Graph', icon: <ShareIcon />}
        ]
    };

    const handleMenuClick = (event, key) => {
        setMenuKey(key);
        setMenuEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuEl(null);
        setMenuKey(null);
    };

    return (
        <div className={classes.tools.container}>
            <div className={classes.tools.content}>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<MemoryIcon />} text={<Language text={content.package.basic} />} onClick={event => {handleMenuClick(event, 'package')}} />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<ShareIcon />} text={<Language text={content.type.graph} />} onClick={event => {handleMenuClick(event, 'module')}} />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<CodeIcon />} text={<Language text={content.query} />} disabled />
                </div>
                <div className={classes.tools.divider} />
                <div className={classes.tools.header}>
                    <div>
                        <Language text={content.nodes} />
                    </div>
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<AddCircleIcon />} text={<Language text={content.add} />} disabled />
                </div>
                <DoubleBlock>
                    <div>
                        <Tooltip title={<Language text={content.edit} />} arrow>
                            <React.Fragment>
                                <Button aria-label="edit" size="small" className={classes.button.icon} disabled>
                                    <EditIcon fontSize="small" />
                                </Button>
                            </React.Fragment>
                        </Tooltip>
                        <Select width={130} value="D3js' Default" disabled />
                        <Select width={65} 
                            value="10" 
                            textAlign="right" 
                            icon={
                                <TextFieldsIcon style={{color: iconColors.disabled}} />
                            }
                            disabled
                        />
                    </div>
                    <div>
                        <SmallButton 
                            icon={<RemoveCircleIcon fontSize="small" disabled />} 
                            text={<Language text={content.delete} />}
                            disabled
                        />
                        <SmallButton 
                            icon={<FontColorIcon size="18" fill={iconColors.fill} stroke={iconColors.text} disabled />} 
                            text={<Language text={content.fontColor} />} 
                            disabled
                        />
                        <SmallButton 
                            icon={<LabelBackgroundIcon size="18" fill={iconColors.fill} disabled />} 
                            text={<Language text={content.labelBackground} />} 
                            disabled
                        />
                        <SmallButton 
                            icon={<LabelBorderIcon size="18" fill={iconColors.fill} borderStroke={iconColors.stroke} aStroke={iconColors.text} disabled />} 
                            text={<Language text={content.labelBackground} />} 
                            disabled
                        />
                        <SmallButton 
                            icon={<NodeColorIcon size="18" fill={iconColors.fill} disabled />} 
                            text={<Language text={content.nodeColor} />} 
                            disabled
                        />
                        <SmallButton 
                            icon={<NodeBorderIcon size="18" stroke={iconColors.stroke} disabled />} 
                            text={<Language text={content.nodeBorder} />} 
                            disabled
                        />
                        <Select 
                            width={65} 
                            value="6" 
                            textAlign="right"
                            icon={
                                <LensIcon style={{color: iconColors.disabled}} />
                            }
                            disabled
                        />
                    </div>
                </DoubleBlock>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<VerticalSplitIcon />} text={<Language text={content.detail} />} disabled />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<ColorLensIcon />} text={<Language text={content.rules} />} onClick={toggleRulePage} />
                </div>
                <div className={classes.tools.divider} />
                <div className={classes.tools.header}>
                    <div>
                        <Language text={content.links} />
                    </div>
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<LinkIcon />} text={<Language text={content.add} />} disabled />
                </div>
                <DoubleBlock>
                    <div>
                        <Tooltip title={<Language text={content.edit} />} arrow>
                            <React.Fragment>
                                <IconButton aria-label="edit" size="small" className={classes.button.icon} disabled>
                                    <SettingsEthernetIcon fontSize="small" />
                                </IconButton>
                            </React.Fragment>
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip title={<Language text={content.delete} />} arrow>
                            <React.Fragment>
                                <IconButton aria-label="delete" size="small" className={classes.button.icon} disabled>
                                    <LinkOffIcon fontSize="small" />
                                </IconButton>
                            </React.Fragment>
                        </Tooltip>
                    </div>
                </DoubleBlock>
                <div className={classes.tools.divider} />
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<PolicyIcon />} text={<Language text={content.review} />} disabled />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<CheckIcon />} text={<Language text={content.commit} />} disabled />
                </div>
            </div>
            <Popover
                open={Boolean(menuEl)}
                anchorEl={menuEl}
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
                {menuKey !== null ?
                    <List component="div" style={{minWidth: 200}}>
                        {menus[menuKey].map((item, index) => (
                            <ListItem button key={index}>
                                {'icon' in item && item.icon !== null ?
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                : ''}
                                <ListItemText primary={
                                    <Typography style={{fontSize: '.9em'}}>{item.text}</Typography>
                                } />
                            </ListItem>
                        ))}
                    </List>
                : ''}
            </Popover>
        </div>
    );
}
