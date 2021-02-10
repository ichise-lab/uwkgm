import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';

export const CustomTextField = withStyles(theme => ({
    root: {
        '& input': {
            color: theme.palette.text.primary
        },

        '& label': {
            paddingLeft: 10
        },

        '& label.Mui-focused': {
            color: theme.palette.text.secondary
        },

        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#DDD',
                borderRadius: 50,
            },
            '&:hover fieldset': {
                borderColor: '#CCC'
            },
            '&.Mui-focused fieldset': {
                borderColor: '#CCC'
            },
        },
    }
}))(TextField);

export const styles = {
    search: makeStyles(theme => ({
        form: {
            width: '100%'
        },
    
        input: {
            width: '100%'
        },

        inputBlock: {
            display: 'inline-block',
            width: '30%',
            minWidth: 300,
            maxWidth: 400,
            paddingTop: 40
        },
    })),

    flex: makeStyles(theme => ({
        container: {
            display: 'flex',
            position: 'absolute',
            top: 104,
            left: 0,
            height: 100,
            width: '100%',

            '& > div:first-child': {
                textAlign: 'left'
            },

            '& > div:nth-child(2)': {
                textAlign: 'center'
            },

            '& > div:last-child': {
                textAlign: 'right'
            }
        },

        content: {
            flex: 1
        }
    })),

    suggestion: makeStyles(theme => ({
        block: {
            display: 'inline-block',
            overflowY: 'scroll',
            width: '100%',
            maxHeight: 500,
            backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.paper,
            border: '1px solid ' + theme.palette.divider,
            boxShadow: '0px 0px 15px #E6E9F8',

            '& > div': {
                borderBottom: '1px solid ' + theme.palette.divider
            },

            '& > div:last-child': {
                borderBottom: 'none'
            }
        },

        item: {
            textAlign: 'left',
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            cursor: 'pointer'
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

        type: {
            display: 'inline-block',
            color: theme.type === 'light' ? 'black' : 'white',
            backgroundColor: theme.type === 'light' ? 'white' : 'black',
            fontSize: '.85em',
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 10,
            paddingRight: 10,
            marginLeft: 5,
            marginTop: 10,
            borderRadius: 30
        },

        typeBlock: {
            height: '2.3em',
            overflow: 'hidden'
        },

        selected: {
            backgroundColor: theme.palette.info.main
        },
    
        selectedTitle: {
            color: 'white'
        },
    
        selectedEntity: {
            color: 'rgba(255, 255, 255, 0.6)'
        },
    
        selectedType: {
            color: theme.palette.text.primary,
            backgroundColor: 'white'
        }
    })),

    invalid: makeStyles(theme => ({
        container: {
            display: 'inline-block'
        },
        block: {
            display: 'inline-block',
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 10,
            color: 'white',
            fontSize: '.9em',
            backgroundColor: theme.palette.error.dark
        },
        triangle: {
            margin: 'auto',
            marginTop: 5,
            width: 0,
            height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderBottom: '10px solid ' + theme.palette.error.dark
        }
    }))
}

export const useStyles = makeStyles(theme => ({
    form: {
        width: '100%'
    },

    input: {
        width: '100%'
    },

    selected: {
        backgroundColor: theme.palette.info.main
    },

    selectedTitle: {
        color: 'white'
    },

    selectedEntity: {
        color: 'rgba(255, 255, 255, 0.6)'
    },

    selectedType: {
        color: theme.palette.text.primary,
        backgroundColor: 'white'
    }
}));
