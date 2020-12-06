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
    mods: makeStyles(theme => ({
        form: {
            width: '100%'
        },
    
        input: {
            width: '100%'
        },
    
        addIcon: {
            color: theme.palette.colors.green
        },
    
        editIcon: {
            color: theme.palette.colors.orange
        },
    
        deleteIcon: {
            color: 'red'
        },

        editingIcon: {
            color: '#888'
        },
    
        deprecated: {
            textDecoration: 'line-through',
            opacity: .5
        }
    })),

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
        },

        entityEmptyLabel: {
            opacity: .5
        }
    })),

    head: makeStyles(theme => ({
        container: {
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            marginTop: 32,
            marginBottom: 20,

            '& > div': {
                flex: 1
            }
        },

        leftBlock: {
            textAlign: 'left'
        },

        search: {
            textAlign: 'center'
        },

        searchBlock: {
            display: 'inline-block',
            width: '30%',
            minWidth: 300,
            maxWidth: 400,
        },

        rightBlock: {
            textAlign: 'right'
        }
    })),

    list: makeStyles(theme => ({
        container: {
            width: '100%'
        },

        head: {
            display: 'flex',
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 15,
            fontSize: '.9em',
            fontWeight: 'bold',
            color: theme.palette.text.primary,

            '& > div:first-child': {
                flex: '0 0 80px'
            },

            '& > div:nth-child(2)': {
                flex: 1,
                paddingLeft: 15
            }
        },

        item: {
            display: 'flex',
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 20,
            padding: 15,
            border: theme.palette.type === 'light' ? '1px solid #F1F2F8' : '1px solid #666',
            borderRadius: 15,
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
            backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.paper,

            '& > div:first-child': {
                flex: '0 0 80px'
            },

            '& > div:nth-child(2)': {
                flex: 1,
                paddingLeft: 15
            }
        },

        itemHead: {
            textAlign: 'center',

            '& > div:first-child': {
                '& > *': {
                    fontSize: '2.5em'
                }
            },

            '& > div:last-child': {
                color: theme.palette.text.primary,
                fontSize: '.85em',
                fontWeight: 'bold'
            }
        },

        triple: {
            '& > div': {
                display: 'inline-block',
                width: '30%',
                marginRight: '3%'
            }
        },

        tripleItem: {
            width: '100%',
            verticalAlign: 'top',
        
            '& > div': {
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            },
    
            '& > div:first-child': {
                color: theme.palette.text.primary,
                fontSize: '.9em',
                fontWeight: 'bold'
            },
    
            '& > div:last-child': {
                color: theme.palette.text.primary,
                fontSize: '.85em'
            }
        },

        meta: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            marginTop: 10,
            paddingTop: 10,
            color: '#AAA',
            fontSize: '.8em',
            borderTop: '1px dashed #DDD',
    
            '& > b': {
                color: theme.palette.text.primary
            },
    
            '& > div:first-child': {
                flex: 1
            },
    
            '& > div:last-child': {
                flex: '0 0 250px',
                textAlign: 'right',
    
                '& > button': {
                    marginLeft: 5
                }
            } 
        }
    })),

    newItem: makeStyles(theme => ({
        container: {
            border: theme.palette.type === 'light' ? '3px dashed #F1F2F8' : '3px dashed #666',
            backgroundColor: 'rgba(0, 0, 0, 0)'
        }
    })),

    placeholder: makeStyles(theme => ({
        body: {
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: 'calc(100% - 70px)',
            marginTop: 70
        },

        container: {
            position: 'absolute',
            height: 350,
            width: 300,
            top: '28%',
            left: 'calc(50% - 150px)',
            textAlign: 'center'
        },

        icon: {
            fontSize: 52,
            color: theme.palette.text.primary
        },

        content: {
            marginTop: 30,
            color: theme.palette.text.primary
        },

        actions: {
            marginTop: 20
        }
    }))
};
