import { makeStyles } from '@material-ui/core/styles';

const navWidth = 240;
const navShrinkedWidth = 55;

export const styles = {
    console: makeStyles(theme => ({
        root: {
            display: 'flex',
            paddingBottom: 30,
            height: '100vh'
        },

        appBar: {
            height: 48,
            boxShadow: 'none',
            color: theme.palette.text.primary,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),

            '& > div:first-child': {
                paddingLeft: 0,
                paddingRight: 0,

                '& > button': {
                    margin: 0,
                    marginRight: 5
                }
            }
        },

        appBarShift: {
            width: `calc(100% - ${navWidth}px)`,
            marginLeft: navWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),

            '& > div:first-child': {
                paddingLeft: 12
            }
        },

        toolbar: {
            minHeight: 48
        },

        toolbarTitle: {
            flexGrow: 1
        },

        toolbarTitleDot: {
            marginLeft: 10,
            marginRight: 5
        },

        toolbarTitleText: {
            fontSize: '.9em',
            color: theme.palette.text.secondary
        },

        menuButton: {
            marginRight: theme.spacing(2),
        },

        hide: {
            display: 'none',
        },

        content: {
            flexGrow: 1,
            position: 'relative',
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: navShrinkedWidth - navWidth,
        },

        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    })),

    statusBar: makeStyles(theme => ({
        container: {
            display: 'flex',
            position: 'fixed', 
            bottom: 0, 
            width: '100%', 
            height: 30, 
            color: 'white',
            backgroundColor: '#007ACC', 
            fontSize: '.8em',
            zIndex: 1200,
            alignItems: 'center',
            justifyContent: 'center',

            '& > div': {
                flex: 1,
            }
        },

        left: {
            textAlign: 'left',
            paddingLeft: 10
        },

        right: {
            textAlign: 'right',
            paddingRight: 10,

            '& > div': {
                display: 'inline-block',
                height: 18,
                verticalAlign: 'bottom'
            }
        },

        icon: {
            fontSize: 18,
            marginTop: -3,
            marginLeft: 20,
            marginRight: 5
        }
    }))
}
