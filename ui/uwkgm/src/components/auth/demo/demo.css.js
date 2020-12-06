import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    demo: makeStyles(theme => ({
        body: {
            position: 'relative',
            width: '100%',
            height: '100vh',
            backgroundColor: theme.palette.background.default
        },

        container: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            minWidth: 500,
            transform: 'translate(-50%, -50%)',
            color: theme.palette.text.primary
        },

        upperBlock: {
            display: 'flex',

            '& > div:first-child': {
                flex: '0 0 90px'
            }
        },

        title: {
            display: 'inline-block',
            fontSize: '3.5em'
        },

        liveDemo: {
            display: 'inline-block',
            verticalAlign: 'top',
            marginLeft: 7
        },

        messageBlock: {
            marginTop: 5,
            color: theme.palette.text.secondary
        },

        inputBlock: {
            width: '100%',
            marginTop: 10
        },

        input: {
            width: '100%'
        },

        buttonBlock: {
            marginTop: 15,

            '& > button:last-child': {
                marginLeft: 15,
                color: theme.palette.text.primary
            }
        }
    })),

    bottom: makeStyles(theme => ({
        container: {
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: theme.palette.text.secondary
        }
    }))
}
