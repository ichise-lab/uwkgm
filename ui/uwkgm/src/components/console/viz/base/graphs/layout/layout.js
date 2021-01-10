import React from 'react';

import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import IconButton from '@material-ui/core/IconButton';
import LockIcon from '@material-ui/icons/Lock';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tooltip from '@material-ui/core/Tooltip';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { useTheme } from '@material-ui/core/styles';

import { content } from './layout.content';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { styles } from './layout.css';

export const Layout = props => {
    const classes = getStyles(styles.layout);
    const theme = useTheme();
    const [layoutEl, setLayoutEl] = React.useState(null);
    const { 
        onZoomIn, 
        onZoomOut, 
        onReset 
    } = props;

    const handleLayoutMenuClick = event => {
        setLayoutEl(event.currentTarget);
    }

    const handleLayoutMenuClose = event => {
        setLayoutEl(null);
    }

    return (
        <div className={classes.container}>
            <Tooltip title={<Language text={content.graphLayout} />} placement="top" arrow>
                <IconButton aria-label="force" size="small" onClick={handleLayoutMenuClick}>
                    <BubbleChartIcon style={{color: theme.palette.text.primary}} />
                </IconButton>
            </Tooltip>
            <Tooltip title={<Language text={content.zoomIn} />} placement="top" arrow>
                <IconButton aria-label="zoom-in" size="small" onClick={onZoomIn}>
                    <ZoomInIcon style={{color: theme.palette.text.primary}} />
                </IconButton>
            </Tooltip>
            <Tooltip title={<Language text={content.zoomOut} />} placement="top" arrow>
                <IconButton aria-label="zoom-out" size="small" onClick={onZoomOut}>
                    <ZoomOutIcon style={{color: theme.palette.text.primary}} />
                </IconButton>
            </Tooltip>
            <Tooltip title={<Language text={content.lock} />} placement="top" arrow>
                <IconButton aria-label="fullscreen" size="small" style={{opacity: .3}}>
                    <LockIcon style={{color: theme.palette.text.primary}} />
                </IconButton>
            </Tooltip>
            <Tooltip title={<Language text={content.fullscreen} />} placement="top" arrow>
                <IconButton aria-label="shrink" size="small" style={{opacity: .3}}>
                    <FullscreenIcon style={{color: theme.palette.text.primary}} />
                </IconButton>
            </Tooltip>
            <Tooltip title={<Language text={content.reset} />} placement="top" arrow>
                <IconButton aria-label="refresh" size="small" onClick={onReset}>
                    <RefreshIcon style={{color: theme.palette.text.primary}} />
                </IconButton>
            </Tooltip>
            <Menu 
                anchorEl={layoutEl}
                keepMounted
                open={Boolean(layoutEl)}
                onClose={handleLayoutMenuClose}
            >
                <MenuItem onClick={handleLayoutMenuClose}>Force-directed</MenuItem>
            </Menu>
        </div>
    );
}