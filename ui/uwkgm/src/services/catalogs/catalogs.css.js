import styled from 'styled-components';
import { darkGrey, brightGrey } from '../../styles/colors.css';
import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    catalogs: makeStyles(theme => ({
        title: {
            color: theme.palette.text.primary
        },
        uri: {
            color: theme.palette.text.secondary,
            fontSize: '.9em',
            marginLeft: 15
        }
    }))
}

export const CatalogTitle = styled.div`
    color: ${darkGrey};`;

export const GraphURI = styled.div`
    color: ${brightGrey};
    font-size: .9em;
    margin-left: 15px;`;
