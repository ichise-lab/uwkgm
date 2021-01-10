import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    catalogs: makeStyles(theme => ({
        title: {
            color: theme.palette.text.primary
        },
        uri: {
            color: theme.palette.text.secondary,
            fontSize: '.9em',
            marginLeft: 15
        }
    }))
}
