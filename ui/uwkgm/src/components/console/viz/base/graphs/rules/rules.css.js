import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    rules: makeStyles(theme => ({
        outerContainer: {
            position: 'absolute',
            width: '100%',
            height: 'calc(100% - 110px)',
            opacity: 0,
            top: 110,
            paddingTop: 25,
            paddingLeft: 25,
            paddingRight: 25,
            backgroundColor: theme.palette.background.default,
            transition: '.2s'
        },

        innerContainer: {
            position: 'relative',
            overflow: 'scroll',
            width: '100%',
            height: '100%'
        },

        title: {
            color: theme.palette.text.primary,
            fontWeight: 'bold',
            fontSize: '1.8em',
            marginTop: 30,
            transition: '.2s',
            transitionTimingFunction: 'ease-in'
        },

        description: {
            paddingTop: 10,
            marginTop: 30,
            color: theme.palette.text.secondary,
            transition: '.2s',
            transitionDelay: '.03s',
            transitionTimingFunction: 'ease-in'
        },

        tabs: {
            width: '100%',
            paddingTop: 15,
            marginTop: 30,
            transition: '.2s',
            transitionDelay: '.06s',
            borderBottom: '1px solid ' + theme.palette.divider
        },

        actionContainer: {
            position: 'absolute',
            width: '100%',
            height: 70,
            bottom: 0,
            textAlign: 'center',
            backgroundImage: theme.palette.type === 'light' ? 
                'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))' : 
                'linear-gradient(rgba(50, 50, 50, 0), rgba(50, 50, 50, 1))'
        },

        actionBlock: {
            display: 'inline-block',
            marginTop: 10,
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

        label: {
            paddingLeft: 5,
            paddingRight: 5,
            color: theme.palette.text.primary,
            backgroundColor: 'white',
    
            '&:hover': {
                backgroundColor: 'white'
            }
        },

        select: {
            cursor: 'pointer'
        },

        entity: {
            backgroundColor: 'rgba(40, 167, 69, 1)',
            cursor: 'pointer',
    
            '&:hover': {
                backgroundColor: 'rgba(41, 123, 53, 1)'
            }
        },

        entityEmpty: {
            backgroundColor: theme.palette.colors.blue,
    
            '&:hover': {
                backgroundColor: 'rgba(3, 90, 166, 1)'
            }
        }
    })),

    manual: makeStyles(theme => ({
        headContainer: {
            display: 'flex',
            width: '100%',
            color: theme.palette.colors.blue,
            fontSize: '.9em',
            fontWeight: 'bold',
            marginTop: 20,
    
            '& > div:first-child': {
                flex: '0 0 45px'
            },
    
            '& > div:nth-child(2)': {
                flexGrow: 1
            },
    
            '& > div:nth-child(3)': {
                flex: '0 0 80px'
            },
    
            '& > div:nth-child(4)': {
                flex: '0 0 60px'
            },
    
            '& > div:nth-child(5)': {
                flex: '0 0 100px'
            },
    
            '& > div:nth-child(6)': {
                flex: '0 0 70px'
            },
    
            '& > div:last-child': {
                flex: '0 0 23px'
            }
        },

        rowContainer: {
            display: 'flex',
            padding: 10,
            paddingLeft: 12,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            border: '1px solid ' + theme.palette.divider,
            borderRadius: 15,
            boxShadow: '0px 0px 15px rgba(0, 0, 0, .2)',
            backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.paper,
    
            '& > div:first-child': {
                flex: '0 0 20px'
            },
    
            '& > div:nth-child(2)': {
                flexGrow: 1
            },
    
            '& > div:nth-child(3)': {
                flex: '0 0 80px',
                paddingTop: 5
            },
    
            '& > div:nth-child(4)': {
                flex: '0 0 60px',
                paddingTop: 5,
                color: theme.palette.text.primary
            },
    
            '& > div:nth-child(5)': {
                flex: '0 0 100px',
                paddingTop: 5
            },
    
            '& > div:last-child': {
                flex: '0 0 70px',
                paddingTop: 2
            }
        },

        ruleIcon: {
            width: 24, 
            height: 24,
            color: theme.palette.text.primary
        },

        rowMovableIndicator: {
            position: 'relative',
    
            '& > svg': {
                position: 'absolute',
                top: '50%',
                marginTop: '-60%'
            }
        },

        ruleStyleNone: {
            width: 21,
            height: 21,
            borderRadius: 5,
            border: '1px dashed ' + theme.palette.text.secondary,
            backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.paper,
    
            '&:hover': {
                transition: '.2s',
                backgroundColor: '#E5E5E5'
            }
        },

        ruleCopyButton: {
            marginRight: 5,
    
            '&:hover': {
                color: theme.palette.colors.blue
            }
        },

        ruleDeleteButton: {
            '&:hover': {
                color: 'rgba(210, 50, 64, 1)'
            }
        },

        ruleAddContainer: {
            width: '100%',
            marginTop: 30,
            textAlign: 'center'
        },

        ruleAddBlock: {
            display: 'inline-block',
            border: '1px dashed ' + theme.palette.text.secondary,
            borderRadius: '50%'
        },

        ruleAddButton: {
            fontSize: 48,
            color: theme.palette.text.secondary
        },

        ruleEmpty: {
            width: '100%',
            textAlign: 'center',
            marginTop: 30,
            fontSize: '1em',
            color: theme.palette.text.secondary
        }
    }))
}
