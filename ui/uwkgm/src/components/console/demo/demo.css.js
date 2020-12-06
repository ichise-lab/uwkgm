import { makeStyles } from '@material-ui/core/styles';
import { relative } from 'path';

export const styles = {
    demo: makeStyles(theme => ({
        body: {
            position: 'fixed',
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, .8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000
        },

        container: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 500,
            transform: 'translate(-50%, -50%)',
            color: 'white'
        },

        titleBlock: {
            display: 'flex',
            verticalAlign: 'center',
        },

        logo: {
            width: 'auto',
            height: '3em'
        },

        title: {
            display: 'inline-block',
            fontSize: '2.5em',
            marginLeft: 15
        },

        liveDemo: {
            display: 'inline-block',
            verticalAlign: 'top',
            marginLeft: 7
        },

        descriptionBlock: {
            width: '100%',
            marginTop: 5,
            color: theme.palette.text.secondary
        },

        contentBlock: {
            marginTop: 10,
            borderTop: '1px solid white'
        },

        cardBlock: {
            display: 'flex',
            width: '100%',
            marginTop: 30
        },

        cardIconBlock: {
            flex: '0 0 85px'
        },

        cardIcon: {
            fontSize: '4em'
        },

        cardContentBlock: {
            flex: 1,

            '& > div:first-child': {
                fontSize: '1em',
                color: theme.palette.text.primary
            },

            '& > div:last-child': {
                fontSize: '.9em',
                color: theme.palette.text.secondary,
            }
        },

        link: {
            color: theme.palette.text.secondary,
            textDecoration: 'underline',

            '&:hover': {
                color: theme.palette.text.primary,
                textDecoration: 'underline'
            }
        },

        buttonsBlock: {
            marginTop: 30,
            paddingTop: 20,
            textAlign: 'center',
            borderTop: '1px solid white'
        }
    }))
}
