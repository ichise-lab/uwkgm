import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    icons: makeStyles(theme => ({
        outerContainer: {
            position: 'absolute',
            textAlign: 'right',
            verticalAlign: 'top',
            top: 120,
            right: -550,
            paddingLeft: 50,
            width: 550,
            height: 'calc(100% - 120px)',
            backgroundImage: theme.palette.type === 'light' ? 
                'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 20%)' :
                'linear-gradient(to right, rgba(50, 50, 50, 0), rgba(50, 50, 50, 1) 20%)',
            transition: '.2s',
            transitionTimingFunction: 'ease-in'
        },

        outerContainerPulled: {
            right: 0
        },

        innerContainer: {
            position: 'relative',
            width: '100%',
            height: '100%'
        },

        clickAwayContainer: {
            position: 'absolute',
            left: 0,
            top: 0,
            width: 100,
            height: '100%'
        },

        content: {
            overflow: 'scroll',
            width: '100%',
            height: '100%',
            paddingTop: 100
        },

        searchContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 100,
            paddingTop: 30,
            paddingLeft: 50,
            textAlign: 'center'
        },

        searchBlock: {
            display: 'inline-block',
            width: 200
        },

        search: {
            fontSize: '.9em',
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 15,
            paddingRight: 15,
            border: '1px solid ' + theme.palette.divider,
            borderRadius: 20,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.default
        },

        iconBlock: {
            display: 'inline-block',
            verticalAlign: 'top',
            width: 150,
            height: 110,
            textAlign: 'center',
            fontSize: '.8em',
            color: theme.palette.text.secondary
        },

        iconButton: {
            display: 'inline-block',
            cursor: 'pointer',
    
            '& > svg': {
                transition: '.2s',
                width: 38,
                height: 38
            },
    
            '& > div': {
                display: 'inline-block',
                width: '80%',
                textAlign: 'center'
            },
    
            '&:hover > svg': {
                width: 52,
                height: 52
            }
        },

        icon: {
            fill: theme.palette.type === 'light' ? 'black' : 'white',
            marginBottom: 10,
        },

        placeholderBlock: {
            width: '100%',
            paddingLeft: 50,
            color: theme.palette.text.secondary,
            fontSize: '.9em',
            textAlign: 'center'
        }
    }))
}
