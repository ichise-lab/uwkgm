import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';

import { brightGrey, darkGrey } from '../../../styles/colors.css';

export const styles = {
    page: makeStyles(theme => ({
        container: {
            display: 'flex',
            height: '100%',
            width: '100%'
        },

        content: {
            flex: 1,
            paddingTop: 54
        },

        title: {
            width: '100%',
            marginTop: 0,
            marginBottom: 20,
            color: theme.palette.text.primary,
            fontWeight: 'bold',
            fontSize: '2em'
        },

        paddedContent: {
            paddingLeft: 24,
            paddingRight: 24
        },

        text: {
            color: theme.palette.text.secondary
        }
    }))
}

export const useStyles = makeStyles(theme => ({
    paddedContent: {
        paddingLeft: 24,
        paddingRight: 24
    }
}));

export const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;`

export const ContentContainer = styled.div`
    flex: 1;
    padding-top: 54px;`

export const TitleContainer = styled.div`
    width: 100%;
    margin-top: 0px;
    margin-bottom: 20px;
    color: ${darkGrey};
    font-weight: bold;
    font-size: 2em;`

export const TextBlock = styled.p`
    color: ${brightGrey};`
