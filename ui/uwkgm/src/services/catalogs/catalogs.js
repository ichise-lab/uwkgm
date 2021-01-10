import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import IconButton from '@material-ui/core/IconButton';
import LayersIcon from '@material-ui/icons/Layers';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { apiEndpoint } from 'services/servers';
import { getStyles } from 'styles/styles';
import { request } from 'services/http';
import { styles } from './catalogs.css';
import { updateCatalogs } from './catalogs.action';

export const fetchCatalogs = catalogActions => {
    var promise = new Promise((resolve, reject) => {
        request.json({
            url: apiEndpoint + '/databases/mods/catalogs/find'
        }).then(catalogs => {
            catalogActions.updateCatalogs(catalogs);

            if (catalogs.length > 0) {
                catalogActions.updateActiveCatalog(catalogs[0].name);
            }

            resolve(catalogs);
        }).catch(error => {
            reject(error);
        });
    });

    return promise;
}

export const getActiveCatalog = catalogReducer => {
    for (let i = 0; i < catalogReducer.catalogs.length; i++) {
        if (catalogReducer.active === catalogReducer.catalogs[i].name) {
            return catalogReducer.catalogs[i];
        }
    }

    return null;
}

class CatalogSelectorClass extends React.Component {
    render() {
        return (
            <CatalogSelectorFunc 
                catalogReducer={this.props.reducers.catalogs}
            />
        );
    }
}

const CatalogSelectorFunc = props => {
    const classes = getStyles(styles.catalogs);
    const { catalogReducer } = props;
    const [ catalogAnchor, setCatalogAnchor ] = React.useState(null);

    const handleCatalogButtonClick = event => {
        setCatalogAnchor(event.currentTarget);
    };

    const handleCatalogMenuClose = () => {
        setCatalogAnchor(null);
    };

    const handleCatalogUpdate = catalog => {
        // window.localStorage.setItem('catalog', catalog);
        // dispatch(updateCatalogs(catalog));
        handleCatalogMenuClose();
    }

    return (
        <React.Fragment>
            <IconButton aria-label="catalog" onClick={handleCatalogButtonClick}>
                <LayersIcon />
            </IconButton>
            <Menu
                anchorEl={catalogAnchor}
                keepMounted
                open={Boolean(catalogAnchor)}
                onClose={handleCatalogMenuClose}
            >
                {catalogReducer.catalogs !== null ?
                    catalogReducer.catalogs.map((catalog, index) => (
                        <MenuItem 
                            key={index}
                            onClick={() => handleCatalogUpdate(catalog.name)}>
                                {
                                    catalogReducer.active === catalog.name ? 
                                        <div>
                                            <b>
                                                <div className={classes.title}>{catalog.title}</div>
                                                <div className={classes.uri}>{catalog.uri}</div>
                                            </b>
                                        </div>
                                    :
                                        <div>
                                            <div className={classes.title}>{catalog.title}</div>
                                            <div className={classes.uri}>{catalog.uri}</div>
                                        </div>
                                }
                                
                        </MenuItem>
                    ))
                : ''}
            </Menu>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        reducers: {
            catalogs: state.catalogReducer
        }
    };
}

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            catalogs: {
                updateCatalogs: bindActionCreators(updateCatalogs, dispatch)
            }
        }
    };
}

export const CatalogSelector = connect(mapStateToProps, mapDispatchToProps)(CatalogSelectorClass);