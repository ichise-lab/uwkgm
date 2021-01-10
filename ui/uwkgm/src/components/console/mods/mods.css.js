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
            marginBottom: 10,
            padding: 15,
            borderRadius: 5,
            transitionDuration: '.15s',

            '& > div:first-child': {
                flex: '0 0 80px'
            },

            '& > div:nth-child(2)': {
                flex: 1,
                paddingLeft: 15
            }
        },
        
        itemSelectable: {
            cursor: 'pointer'
        },

        itemFade: {
            opacity: .3,
            transitionDuration: '.15s'
        },

        itemHover: {
            backgroundColor: theme.palette.type === 'light' ? 'rgba(0, 0, 0, .9)' : 'rgba(0, 0, 0, .2)'
        },

        itemSelected: {
            backgroundColor: theme.palette.type === 'light' ? theme.palette.colors.blue : '#BB2C32'
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

        itemWarningMessage: {
            color: theme.palette.colors.orange
        },

        itemErrorMessage: {
            color: theme.palette.colors.red
        },

        iconSelected: {
            color: 'white'
        },

        triple: {
            width: '100%',
            
            '& > div': {
                display: 'inline-block',
                width: '30%',
                marginRight: '3%'
            }
        },

        tripleItem: {
            width: '100%',
            verticalAlign: 'top',
        },

        entityBlock: {
            width: '100%',
            maxWidth: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },

        entityURI: {
            color: theme.palette.text.primary,
            fontSize: '.85em'
        },

        entityLabel: {
            color: theme.palette.text.primary,
            fontSize: '.9em',
            fontWeight: 'bold'
        },

        entityLiteral: {
            marginTop: 5,
            paddingTop: 5,
            color: theme.palette.text.primary,
            fontSize: '.85em',
            borderTop: theme.palette.type === 'light' ? '1px solid rgba(0, 0, 0, .1)' : '1px solid rgba(255, 255, 255, .1)'
        },

        entityLanguage: {
            color: theme.palette.text.primary,
            fontSize: '.85em'
        },

        meta: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            marginTop: 10,
            paddingTop: 10,
            color: '#AAA',
            fontSize: '.8em',
            borderTop: theme.palette.type === 'light' ? '1px dashed rgba(0, 0, 0, .3)' : '1px dashed rgba(255, 255, 255, .3)',
    
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
        },

        metaSelected: {
            color: 'rgba(255, 255, 255, .8)'
        },

        entityEmptyLabel: {
            opacity: .5
        }
    })),

    editItem: makeStyles(theme => ({
        container: {
            backgroundColor: 'rgba(0, 0, 0, .2)'
        },

        literalBlock: {
            width: '100%',
            marginTop: 10
        },

        literalTextBox: {
            width: '100%'
        },

        loaderBlock: {
            display: 'inline-block',
            verticalAlign: 'middle',
            opacity: 0,
            transition: '.5s'
        },

        loaderBlockVisible: {
            opacity: 1,
            transition: '.5s'
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
