import React from 'react';
import { useHistory } from "react-router-dom";

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useTheme } from "@material-ui/core/styles";

import { content } from './intro.content';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { styles } from './intro.css';

import castleImg from 'assets/images/landing/castle.png';

export const Intro = () => {
    const classes = getStyles(styles.intro);
    const theme = useTheme();
    const history = useHistory();

    const handleRegisterClick = () => {
        history.replace({pathname: '/register'});
    }

    const handleDemoClick = () => {
        history.replace({pathname: '/demo'});
    }

    return (
        <section className={classes.section}>
            <div className={classes.leftPanel}>
                <h1>
                    <Language text={content.uwkgm} />
                </h1>
                <div className={classes.titleSup}>Alpha</div>
                <h2 style={{fontWeight: 200}}>
                    <Language text={content.motto} />
                </h2>
                <h3 style={{fontWeight: 200}}>
                    <Language text={content.description} />
                </h3>
                <div className={classes.navigateBlock}>
                    <button 
                        type="button" 
                        className="btn btn-primary btn-lg" 
                        style={{marginRight: 20}} 
                        onClick={handleRegisterClick}
                    >
                        <Language text={content.getStarted} />
                        <ArrowForwardIcon style={{marginLeft: 10}} />
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-lg" 
                        style={{color: theme.palette.text.primary}}
                        onClick={handleDemoClick}
                    >
                        <Language text={content.liveDemo} />
                    </button>
                    <p>
                        <Language text={content.alternative} />
                    </p>
                </div>
            </div>
            <div className={classes.rightPanel}>
                <img src={castleImg} alt="Start" />
            </div>
        </section>
    );
}
