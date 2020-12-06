import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    screen: makeStyles(theme => ({
        body: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: theme.palette.background.default
        },

        container: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
        },

        spinner: {
            display: 'inline-block',
            marginBottom: 20
        },

        text: {
            color: theme.palette.text.primary
        },
    })),

    bottom: makeStyles(theme => ({
        container: {
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
        },

        copyright: {
            color: theme.palette.text.secondary
        }
    }))
}
