import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import { brightGrey, blue, darkGrey } from 'styles/colors.css';

export const CustomTextField = withStyles(theme => ({
    root: {
        '& input': {
            color: theme.palette.text.primary
        },

        '& label': {
            paddingLeft: 10
        },

        '& label.Mui-focused': {
            color: theme.palette.text.secondary
        },

        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#DDD',
                borderRadius: 50,
            },
            '&:hover fieldset': {
                borderColor: '#CCC'
            },
            '&.Mui-focused fieldset': {
                borderColor: '#CCC'
            },
        },
    }
}))(TextField);

export const styles = {
    search: makeStyles(theme => ({
        form: {
            width: '100%'
        },
    
        input: {
            width: '100%'
        },

        inputBlock: {
            display: 'inline-block',
            width: '30%',
            minWidth: 300,
            maxWidth: 400,
            paddingTop: 40
        },
    })),

    flex: makeStyles(theme => ({
        container: {
            display: 'flex',
            position: 'absolute',
            top: 104,
            left: 0,
            height: 100,
            width: '100%',

            '& > div:first-child': {
                textAlign: 'left'
            },

            '& > div:nth-child(2)': {
                textAlign: 'center'
            },

            '& > div:last-child': {
                textAlign: 'right'
            }
        },

        content: {
            flex: 1
        }
    })),

    suggestion: makeStyles(theme => ({
        block: {
            display: 'inline-block',
            overflowY: 'scroll',
            width: '100%',
            maxHeight: 500,
            backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.paper,
            border: '1px solid ' + theme.palette.divider,
            boxShadow: '0px 0px 15px #E6E9F8',

            '& > div': {
                borderBottom: '1px solid ' + theme.palette.divider
            },

            '& > div:last-child': {
                borderBottom: 'none'
            }
        },

        item: {
            textAlign: 'left',
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            cursor: 'pointer'
        },

        title: {
            color: theme.palette.text.primary,
            fontSize: '.9em',
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },

        entity: {
            color: theme.palette.text.secondary,
            fontSize: '.85em',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },

        type: {
            display: 'inline-block',
            color: theme.type === 'light' ? 'black' : 'white',
            backgroundColor: theme.type === 'light' ? 'white' : 'black',
            fontSize: '.85em',
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 10,
            paddingRight: 10,
            marginLeft: 5,
            marginTop: 10,
            borderRadius: 30
        },

        typeBlock: {
            height: '2.3em',
            overflow: 'hidden'
        },

        selected: {
            backgroundColor: blue
        },
    
        selectedTitle: {
            color: 'white'
        },
    
        selectedEntity: {
            color: 'rgba(255, 255, 255, 0.6)'
        },
    
        selectedType: {
            color: darkGrey,
            backgroundColor: 'white'
        }
    })),

    invalid: makeStyles(theme => ({
        container: {
            display: 'inline-block'
        },
        block: {
            display: 'inline-block',
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 10,
            color: 'white',
            fontSize: '.9em',
            backgroundColor: theme.palette.error.dark
        },
        triangle: {
            margin: 'auto',
            marginTop: 5,
            width: 0,
            height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderBottom: '10px solid ' + theme.palette.error.dark
        }
    }))
}

export const useStyles = makeStyles(theme => ({
    form: {
        width: '100%'
    },

    input: {
        width: '100%'
    },

    selected: {
        backgroundColor: blue
    },

    selectedTitle: {
        color: 'white'
    },

    selectedEntity: {
        color: 'rgba(255, 255, 255, 0.6)'
    },

    selectedType: {
        color: darkGrey,
        backgroundColor: 'white'
    }
}));

export const FlexContainer = styled.div`
    display: flex;
    position: absolute;
    top: 104px;
    left: 0px;
    height: 100px;
    width: 100%;
    
    & > div:first-child {
        text-align: left;
    }
    
    & > div:nth-child(2) {
        text-align: center;
    }
    
    & > div:last-child {
        text-align: right;
    }`;

export const FlexContent = styled.div`
    flex: 1;`;

export const InputBlock = styled.div`
    display: inline-block;
    width: 30%;
    min-width: 300px;
    max-width: 400px;
    padding-top: 40px;`;

export const SuggestionBlock = styled.div`
    display: inline-block;
    overflow-y: scroll;
    width: 100%;
    max-height: 500px;
    background-color: white;
    border: 1px solid #F1F2F8;
    box-shadow: 0px 0px 15px #e6e9f8;
    
    & > div {
        border-bottom: 1px solid #EEE;
    }
    
    & > div:last-child {
        border-bottom: none;
    }`;

export const Suggestion = styled.div`
    text-align: left;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    cursor: pointer;`;

export const SuggestionTitle = styled.div`
    color: ${darkGrey};
    font-size: .9em;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;`;

export const SuggestionEntity = styled.div`
    color: ${brightGrey};
    font-size: .85em;
    overflow: hidden;
    text-overflow: ellipsis;`;

export const SuggestionTypeBlock = styled.div`
    height: 2.3em;
    overflow: hidden;`;

export const SuggestionType = styled.div`
    display: inline-block;
    color: white;
    background-color: black;
    font-size: .85em;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 5px;
    margin-top: 10px;
    border-radius: 30px;`;
