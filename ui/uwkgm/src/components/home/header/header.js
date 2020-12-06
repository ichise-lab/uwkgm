import React from 'react';
import { Link, useHistory } from "react-router-dom";

import { useTheme } from '@material-ui/core/styles';

import { content } from './header.content';
import { getStyles } from 'styles/styles';
import { Language, LanguageSelector } from 'services/languages/languages';
import { styles } from './header.css';

import logoGreyImg from 'assets/images/logos/64x64-grey.png';
import logoImg from 'assets/images/logos/64x64.png';

export const Header = () => {
    const classes = getStyles(styles);
    const history = useHistory();
    const theme = useTheme();

    const handleLoginClick = () => {
        history.replace({pathname: '/console'});
    }

    return (
        <div className={classes.header.container}>
            <div className={classes.header.leftPanel}>
                <img src={theme.palette.type === 'light' ? logoImg : logoGreyImg} alt="Home" />
            </div>
            <div className={classes.header.centerPanel}>
                <ul className={classes.nav.ul}>
                    <li className={classes.nav.li} style={{color: 'white', opacity: .2}}><Language text={content.quickStart} /></li>
                    <li className={classes.nav.li} style={{color: 'white', opacity: .2}}><Language text={content.documentation} /></li>
                    <li className={classes.nav.li} style={{color: 'white', opacity: .2}}><Language text={content.downloads} /></li>
                    <li className={classes.nav.li}>
                        {/* <Link to="https://github.com/ichise-lab/uwkgm"><Language text={content.github} /></Link></li> */}
                        <a target="blank" href="https://github.com/ichise-lab/uwkgm">
                            <Language text={content.github} />
                        </a>
                    </li>
                </ul>
            </div>
            <div className={classes.header.rightPanel}>
                <LanguageSelector className={classes.nav.languageSelector} />
                <button 
                    className="btn btn-primary" 
                    style={{
                        display: 'inline',
                        marginLeft: 10
                    }} 
                    onClick={handleLoginClick}
                >
                    <Language text={content.login} />
                </button>
            </div>
        </div>
    )
}
