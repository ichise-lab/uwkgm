import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    page: makeStyles(theme => ({
        container: {
            display: 'flex',
            height: '100%',
            width: '100%'
        },

        content: {
            flex: 1,
            paddingTop: 54
        },

        title: {
            width: '100%',
            marginTop: 0,
            marginBottom: 20,
            color: theme.palette.text.primary,
            fontWeight: 'bold',
            fontSize: '2em'
        },

        paddedContent: {
            paddingLeft: 24,
            paddingRight: 24
        },

        text: {
            color: theme.palette.text.secondary
        }
    }))
}

export const useStyles = makeStyles(theme => ({
    paddedContent: {
        paddingLeft: 24,
        paddingRight: 24
    }
}));
