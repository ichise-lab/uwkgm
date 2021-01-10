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

    manual: makeStyles(theme => ({
        headContainer: {
            display: 'flex',
            width: '100%',
            color: theme.palette.colors.blue,
            fontSize: '.9em',
            fontWeight: 'bold',
            marginTop: 20,
            paddingBottom: 10,
            borderBottom: theme.palette.type === 'light' ? '1px solid rgba(0, 0, 0, .05)' : '1px solid rgba(255, 255, 255, .05)',
    
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
            paddingTop: 10,
            paddingBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 5,
            borderBottom: theme.palette.type === 'light' ? '1px solid rgba(0, 0, 0, .05)' : '1px solid rgba(255, 255, 255, .05)',

            '&:hover': {
                backgroundColor: theme.palette.type === 'light' ? 'rgba(255, 255, 255, .2)' : 'rgba(0, 0, 0, .2)',
            },

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
