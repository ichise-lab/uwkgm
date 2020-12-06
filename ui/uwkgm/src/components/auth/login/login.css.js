import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    login: makeStyles(theme => ({
        body: {
            display: 'flex',
            width: '100%',
            height: '100vh',
            backgroundColor: theme.palette.background.default
        },
    
        container: {
            width: 780,
            height: 500,
            margin: 'auto'
        },
    
        leftPanel: {
            display: 'inline-block',
            width: 300,
            height: 500,
            verticalAlign: 'bottom',
    
            '& > div': {
                display: 'flex',
                width: '100%',
                height: '100%',
                verticalAlign: 'middle'
            },
    
            '& > div > img': {
                width: '100%',
                height: 'auto',
                margin: 'auto'
            }
        },
    
        rightPanel: {
            display: 'inline-block',
            width: 380,
            height: '100%',
            marginLeft: 80,
            verticalAlign: 'bottom',
    
            '& > h1': {
                color: theme.palette.text.primary,
                fontSize: 48,
                fontWeight: 400
            },
    
            '& > p': {
                color: theme.palette.text.secondary,
                margin: 0,
                marginTop: 5,
                marginBottom: 5
            }
        },

        castle: {
            filter: theme.palette.type === 'light' ? 'brightness(1)' : 'brightness(.85)'
        },
    
        form: {
            margin: 0,
            marginBottom: 10
        },
    
        messageBlock: {
            marginTop: 15,
            color: theme.palette.text.secondary,
            fontSize: '.9em',
        },

        invertedColorIcon: {
            filter: theme.palette.type === 'light' ? 'invert(0)' : 'invert(1)'
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
        },
    
        languageSelector: {
            color: theme.palette.text.primary
        },
    
        checkbox: {
            padding: 0
        },
    
        checkboxContainer: {
            marginTop: 15
        },
    
        checkboxLabel: {
            display: 'inline-block',
            paddingTop: 0,
            marginLeft: 10,
            color: theme.palette.text.primary
        },
    
        textField: {
            display: 'relative',
            width: 250,
            marginTop: 7,
        },
    
        button: {
            marginLeft: 10,
            marginTop: 29
        }
    }))
}