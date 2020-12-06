import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    intro: makeStyles(theme => ({
        section: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        leftPanel: {
            flex: 1,

            '& > h1': {
                display: 'inline-block',
                color: theme.palette.colors.blue,
                fontSize: '4em',
                fontWeight: 100
            },

            '& > h2': {
                color: theme.palette.text.primary,
                fontSize: '2em',
                fontWeight: 100,
                letterSpacing: 4
            },

            '& > h3': {
                color: theme.palette.text.primary,
                fontSize: '1.5em',
                fontWeight: 100,
                paddingTop: 40
            }
        },

        rightPanel: {
            flex: 1,

            '& > img': {
                filter: theme.palette.type === 'light' ? 'brightness(1)' : 'brightness(.85)'
            }
        },

        navigateBlock: {
            paddingTop: 20,

            '& > p': {
                marginTop: 15,
                color: theme.palette.text.secondary
            },

            '& > button > img': {
                marginLeft: 10
            }
        },

        titleSup: {
            display: 'inline-block',
            fontSize: '1em',
            color: 'white',
            verticalAlign: 'top'
        }
    }))
}
