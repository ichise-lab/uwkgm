export const content = {
    head: {
        title: {
            en: 'Catalogs',
        },
        description: {
            en: 'A catalog stores metadata of a knowledge graph. Adding a catalog does not create a graph in the graph database; deleting it does not affect the stored graph as well. However, you need a catalog to keep graph modification records.'
        }
    },
    catalogs: {
        localCatalogs: {
            en: 'Local Catalogs'
        }
    },
    catalog: {
        nameAndURIExplain: {
            en: 'Graph name and URI must be unique. Graph name can only include a-z, A-Z, 0-9, -, and _.'
        },
        permissions: {
            en: 'Group Permissions'
        },
        permissionsExplain: {
            en: 'The following permissions only apply to catalogs and access to the graphs via the UWKGM platform. Direct access to the graphs is managed by the graph database.'
        },
        groups: {
            en: 'Grant access to the following groups.'
        },
        read: {
            en: 'Read'
        },
        write: {
            en: 'Write'
        },
        commit: {
            en: 'Commit'
        },
        delete: {
            en: 'Delete'
        },
        administrators: {
            en: 'Administrators'
        },
        predicates: {
            en: 'Predicate Config Map'
        },
        predicatesExplain: {
            en: "The system use graph-specific labels/types URI map to identify entities' label and types."
        },
        labels: {
            en: "Labels"
        },
        types: {
            en: "Types"
        }
    }
}
