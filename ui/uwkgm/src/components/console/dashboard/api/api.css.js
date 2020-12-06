import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    api: makeStyles(theme => ({
        content: {
            minHeight: '100%',
            marginTop: 0,   // -100
            padding: 10,
            paddingTop: 70, // 0
            paddingBottom: 0,
            backgroundColor: theme.palette.background.default
        }
    })),

    grid: makeStyles(() => ({
        container: {
            width: '100%'
        },
    
        row: {
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%'
        }
    })),

    card: makeStyles(theme => ({
        block: {
            flex: 1,
            minWidth: 500,
            marginLeft: 15,
            marginRight: 15,
            marginBottom: 30,
            borderRadius: 10,
            berderTop: '1px solid rgba(0, 0, 0, .05)',
            boxShadow: '0px 3px 3px rgba(0, 0, 0, .2)',
            backgroundColor: theme.palette.background.paper
        },

        button: {
            float: 'right',
            fontSize: '.9em', 
            color: '#1D6EC9'
        },

        icon: {
            fontSize: 64
        },

        iconBlock: {
            flex: '0 0 80px',
            paddingRight: 15,
            textAlign: 'center'
        },

        iconButton: {
            marginLeft: 5,
            marginRight: 5,
            cursor: 'pointer',

            '&:hover': {
                borderRadius: 15,
                backgroundColor: '#EEE'
            }
        },

        title: {
            display: 'flex',
            width: '100%',
            height: 50,
            padding: 10,
            color: theme.palette.text.primary,
            fontSize: '.8em',
            fontWeight: 'bold',
            borderRadius: '10px 10px 0px 0px',
            borderBottom: '1px solid ' + theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
            alignItems: 'center',
            justifyContent: 'center'
        },

        titleText: {
            flex: 1,
            paddingLeft: 8
        },

        titleButton: {
            textAlign: 'right',
            flex: '0 0 200px'
        },

        content: {
            display: 'flex',
            padding: 15
        },

        detail: {
            flex: 1,
            color: theme.palette.text.primary,

            '& > h6': {
                color: theme.palette.text.primary
            }
        },

        list: {
            width: '100%'
        }
    }))
}
