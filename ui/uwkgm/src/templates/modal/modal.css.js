import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    wrapperActive: {
        width: '100vw',
        height: '100vh',
        opacity: 1,
        animation: `$wrapperIn .2s ${theme.transitions.easing.easeIn}`
    },

    wrapperInactive: {
        width: 0,
        height: 0,
        opacity: 0,
        animation: `$wrapperOut .3s ${theme.transitions.easing.easeOut}`
    },

    '@keyframes wrapperIn': {
        '0%': {
            opacity: 0,
            width: '100vw',
            height: '100vh',
        },
        '100%': {
            opacity: 1,
        }
    },

    '@keyframes wrapperOut': {
        '0%': {
            opacity: 1,
            width: '100vw',
            height: '100vh',
        },
        '100%': {
            opacity: 0,
            width: '100vw',
            height: '100vh',
        }
    }
}));

export const Wrapper = styled.div`
    display: flex;
    position: fixed;
    left: 0px;
    top: 0px;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 1000000`;

export const Container = styled.div`
    margin: auto;
    border-radius: 15px;
    background-color: white;
    z-index: 1000002`;
