import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    ribbon: makeStyles(theme => ({
        container: {
            width: '100%',
            marginTop: 30
        },
    
        method: {
            flex: '0 0 90px',
            '& > *': {
                width: '100%'
            }
        },
    
        api: {
            minWidth: 250,
            width: '20vw'
        },

        version: {
            width: 90
        },
    
        paper: {
            width: '100%',
            marginRight: 12,
            paddingTop: 10,
            boxShadow: 'none',
            borderBottom: '1px dashed #BBB',
            backgroundColor: theme.palette.background.default
        },
    
        tabs: {
            flex: '0 0 150px',
            marginTop: 15,
        },
    
        panel: {
            width: '100%'
        },

        nodesBlock: {
            flex: 1
        },

        buttonsBlock: {
            flex: '0 0 250px',
            paddingTop: 10,
            textAlign: 'right'
        },

        requestConfigBlock: {
            display: 'flex'
        },

        paramsBlock: {
            width: '100%'
        },

        endpointDescription: {
            display: 'flex',
            width: '100%',
            marginTop: 25,
            marginBottom: 25,
            fontSize: '.95em',
            color: theme.palette.text.primary,

            '& > div:first-child': {
                marginLeft: 20,
                marginRight: 15,
                color: theme.palette.colors.blue
            }
        }
    })),

    form: makeStyles(theme => ({
        control: {
            marginRight: 15
        },

        row: {
            display: 'flex'
        }
    })),

    param: makeStyles(theme => ({
        container: {
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            paddingBottom: 15
        },

        input: {
            flex: 1
        },

        description: {
            flex: 1,
            paddingLeft: 15
        },

        form: {
            width: '100%'
        },
    
        help: {
            cursor: 'pointer',
        },
    
        helpTooltip: {
            padding: theme.spacing(1),
            fontSize: '.9em',
            backgroundColor: '#333'
        },
    
        helpArrow: {
            color: '#333'
        }
    }))
}
