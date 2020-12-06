import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    placeholder: makeStyles(theme => ({
        body: {
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: 'calc(100% - 70px)',
            marginTop: 70
        },

        container: {
            position: 'absolute',
            height: 350,
            width: 300,
            top: '28%',
            left: 'calc(50% - 150px)',
            textAlign: 'center'
        },

        content: {
            marginTop: 30,
            color: theme.palette.text.primary
        },

        actions: {
            marginTop: 20
        }
    })),
}
