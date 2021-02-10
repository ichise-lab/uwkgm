import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import IconButton from '@material-ui/core/IconButton';
import LayersIcon from '@material-ui/icons/Layers';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withSnackbar } from 'notistack';

import { apiEndpoint } from 'services/servers';
import { getStyles } from 'styles/styles';
import { request } from 'services/http';
import { styles } from './catalogs.css';
import { updateCatalogs, updateActiveCatalog } from './catalogs.action';

export const getActiveCatalog = catalogReducer => {
    for (let i = 0; i < catalogReducer.catalogs.length; i++) {
        if (catalogReducer.active === catalogReducer.catalogs[i].name) {
            return catalogReducer.catalogs[i];
        }
    }

    return null;
}

export const fetchCatalogs = (catalogReducer, catalogActions) => {
    var promise = new Promise((resolve, reject) => {
        request.json({
            url: apiEndpoint + '/databases/console/catalogs/find'
        }).then(catalogs => {
            catalogActions.updateCatalogs(catalogs);

            if (catalogs.length > 0) {
                var foundActiveCatalog = false;

                if (catalogReducer.catalogs !== null) {
                    for (let i = 0; i < catalogReducer.catalogs.length; i++) {
                        if (catalogReducer.active === catalogReducer.catalogs[i].name) {
                            catalogActions.updateActiveCatalog(catalogs[i].name);
                            foundActiveCatalog = true;
                        }
                    }
                }

                if (!foundActiveCatalog) {
                    catalogActions.updateActiveCatalog(catalogs[0].name);
                }
            }

            resolve(catalogs);
        }).catch(error => {
            reject(error);
        });
    });

    return promise;
}

class CatalogSelectorClass extends React.Component {
    render() {
        return (
            <CatalogSelectorFunc 
                catalogReducer={this.props.reducers.catalogs}
                enqueueSnackbar={this.props.enqueueSnackbar}
                updateActiveCatalog={this.props.actions.catalogs.updateActiveCatalog}
            />
        );
    }
}

const CatalogSelectorFunc = props => {
    const classes = getStyles(styles.catalogs);
    const { catalogReducer, enqueueSnackbar, updateActiveCatalog } = props;
    const [ catalogAnchor, setCatalogAnchor ] = React.useState(null);

    const handleCatalogButtonClick = event => {
        setCatalogAnchor(event.currentTarget);
    };

    const handleCatalogMenuClose = () => {
        setCatalogAnchor(null);
    };

    const handleCatalogUpdate = catalog => {
        updateActiveCatalog(catalog);
        handleCatalogMenuClose();

        for (let i = 0; i < catalogReducer.catalogs.length; i++) {
            if (catalog === catalogReducer.catalogs[i].name) {
                enqueueSnackbar('Changed to catalog "' + catalogReducer.catalogs[i].title + '"', {variant: 'success', autoHideDuration: 2000});
            }
        }
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
                updateCatalogs: bindActionCreators(updateCatalogs, dispatch),
                updateActiveCatalog: bindActionCreators(updateActiveCatalog, dispatch)
            }
        }
    };
}

export const CatalogSelector = withSnackbar(connect(mapStateToProps, mapDispatchToProps)(CatalogSelectorClass));