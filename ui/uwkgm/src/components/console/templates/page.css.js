import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    page: makeStyles(theme => ({
        container: {
            display: 'flex',
            height: '100%',
            overflow: 'scroll'
        },

        fixedContainer: {
            display: 'flex',
            height: '100%',
            overflow: 'hidden'
        },

        centeredContainer: {
            display: 'block',
            width: '100%'
        },

        centeredWrapper: {
            width: '100%',
            maxWidth: 800,
            marginLeft: 'auto',
            marginRight: 'auto'
        },

        content: {
            flex: 1,
            paddingTop: 59
        },

        fixedContent: {
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
        },

        paddedContent: {
            paddingLeft: 24,
            paddingRight: 24
        },

        toolHeadedContent: {
            paddingTop: 127
        },

        title: {
            width: '100%',
            color: theme.palette.text.primary,
            fontWeight: 'bold',
            fontSize: '2em'
        },

        text: {
            color: theme.palette.text.secondary
        },

        divider: {
            width: '100%',
            marginTop: 10,
            marginBottom: 10,
            borderBottom: '1px solid ' + (theme.palette.type === 'light' ? 'rgba(0, 0, 0, .1)' : 'rgba(255, 255, 255, .1)')
        }
    })),

    section: makeStyles(theme => ({
        container: {
            marginTop: 20
        },

        title: {
            color: theme.palette.text.primary,
            fontSize: '1.5em'
        },

    })),

    list: makeStyles(theme => ({
        container: {
            width: '100%',
            marginTop: 20,
            borderTop: '1px solid ' + (theme.palette.type === 'light' ? 'rgba(0, 0, 0, .2)' : 'rgba(255, 255, 255, .2)')
        },

        sectionTitleBlock: {
            width: '100%',
            textAlign: 'center',
            textTransform: 'uppercase',
            color: theme.palette.text.secondary,
            fontSize: '.9em',
            marginTop: 10,
            marginBottom: 10
        },

        itemBlock: {
            display: 'flex',
            width: '100%',
            paddingTop: 10,
            paddingBottom: 10,
            borderBottom: '1px solid ' + (theme.palette.type === 'light' ? 'rgba(0, 0, 0, .2)' : 'rgba(255, 255, 255, .2)'),
            cursor: 'pointer',
            alignItems: 'center',

            '&:hover': {
                backgroundColor: theme.palette.type === 'light' ? 'rgba(0, 0, 0, .9)' : 'rgba(0, 0, 0, .2)'
            }
        },

        itemDetailBlock: {
            flex: 1,
            paddingLeft: 20
        },

        itemActionsBlock: {
            flex: '0 0 100px',
            textAlign: 'right',
            paddingRight: 10
        },

        itemTitle: {
            color: theme.palette.text.primary,
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },

        itemDescription: {
            marginLeft: 30,
            fontSize: '.9em',
            color: theme.palette.text.secondary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },

        itemLink: {
            marginLeft: 30,
            fontSize: '.9em',
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
    })),

    actions: makeStyles(theme => ({
        container: {
            width: '100%',
            marginTop: 20,
        },

        centeredWrapper: {
            textAlign:  'center'
        }
    }))
}
