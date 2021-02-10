import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    form: makeStyles(theme => ({
        block: {
            display: 'inline-block',
            padding: 3,
            paddingLeft: 15,
            paddingRight: 10,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            borderRadius: 5,
            color: '#EEE',
            backgroundColor: '#666',
            fontSize: '.8em',
            fontWeight: 'bold',
            border: 'none',
            transition: '.2s',
    
            '&:hover': {
                transition: '.2s',
                backgroundColor: '#888'
            }
        },

        label: {
            paddingLeft: 5,
            paddingRight: 5,
            color: theme.palette.text.primary,
            backgroundColor: 'white',
    
            '&:hover': {
                backgroundColor: 'white'
            }
        },

        button: {
            cursor: 'pointer',
            fontSize: '1em'
        },

        select: {
            cursor: 'pointer'
        },

        red: {
            backgroundColor: theme.palette.colors.red,

            '&:hover': {
                backgroundColor: 'rgba(200, 50, 37, 1)'
            }
        },

        orange: {
            color: '#333',
            backgroundColor: theme.palette.colors.orange,

            '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(155, 104, 44, 1)'
            }
        },

        blue: {
            backgroundColor: theme.palette.colors.blue,
    
            '&:hover': {
                backgroundColor: 'rgba(3, 90, 166, 1)'
            }
        },

        green: {
            backgroundColor: 'rgba(40, 167, 69, 1)',
    
            '&:hover': {
                backgroundColor: 'rgba(41, 123, 53, 1)'
            }
        }
    }))
}