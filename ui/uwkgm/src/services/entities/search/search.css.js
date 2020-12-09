import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    suggestions: makeStyles(theme => ({
        container: {
            overflowY: 'scroll',
            width: '100%',
            maxHeight: 500,
            backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.paper,
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    
            '& > div': {
                borderBottom: '1px solid ' + theme.palette.divider
            },
    
            '& > div:last-child': {
                borderBottom: 'none'
            }
        },
    
        block: {
            display: 'flex',
            alignItems: 'center'
        },
    
        detail: {
            flex: 1,
            overflow: 'hidden',
            textAlign: 'left',
            maxWidth: 300,
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            cursor: 'pointer'
        },
    
        icon: {
            flex: '0 0 30px',
            color: theme.palette.text.primary
        },
    
        title: {
            color: theme.palette.text.primary,
            fontSize: '.9em',
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
    
        entity: {
            color: theme.palette.text.secondary,
            fontSize: '.85em',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
    
        typeContainer: {
            overflow: 'hidden',
            height: '2.3em',
        
            '& > div': {
                display: 'inline-block',
                color: 'white',
                backgroundColor: 'black',
                fontSize: '.85em',
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 10,
                paddingRight: 10,
                marginRight: 5,
                marginTop: 10,
                borderRadius: 30
            }
        },
    
        selected: {
            backgroundColor: theme.palette.colors.blue,
    
            '& > div > div': {
                color: 'white'
            }
        },
    
        selectedFont: {
            color: 'white'
        }
    })),

    popover: makeStyles(theme => ({
        editor: {
            width: 330
        },
    
        textInput: {
            width: 'calc(100% - 50px)',
            padding: 10,
            border: 'none',
            color: theme.palette.type === 'light' ? 'black' : 'white',
            backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.paper,
    
            '&:focus': {
                outline: 0,
                backgroundColor: theme.palette.type === 'light' ? '#FAFAFA' : theme.palette.background.paper
            }
        },

        loaderBlock: {
            display: 'inline-block',
            opacity: 0,
            transition: '.5s'
        },

        loaderBlockVisible: {
            opacity: 1,
            transition: '.5s'
        }
    }))
}
