import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    tools: makeStyles(theme => ({
        container: {
            position: 'absolute',
            overflow: 'hidden',
            top: 44,
            left: 0,
            width: '100%',
            height: 69,
            padding: 0,
            margin: 0,
            backgroundColor: theme.palette.background.paper,
            borderBottom: '1px solid' + theme.palette.divider,
            boxShadow: '0px 5px 5px rgba(0, 0, 0, .05)',
            zIndex: 10
        },

        // The fixed position solves the unexplanable problem where the tool's content moves up a few pixels 
        // when entity-pick popup appears.
        content: {
            position: 'absolute',
            height: 69
        },

        header: {
            display: 'inline-block',
            position: 'relative',
            width: 14,
            height: '100%',

            '& > div': {
                color: theme.palette.text.secondary,
                fontSize: 10,
                marginLeft: 8,
                transform: 'translateX(-50%) translateY(-50%) rotate(270deg)'
            }
        },

        divider: {
            display: 'inline-block',
            height: 44,
            marginTop: 14,
            marginLeft: 4,
            borderRight: '1px solid ' + theme.palette.divider
        },

        singleBlock: {
            display: 'inline-block',
            paddingTop: 4,
            verticalAlign: 'top'
        },

        doubleBlock: {
            display: 'inline-block',
            paddingTop: 8,
            verticalAlign: 'top',

            '& > div:last-child': {
                height: 20
            }
        }
    })),

    button: makeStyles(theme => ({
        icon: {
            padding: 0,
            minWidth: 0,
            marginLeft: 4,
            marginRight: 4,
            color: theme.palette.type === 'light' ? theme.palette.colors.blue : theme.palette.colors.orange,
            verticalAlign: 'top'
        },

        upperBlockPadder: {
            width: '100%', 
            height: 4
        },

        singleBlock: {
            paddingLeft: 0, 
            paddingRight: 0, 
            minWidth: 54
        },

        singleContent: {
            paddingTop: 4,
            paddingBottom: 6,

            '& > div:first-child': {
                color: theme.palette.type === 'light' ? theme.palette.colors.blue : theme.palette.colors.orange
            },

            '& > div:nth-child(2)': {
                fontSize: 10,
                color: theme.palette.text.primary
            }
        },

        disabled: {
            color: '#888'
        }
    })),

    select: makeStyles(theme => ({
        container: {
            display: 'inline-block',
            paddingLeft: 4,
            paddingRight: 4
        },
    
        block: {
            display: 'flex',
            width: '100%',
            height: 18,
            borderRadius: 5,
            backgroundColor: theme.palette.select.background,
            cursor: 'pointer',
            transition: 'background-color .5s',
    
            '&:hover': {
                backgroundColor: theme.palette.select.hover.background
            },
        },
    
        textBlock: {
            flex: 1,
            position: 'relative'
        },
    
        iconBlock: {
            position: 'absolute',
            height: 10,
    
            '& > svg': {
                position: 'absolute',
                left: 4,
                top: 2,
                color: theme.palette.text.primary,
                fontSize: 14
            }
        },
    
        text: {
            position: 'absolute',
            fontSize: 10,
            width: '100%',
            height: 18,
            paddingLeft: 8,
            paddingRight: 1,
            paddingTop: 2,
            color: theme.palette.text.primary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
    
        arrowBlock: {
            flex: '0 0 18px',
            height: 18,
            position: 'relative',
            color: theme.palette.text.primary
        }
    }))
}
