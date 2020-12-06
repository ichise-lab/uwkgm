import React from 'react';
import { useTheme } from '@material-ui/core/styles';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import RefreshIcon from '@material-ui/icons/Refresh';
import SelectAllIcon from '@material-ui/icons/SelectAll';

import { content } from './tools.content';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { LargeButton, getIconColors } from 'components/console/templates/tools';
import { styles } from 'components/console/templates/tools.css';

export class Tools extends React.Component {
    render() {
        return (
            <ToolsFunc 
                onAddModClick={this.props.onAddModClick} 
                onReloadClick={this.props.onReloadClick}
                onCommitClick={this.props.onCommitClick}
            />
        );
    }
}

export const ToolsFunc = props => {
    const classes = getStyles(styles);
    const theme = useTheme();
    const iconColors = getIconColors(theme);
    const { 
        onAddModClick, 
        onReloadClick,
        onCommitClick
    } = props;

    return (
        <div className={classes.tools.container}>
            <div className={classes.tools.content}>
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<AddCircleOutlineIcon />} 
                        text={<Language text={content.add} />} 
                        onClick={onAddModClick} 
                        disabled={window.localStorage.getItem('groups').includes('user_demo')}
                    />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<EditIcon />} text={<Language text={content.edit} />} disabled />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<DeleteIcon />} text={<Language text={content.delete} />} disabled />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<CenterFocusStrongIcon />} text={<Language text={content.select} />} disabled />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<SelectAllIcon />} text={<Language text={content.all} />} disabled />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<FileCopyIcon />} text={<Language text={content.clone} />} disabled />
                </div>
                <div className={classes.tools.divider} />
                <div className={classes.tools.singleBlock}>
                    <LargeButton icon={<RefreshIcon />} text={<Language text={content.reload} />} onClick={onReloadClick} />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<CheckIcon />} 
                        text={<Language text={content.commit} />} 
                        onClick={onCommitClick} 
                        disabled={window.localStorage.getItem('isAdmin') === 'false' && !window.localStorage.getItem('groups').includes('user_trusted')} 
                    />
                </div>
            </div>
        </div>
    );
}
