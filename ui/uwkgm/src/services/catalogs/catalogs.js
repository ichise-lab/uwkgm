import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import LayersIcon from '@material-ui/icons/Layers';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { getStyles } from 'styles/styles';
import { styles } from './catalogs.css';
import { updateCatalog } from './catalogs.action';

/*
const getDefaultGraph = () => {
    var defaultGraph = graphConfig[0].name;

    graphConfig.map(graph => {
        if (graph.default) {
            defaultGraph = graph.name;
        }
        return null;
    });

    return defaultGraph;
}
*/

//export const graphConfig = jsyaml.load(process.env.REACT_APP_CONFIG_DATABASE).graphs
//export const initGraph = window.localStorage.getItem('graph') || getDefaultGraph();

// CATALOG

export const catalogConfig = [
    {name: 'dbpedia', title: 'DBpedia', uri: 'http://dbpedia.org'}
];
export const initGraph = 'http://dbpedia.org';
// export const initGraph = 'http://jpcovid19.uwkgm.com';

export const getGraphURIfromName = name => {
    /*
    var uri = null;

    graphConfig.map(graph => {
        if (graph.name === name) {
            uri = graph.uri;
        }
        return null;
    });

    return uri;
    */
    
    return name;
}

export const CatalogSelector = props => {
    const dispatch = useDispatch();
    const classes = getStyles(styles.catalogs);
    const { className } = props;
    const { catalog } = useSelector(state => ({catalog: state.catalogReducer.catalog}));
    const [ catalogAnchor, setCatalogAnchor ] = React.useState(null);

    const handleCatalogButtonClick = event => {
        setCatalogAnchor(event.currentTarget);
    };

    const handleCatalogMenuClose = () => {
        setCatalogAnchor(null);
    };

    const handleCatalogUpdate = catalog => {
        window.localStorage.setItem('catalog', catalog);
        dispatch(updateCatalog(catalog));
        handleCatalogMenuClose();
    }

    return (
        <React.Fragment>
            <IconButton aria-label="catalog" onClick={handleCatalogButtonClick}>
                <LayersIcon className={className} />
            </IconButton>
            <Menu
                anchorEl={catalogAnchor}
                keepMounted
                open={Boolean(catalogAnchor)}
                onClose={handleCatalogMenuClose}
            >
                {
                    catalogConfig.map((cat, index) => (
                        <MenuItem 
                            key={index}
                            onClick={() => handleCatalogUpdate(cat.name)}>
                                {
                                    catalog === cat.name ? 
                                        <div>
                                            <b>
                                                <div className={classes.title}>{cat.title}</div>
                                                <div className={classes.uri}>{cat.uri}</div>
                                            </b>
                                        </div>
                                    :
                                        <div>
                                            <div className={classes.title}>{cat.title}</div>
                                            <div className={classes.uri}>{cat.uri}</div>
                                        </div>
                                }
                                
                        </MenuItem>
                    ))
                }
            </Menu>
        </React.Fragment>
    );
}
