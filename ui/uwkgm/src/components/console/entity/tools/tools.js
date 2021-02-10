import React from 'react';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import SaveIcon from '@material-ui/icons/Save';

import { content } from './tools.content';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { LargeButton } from 'components/console/templates/tools';
import { styles } from 'components/console/templates/tools.css';

export const Tools = props => {
    const classes = getStyles(styles);

    return (
        <div className={classes.tools.container}>
            <div className={classes.tools.content}>
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<FirstPageIcon />} 
                        text={<Language text={content.first} />}
                    />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<ChevronLeftIcon />} 
                        text={<Language text={content.back} />}
                    />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<ChevronRightIcon />} 
                        text={<Language text={content.next} />}
                    />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<LastPageIcon />} 
                        text={<Language text={content.last} />}
                    />
                </div>
                <div className={classes.tools.divider} />
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<SaveIcon />} 
                        text={<Language text={content.save} />}
                    />
                </div>
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<DeleteIcon />} 
                        text={<Language text={content.delete} />}
                    />
                </div>
                <div className={classes.tools.divider} />
                <div className={classes.tools.singleBlock}>
                    <LargeButton 
                        icon={<CloseIcon />} 
                        text={<Language text={content.close} />}
                    />
                </div>
            </div>
        </div>
    );
}
