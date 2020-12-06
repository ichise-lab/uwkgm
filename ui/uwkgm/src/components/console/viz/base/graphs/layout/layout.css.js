import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    layout: makeStyles(theme => ({
        container: {
            position: 'absolute',
            bottom: 25,
            left: 0,
            right: 0,
            height: 40,
            width: 200,
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingTop: 5,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 25,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
    }))
}
