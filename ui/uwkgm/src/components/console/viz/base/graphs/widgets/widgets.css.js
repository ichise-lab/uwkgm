import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    widgets: makeStyles(theme => ({
        container: {
            width: 225,

            '& > div:first-child': {
                marginTop: 0
            }
        },

        block: {
            borderRadius: 2, 
            marginTop: 10, 
            paddingTop: 5, 
            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 2px 0px, rgba(0, 0, 0, 0.3) 0px 4px 8px 0px'
        }
    }))
}
