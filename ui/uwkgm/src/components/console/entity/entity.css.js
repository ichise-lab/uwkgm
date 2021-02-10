import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    types: makeStyles(theme => ({
        container: {
            marginTop: 10,
            marginBottom: 10,
        },

        block: {
            display: 'inline-block',
            marginTop: 5,
            marginBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            borderRadius: 15,
            backgroundColor: 'rgba(0, 0, 0, .6)',
            color: theme.palette.text.primary,
            fontWeight: 'bold'
        }
    })),
    list: makeStyles(theme => ({
        container: {

        },

        section: {

        },

        sectionRow: {
            display: 'flex',

            '& > div:first-child': {
                flex: 1
            },
            '& > div:nth-child(2)': {
                flex: 1
            },
            '& > div:last-child': {
                flex: '0 0 150px',
                textAlign: 'right'
            }
        },

        sectionHead: {
            width: '100%',
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 5,
            backgroundColor: 'rgba(0, 0, 0, .2)',
            cursor: 'pointer',

            '& > div:first-child': {
                color: theme.palette.text.primary,
                fontWeight: 'bold',
            },

            '& > div:nth-child(2)': {
                color: theme.palette.text.secondary,
            },

            '& > div:last-child': {
                '& > div': {
                    display: 'inline-block'
                },
                '& > div:first-child': {
                    opacity: 0
                },
                '& > div:nth-child(2)': {
                    opacity: 0
                }
            },

            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, .1)',
            },

            '&:hover > div:last-child': {
                '& > div:first-child': {
                    opacity: 1
                },
                '& > div:nth-child(2)': {
                    opacity: 1
                }
            }
        },

        sectionContent: {

        },

        sectionItem: {
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 10,
            paddingBottom: 10,
            borderBottom: '1px solid ' + (theme.palette.type === 'light' ? 'rgba(0, 0, 0, .1)' : 'rgba(255, 255, 255, .1)'),

            '& > div:first-child': {
                color: theme.palette.text.primary,
            },

            '& > div:nth-child(2)': {
                color: theme.palette.text.secondary,
            },

            '& > div:last-child': {
                '& > div': {
                    display: 'inline-block'
                }
            }
        }
    }))
}