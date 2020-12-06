import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    header: makeStyles(theme => ({
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        leftPanel: {
            flex: .4,
            height: 64
        },

        centerPanel: {
            flex: 1,
            textAlign: 'center'
        },

        rightPanel: {
            flex: .4,
            height: 38,
            textAlign: 'right'
        },
    })),

    nav: makeStyles(theme => ({
        ul: {
            margin: 0,
            padding: 0,
            listStyleType: 'none',
            fontSize: 18
        },

        li: {
            display: 'inline-block',
            marginLeft: 15,
            marginRight: 15,
            opacity: .7,
            fontSize: '.9em',

            '&:hover': {
                opacity: 1
            },

            '& > a': {
                color: theme.palette.text.primary
            }
        },

        languageSelector: {
            color: theme.palette.text.primary
        }
    }))
}
