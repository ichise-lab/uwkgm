import { makeStyles } from '@material-ui/core/styles';

const navWidth = 240;
const navShrinkedWidth = 55;

export const styles = {
    extended: makeStyles(theme => ({
        drawer: {
            width: navWidth,
            flexShrink: 0,
        },

        paper: {
            width: navWidth,
            paddingBottom: 30
        },

        header: {
            display: 'flex',
            height: 47,
            minHeight: 47,
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            backgroundColor: theme.palette.background.appBar,
            ...theme.mixins.toolbar,

            '& > div:first-child': {
                flex: '0 0 52px',
                paddingLeft: 10
            },
            '& > div:nth-child(2)': {
                flex: 1,
                textAlign: 'center',
                fontSize: '.8em',
                fontWeight: 500,
                color: theme.palette.text.normal
            },
            '& > div:last-child': {
                flex: '0 0 48px'
            },
            '@media (min-width: 600px)' : {
                height: 47,
                minHeight: 47
            }
        },

        group: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },

        groupIconBlock: {
            minWidth: 40
        },

        groupTitle: {
            color: theme.palette.text.normal
        },

        itemTitle: {
            color: theme.palette.text.secondary
        },

        linkedItem: {
            color: theme.palette.text.normal,
            '&:hover': {
                color: theme.palette.text.normal
            }
        },

        nestedItem: {
            paddingLeft: theme.spacing(4),
        },

        bubble: {
            width: 22,
            height: 22,
            fontSize: '.9em'
        },

        notification: {
            backgroundColor: '#FF0504'
        }
    })),

    shrinked: makeStyles(theme => ({
        container: {
            position: 'fixed',
            overflowY: 'scroll',
            top: 47,
            height: 'calc(100vh - 47px)',
            width: navShrinkedWidth,
            paddingTop: 3,
            backgroundColor: theme.palette.background.paper,
            borderRight: '1px solid ' + theme.palette.divider,
            flexShrink: 0
        },

        itemBlock: {
            width: '100%',
            textAlign: 'center',
            marginTop: 5
        }
    }))
}
