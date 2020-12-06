import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    home: makeStyles(theme => ({
        body: {
            position: 'absolute', 
            width: '100%', 
            minHeight: '100vh', 
            backgroundColor: theme.palette.background.default
        },

        container: {
            marginTop: 15
        }
    }))
}
