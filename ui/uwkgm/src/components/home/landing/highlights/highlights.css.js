import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    highlights: makeStyles(theme => ({
        section: {
            display: 'flex',
            marginTop: 20
        },

        block: {
            flex: 1,
            paddingRight: 20,

            '& > h4': {
                color: theme.palette.text.primary,
                marginTop: 20
            },

            '& > p': {
                color: theme.palette.text.secondary,
                marginTop: 20
            }
        }
    }))
}
