import React from 'react';

import FadeLoader from "react-spinners/FadeLoader";
import GridLoader from "react-spinners/GridLoader";
import { useTheme } from "@material-ui/core/styles";

import { getStyles } from 'styles/styles';
import { styles } from './screen.css';

export const LoadingScreen = props => {
    const classes = getStyles(styles);
    const theme = useTheme();
    const { text, noCopyright, loader } = props;

    return (
        <div className={classes.screen.body}>
            <div className={classes.screen.container}>
                <div className={classes.screen.spinner}>
                    {loader === 'fade' ?
                        <FadeLoader 
                            color={theme.palette.text.primary}
                        />
                    :
                        <GridLoader 
                            color={theme.palette.text.primary}
                        />
                    }
                </div>
                <div className={classes.screen.text}>
                    {text}
                </div>
            </div>
            {!noCopyright ?
                <div className={classes.bottom.container}>
                    <div className={classes.bottom.copyright}>
                        &copy; 2020 Ichise Lab
                    </div>
                </div>
            : ''}
        </div>
    );
}
