import React from 'react';

import EcoIcon from '@material-ui/icons/Eco';
import SecurityIcon from '@material-ui/icons/Security';

import { getStyles } from 'styles/styles';
import { styles } from './demo.css';

import logoGreyImg from 'assets/images/logos/64x64-grey.png';

export const Demo = props => {
    const classes = getStyles(styles.demo);
    const { onClose } = props;

    return (
        <div className={classes.body}>
            <div className={classes.container}>
                <div className={classes.titleBlock}>
                    <div>
                        <img src={logoGreyImg} alt="uwkgm" className={classes.logo} />
                    </div>
                    <div>
                        <h1 className={classes.title}>UWKGM</h1>
                        <div className={classes.liveDemo}>Live Demo</div>
                    </div>
                </div>
                <div className={classes.descriptionBlock}>
                    Before you begin, we have a few things to let you know:
                </div>
                <div className={classes.contentBlock}>
                    <div className={classes.cardBlock}>
                        <div className={classes.cardIconBlock}>
                            <SecurityIcon className={classes.cardIcon} />
                        </div>
                        <div className={classes.cardContentBlock}>
                            <div>Read Only</div>
                            <div>
                                Your account is for demonstration only. <br />
                                For security reasons, you will not be able to make any changes.
                            </div>
                        </div>
                    </div>
                    <div className={classes.cardBlock}>
                        <div className={classes.cardIconBlock}>
                            <EcoIcon className={classes.cardIcon} />
                        </div>
                        <div className={classes.cardContentBlock}>
                            <div>UWKGM Is Growing</div>
                            <div>
                                The UWKGM project is a work in progress. <br />
                                We are constantly updating the platform. <br />
                                Follow us on <a href="https://github.com/ichise-lab/uwkgm" target="blank" className={classes.link}>GitHub</a> for new features.
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.buttonsBlock}>
                    <button type="button" className="btn btn-primary" onClick={onClose}>
                        Continue
                     </button>
                </div>
            </div>
        </div>
    );
}
