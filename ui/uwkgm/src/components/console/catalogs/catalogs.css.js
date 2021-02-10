import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    permissions: makeStyles(theme => ({
        addBlock: {
            paddingLeft: 20,
            paddingTop: 10
        }
    })),
    predicates: makeStyles(theme => ({
        itemShortBlock: {
            flex: '0 0 200px',
            paddingLeft: 20,
            paddingRight: 5
        },
        itemURIBlock: {
            flex: 1,
            paddingLeft: 5,
            paddingRight: 5
        },
        itemActionsBlock: {
            flex: '0 0 40px',
            paddingRight: 10
        },
        input: {
            width: '100%'
        }
    }))
}