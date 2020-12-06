import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    register: makeStyles(theme => ({
        body: {
            position: 'relative',
            width: '100%',
            height: '100vh',
            backgroundColor: theme.palette.background.default
        }
    })),

    form: makeStyles(theme => ({
        container: {
            display: 'flex',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            top: '50%',
            left: '50%',
            width: 780,
            transform: 'translate(-50%, -50%)',
            color: theme.palette.text.primary
        },

        leftPanel: {
            flex: '0 0 380px'
        },

        rightPanel: {
            flex: 1
        },

        castle: {
            width: 300,
            height: 'auto',
            filter: theme.palette.type === 'light' ? 'brightness(1)' : 'brightness(.85)'
        },

        title: {
            display: 'inline-block'
        },

        registration: {
            display: 'inline-block',
            verticalAlign: 'top',
            marginLeft: 7
        },

        messageBlock: {
            marginTop: 5,
            color: theme.palette.text.secondary
        },

        explainBlock: {
            marginTop: 20,
            fontSize: '.9em',
            color: theme.palette.text.secondary
        },

        inputBlock: {
            marginTop: 5
        },

        textField: {
            width: 300,
            marginTop: 20,
        },

        icon: {
            verticalAlign: 'bottom',
            marginLeft: 10
        },

        buttonsBlock: {
            display: 'inline-block',
            marginTop: 40,
            verticalAlign: 'bottom',
    
            '& > div': {
                display: 'inline-block',
                height: 38
            },
    
            '& > div > button': {
                marginRight: 10
            }
        },

        footer: {
            marginTop: 40,
            paddingTop: 10,
            borderTop: '1px dashed #DDD',
            fontSize: '.9em',
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            textAlign: 'center',
            
            '& > ul': {
                margin: 0,
                padding: 0,
                listStyleType: 'none',
    
                '& > li': {
                    display: 'inline-block',
                    marginRight: 25,
    
                    '& > a': {
                        color: theme.palette.text.primary
                    }
                }
            }
        }
    })),

    success: makeStyles(theme => ({
        container: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            top: '50%',
            left: '50%',
            minWidth: 500,
            transform: 'translate(-50%, -50%)',
            color: theme.palette.text.primary,
            textAlign: 'center'
        },

        icon: {
            fontSize: '8em',
            opacity: .8
        },

        title: {
            marginTop: 20
        },

        messageBlock: {
            marginTop: 5,
            color: theme.palette.text.secondary
        },

        buttonBlock: {
            marginTop: 40
        }
    })),

    bottom: makeStyles(theme => ({
        container: {
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: theme.palette.text.secondary
        }
    }))
}
