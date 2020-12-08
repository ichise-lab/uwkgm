import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    page: makeStyles(theme => ({
        container: {
            display: 'flex',
            height: '100%',
            overflow: 'scroll'
        },

        fixedContainer: {
            display: 'flex',
            height: '100%',
            overflow: 'hidden'
        },

        content: {
            flex: 1,
            paddingTop: 54
        },

        fixedContent: {
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
        },

        paddedContent: {
            paddingLeft: 24,
            paddingRight: 24
        },

        toolHeadedContent: {
            paddingTop: 112
        },

        title: {
            width: '100%',
            marginTop: 0,
            marginBottom: 20,
            color: theme.palette.text.primary,
            fontWeight: 'bold',
            fontSize: '2em'
        },

        text: {
            color: theme.palette.text.secondary
        }
    }))
}
