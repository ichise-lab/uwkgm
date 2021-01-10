export const updateCatalogs = catalogs => ({
    type: 'UPDATE_CATALOGS',
    payload: {catalogs}
});

export const updateActiveCatalog = name => ({
    type: 'UPDATE_ACTIVE_CATALOG',
    payload: {name}
});