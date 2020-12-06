import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    canvas: makeStyles(theme => ({
        container: {
            position: 'absolute',
            top: 114,
            width: '100%',
            height: 'calc(100% - 130px)'
        }
    }))
}
