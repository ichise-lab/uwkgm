import { makeStyles } from '@material-ui/core/styles';

const optionsWidth = 240;

export const styles = {
    options: makeStyles(theme => ({
        paper: {
            position: 'fixed',
            width: optionsWidth,
            marginTop: 48,
            paddingBottom: 80
        },
    
        header: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            justifyContent: 'flex-start',
    
            '& > div:first-child': {
                flex: '0 0 52px',
            },
            '& > div:nth-child(2)': {
                flex: 1,
                textAlign: 'center',
                fontSize: '.8em',
                fontWeight: 500,
                color: theme.palette.text.primary
            },
            '& > div:last-child': {
                flex: '0 0 48px'
            }
        },
    
        subHeader: {
            color: theme.palette.text.primary,
            fontWeight: 'bold'
        },
    
        content: {
            display: 'flex',
            flexGrow: 1,
            transition: theme.transitions.create('padding', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            paddingRight: 0,
        },
    
        contentShift: {
            transition: theme.transitions.create('padding', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            paddingRight: optionsWidth,
        },

        block: {
            width: '100%',
            marginBottom: 20,
            paddingLeft: 18,
            paddingRight: 15,
            color: theme.palette.text.primary
        },

        doubleColumnBlock: {
            width: '100%',

            '& > div': {
                display: 'inline-block',
                width: 115
            }
        },

        disabled: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(3px)',
            backgroundColor: 'rgba(0, 0, 0, .5)'
        }
    })),

    section: makeStyles(theme => ({
        block: {
            color: theme.palette.text.primary,
            fontSize: '.9em',
            paddingTop: 10
        },
    
        head: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            paddingLeft: 18,
            paddingRight: 8,
            color: theme.palette.text.primary
        },
    
        title: {
            flex: 1,
            fontWeight: 'bold'
        },
    
        expand: {
            flex: '0 0 24px'
        },
    
        content: {
            paddingBottom: 10
        }
    })),

    tab: makeStyles(theme => ({
        container: {
            textAlign: 'center'
        },
    
        block: {
            display: 'inline-block',
            marginBottom: 15,
            color: theme.type === 'light' ? theme.palette.colors.blue : theme.palette.text.primary,
            fontSize: '.9em',
            border: '1px solid ' + (theme.palette.type === 'light' ? theme.palette.colors.blue : theme.palette.colors.grey),
            borderRadius: 5,
    
            '& > div': {
                borderRight: '1px solid ' + (theme.palette.type === 'light' ? theme.palette.colors.blue : theme.palette.colors.grey)
            },
    
            '& > div:last-child': {
                borderRight: 'none'
            }
        },
    
        item: {
            display: 'inline-block',
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 3,
            paddingBottom: 3,
            cursor: 'pointer'
        },
    
        itemSelected: {
            color: theme.palette.type === 'light' ? 'white' : 'black',
            backgroundColor: theme.palette.type === 'light' ? theme.palette.colors.blue : theme.palette.colors.grey
        }
    })),

    slider: makeStyles(theme => ({
        block: {
            marginBottom: 10
        },
    
        title: {
            width: '100%',
            marginBottom: 5
        },
    
        content: {
            display: 'flex',
            alignItems: 'flex-end',
            
            '& > div:first-child': {
                flex: 1,
                fontSize: '.9em'
            },
            
            '& > div:last-child': {
                flex: '0 0 80px',
                paddingLeft: 20,
                paddingBottom: 18.5
            }
        }
    })),

    switch: makeStyles(theme => ({
        block: {
            marginBottom: 10
        },
    
        switch: {
            marginRight: 10,
        },
    
        label: {
            fontSize: '.85em'
        }
    })),

    select: makeStyles(theme => ({
        formControl: {
            width: '100%'
        }
    })),

    groupedButton: makeStyles(theme => ({
        label: {
            fontSize: '.9em',
            paddingBottom: 10
        },
    
        container: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: 10,
            backgroundColor: theme.palette.select.background,
            cursor: 'pointer',
    
            '& > div:first-child': {
                borderRadius: '10px 0px 0px 10px'
            },
    
            '& > div:last-child': {
                borderRight: 'none',
                borderRadius: '0px 10px 10px 0px',
    
                '& > div:last-child': {
                    display: 'none'
                }
            }
        },
    
        item: {
            flex: 1,
            position: 'relative',
            paddingTop: 8,
            paddingBottom: 8,
            textAlign: 'center',
            transition: 'background-color .5s',
    
            '&:hover': {
                backgroundColor: theme.palette.select.hover.background
            },
        },
    
        divider: {
            position: 'absolute',
            top: '15%',
            right: 0,
            height: '70%',
            borderRight: '1px solid #CCC'
        }
    }))
}
