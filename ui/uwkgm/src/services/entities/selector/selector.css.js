import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    languagePopover: makeStyles(theme => ({
        editor: {
            width: 160
        },

        textInput: {
            width: 'calc(100% - 40px)',
            padding: 10,
            border: 'none',
            color: theme.palette.type === 'light' ? 'black' : 'white',
            backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.paper,
    
            '&:focus': {
                outline: 0,
                backgroundColor: theme.palette.type === 'light' ? '#FAFAFA' : theme.palette.background.paper
            }
        },

        addButtonBlock: {
            display: 'inline-block'
        },

        container: {
            width: 160,
            maxHeight: 300,
            overflowY: 'scroll'
        },

        block: {
            display: 'inline-block',
            verticalAlign: 'top',
            width: 50,
            height: 50,
            textAlign: 'center',
            lineHeight: 'normal',
            cursor: 'pointer',

            '&:hover': {
                backgroundColor: theme.palette.type === 'light' ? 'rgba(0, 0, 0, .1)' : 'rgba(255, 255, 255, .1)'
            }
        },

        text: {
            display: 'flex',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }))
}