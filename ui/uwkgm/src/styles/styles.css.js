import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    modal: makeStyles(theme => ({
        background: {
            backdropFilter: 'blur(3px)'
        },

        common: {
            borderRadius: theme.palette.type === 'light' ? 5 : 0,
            color: theme.palette.type === 'light' ? 'black' : 'white',
            backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.paper
        },

        header: {
            borderBottomColor: theme.palette.type === 'light' ? 'rgb(233, 236, 239)' : 'rgba(255, 255, 255, .1)'
        },

        footer: {
            borderTopColor: theme.palette.type === 'light' ? 'rgb(233, 236, 239)' : 'rgba(255, 255, 255, .1)'
        },

        iconBlock: {
            textAlign: 'center'
        },

        icon: {
            fontSize: 64
        },

        content: {
            marginTop: 15
        }
    }))
}
