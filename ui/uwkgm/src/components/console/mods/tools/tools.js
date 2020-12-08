import React from 'react';
import { useTheme } from '@material-ui/core/styles';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
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

export const Tools = props => {
    const classes = getStyles(styles);
    const theme = useTheme();
    const iconColors = getIconColors(theme);
    const { 
        triples,
        selectedIds,
        editingIds,
        onAddClick, 
        onEditClick,
        onRemoveClick,
        onSelectAllClick,
        onCloneClick,
        onReloadClick,
        onCommitClick
    } = props;

    const isUserAbsoulteDemo = window.localStorage.getItem('groups') === 'user_demo';

    const shouldDisableEditButton = () => {
        var shouldDisable = false;

        if (isUserAbsoulteDemo || selectedIds.length == 0) {
            shouldDisable = true;
        } else {
            for (let i = 0; i < selectedIds.length; i++) {
                if (triples[selectedIds[i]].committed) {
                    shouldDisable = true;
                }
            }
        }

        return shouldDisable
    }

    return (
        <div className={classes.tools.container}>
            <div className={classes.tools.content}>
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<AddCircleOutlineIcon />} 
                        text={<Language text={content.add} />} 
                        onClick={onAddClick} 
                        disabled={isUserAbsoulteDemo}
                    />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<EditIcon />} 
                        text={<Language text={content.edit} />} 
                        onClick={onEditClick}
                        disabled={shouldDisableEditButton()}
                    />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<DeleteIcon />} 
                        text={<Language text={content.remove} />} 
                        onClick={onRemoveClick}
                        disabled={shouldDisableEditButton()} 
                    />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<SelectAllIcon />} 
                        text={<Language text={content.all} />} 
                        onClick={onSelectAllClick}
                        disabled={editingIds.length > 0}
                    />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<FileCopyIcon />} 
                        text={<Language text={content.clone} />} 
                        onClick={onCloneClick}
                        disabled={isUserAbsoulteDemo || selectedIds.length != 1} 
                    />
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
