import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    options: makeStyles(theme => ({
        nodeLabel: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '.95em', 
            fontWeight: 'bold'
        },
    
        nodeEntity: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '.95em'
        },
    })),

    colorSet: makeStyles(theme => ({
        label: {
            fontSize: '.9em',
            paddingBottom: 10,
            color: theme.palette.text.primary
        },
    
        container: {
            position: 'relative'
        },
    
        block: {
            display: 'inline-block',
            position: 'relative',
            width: 24,
            height: 24,
            marginRight: 9,
            marginBottom: 3,
    
            '& > div': {
                color: 'rgba(0, 0, 0, 0)'
            },
    
            '&:hover > div': {
                color: 'rgba(0, 0, 0, 0.2)'
            },
    
            '& > div:hover': {
                color: 'rgba(0, 0, 0, 0.8)'
            }
        },
    
        item: {
            position: 'absolute',
            cursor: 'pointer',
            width: 24,
            height: 24,
            borderRadius: 5,
        },
    
        delete: {
            position: 'absolute',
            cursor: 'pointer',
            top: -10,
            right: -10,
            width: 20,
            height: 20
        },
    
        deleteIcon: {
            fontSize: 20
        },
    
        add: {
            border: '1px solid #CCC',
            width: 24,
            height: 24,
            borderRadius: 5,
            backgroundColor: '#FAFAFA',
            cursor: 'pointer',
    
            '&:hover': {
                backgroundColor: '#EEE',
            }
        },
    
        addIcon: {
            position: 'absolute',
            color: '#AAA',
            fontSize: 22,
    
            '&:hover': {
                color: '#999'
            }
        }
    }))
}
