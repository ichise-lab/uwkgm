import React from 'react';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import LockIcon from '@material-ui/icons/Lock';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityIcon from '@material-ui/icons/Visibility'
import { blue, green, orange, red } from '@material-ui/core/colors';
import { withSnackbar } from 'notistack';

import { apiEndpoint } from 'services/servers';
import { content } from './catalogs.content';
import { fetchCatalogs } from 'services/catalogs/catalogs';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { reassignObject } from 'libs/object';
import { request } from 'services/http';
import { Selector, SelectorMenu } from 'components/templates/forms/forms';
import { styles } from './catalogs.css';
import { styles as pageStyles } from 'components/console/templates/page.css';
import { updateAppBar } from 'components/console/console.action';
import { updateCatalogs, updateActiveCatalog } from 'services/catalogs/catalogs.action';

class CatalogsClass extends React.Component {
    groups = []

    constructor(props) {
        super(props);
        this.isComponentMounted = false;

        this.state = {
            isEditing: false,
            editingCatalog: null
        }
    }

    handleCatalogClick = id => {
        this.setState(() => ({
            isEditing: true,
            editingCatalog: this.props.reducers.catalogs.catalogs[id]
        }));
    }

    handleCatalogSave = catalog => {
        request.json({
            url: apiEndpoint + '/databases/console/catalogs/' + ('_id' in catalog ? 'edit' : 'add'),
            body: {catalog: catalog},
            method: '_id' in catalog ? 'PATCH' : 'POST'
        }).then(data => {
            if (this.isComponentMounted) {
                this.props.enqueueSnackbar('_id' in catalog ? 'Updated 1 catalog' : 'Added 1 catalog', 
                                           {variant: 'success', autoHideDuration: 2000});
                this.setState(() => ({
                    isEditing: false
                }));
                fetchCatalogs(this.props.reducers.catalogs, this.props.actions.catalogs);
            }
        });
    }

    handleCatalogDelete = id => {
        request.json({
            url: apiEndpoint + '/databases/console/catalogs/delete',
            body: {catalog_id: this.props.reducers.catalogs.catalogs[id]._id},
            method: 'DELETE'
        }).then(data => {
            if (this.isComponentMounted) {
                this.props.enqueueSnackbar('Deleted ' + data + ' catalog', 
                                           {variant: 'success', autoHideDuration: 2000});
                fetchCatalogs(this.props.reducers.catalogs, this.props.actions.catalogs);
            }
        })
    }

    handleCatalogCancel = () => {
        this.setState(() => ({
            isEditing: false,
        }));
    }

    handleCreateButtonClick = () => {
        this.setState(() => ({
            isEditing: true,
            editingCatalog: null
        }));
    }

    componentDidMount() {
        this.isComponentMounted = true;
        this.props.actions.console.updateAppBar({title: ['Catalogs']});

        request.json({
            url: apiEndpoint + '/accounts/groups'
        }).then(data => {
            if (this.isComponentMounted) {
                for(let i = 0; i < data.groups.length; i++) {
                    this.groups.push(data.groups[i]);
                }
            }
        });
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    render() {
        return (
            this.state.isEditing ?
                <CatalogFunc 
                    groups={this.groups}
                    editingCatalog={this.state.editingCatalog}
                    onCatalogSave={this.handleCatalogSave}
                    onCatalogCancel={this.handleCatalogCancel}
                />
            :
                <CatalogsFunc 
                    catalogReducer={this.props.reducers.catalogs}
                    onCatalogClick={this.handleCatalogClick}
                    onCatalogDelete={this.handleCatalogDelete}
                    onCreateButtonClick={this.handleCreateButtonClick}
                />
        );
    }
}

const CatalogsFunc = props => {
    const pageClasses = getStyles(pageStyles);
    const {
        catalogReducer,
        onCatalogClick,
        onCatalogDelete,
        onCreateButtonClick
    } = props;

    return (
        <div className={clsx([pageClasses.page.container, pageClasses.page.centeredContainer])}>
            <div className={pageClasses.page.centeredWrapper}>
                <div className={clsx([pageClasses.page.content, pageClasses.page.paddedContent])}>
                    <div className={pageClasses.page.title}>
                        <Language text={content.head.title} />
                    </div>
                    <div className={pageClasses.page.text}>
                        <Language text={content.head.description} />
                    </div>
                    <div className={pageClasses.section.container}>
                        <div className={pageClasses.section.title}>
                            <Language text={content.catalogs.localCatalogs} />
                        </div>
                        <div className={pageClasses.list.container}>
                            {catalogReducer.catalogs.map((item, id) => (
                                <div key={id} className={pageClasses.list.itemBlock}>
                                    <div className={pageClasses.list.itemDetailBlock} onClick={() => onCatalogClick(id)}>
                                        <div className={pageClasses.list.itemTitle}>{item.title}</div>
                                        <div className={pageClasses.list.itemDescription}>{item.description}</div>
                                        <div className={pageClasses.list.itemLink}>{item.uri}</div>
                                    </div>
                                    <div className={pageClasses.list.itemActionsBlock}>
                                        {catalogReducer.catalogs.length > 1 ?
                                            <IconButton onClick={() => onCatalogDelete(id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={pageClasses.actions.container}>
                            <div className={pageClasses.actions.centeredWrapper}>
                                <button type="button" className="btn btn-primary" style={{marginRight: 5}} onClick={onCreateButtonClick}>Create Catalog</button>
                                <button type="button" className="btn btn-secondary" style={{marginRight: 5}} disabled>Export Settings</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CatalogFunc = props => {
    const classes = getStyles(styles);
    const pageClasses = getStyles(pageStyles);
    const {
        groups,
        editingCatalog,
        onCatalogSave,
        onCatalogCancel
    } = props;

    var modifiedEditingCatalog = editingCatalog !== null ? reassignObject({}, editingCatalog) : {
        name: '',
        uri: '',
        title: '',
        description: '',
        standard: 'rdf',
        permissions: [],
        predicates: {
            labels: [
                {name: 'rdfs:label', uri: 'http://www.w3.org/2000/01/rdf-schema#label'},
                {name: 'foaf:name', uri: 'http://xmlns.com/foaf/0.1/name'}
            ], 
            types: [
                {name: 'rdf:type', uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'}
            ]
        }
    };

    const addConfigMapEmptyEntry = configMap => {
        if (configMap.length === 0 || configMap[configMap.length - 1].name !== '' || configMap[configMap.length - 1].uri !== '') {
            configMap.push({name: '', uri: ''});
        } else if (configMap.length > 1 && configMap[configMap.length - 1].name === '' && configMap[configMap.length - 1].uri === '' &&
                   configMap[configMap.length - 2].name === '' && configMap[configMap.length - 2].uri === '') {
            configMap.splice(configMap.length - 1);
        }
    }

    addConfigMapEmptyEntry(modifiedEditingCatalog.predicates.labels);
    addConfigMapEmptyEntry(modifiedEditingCatalog.predicates.types);

    const [catalog, setCatalog] = React.useState(modifiedEditingCatalog);
    const [selector, setSelector] = React.useState(null);
    var excludedGroups = {addGroup: {title: 'Add Group'}}

    const buildExcludedGroupChoices = (allGroups, includedGroups) => {
        var allGroupNames = [];
        var existingGroupNames = [];
        var excludedGroups = {addGroup: {title: 'Add Group'}};

        for (let i = 0; i < allGroups.length; i++) {
            allGroupNames.push(allGroups[i].name);
        }

        for (let i = 0; i < includedGroups.length; i++) {
            existingGroupNames.push(includedGroups[i].group);
        }

        for (let i = 0; i < allGroupNames.length; i++) {
            if (!existingGroupNames.includes(allGroupNames[i])) {
                excludedGroups[allGroupNames[i]] = {title: allGroupNames[i]};
            }
        }

        return excludedGroups
    }

    const handleCatalogUpdate = (key, event) => {
        var updatedCatalog = reassignObject({}, catalog);
        updatedCatalog[key] = event.currentTarget.value;
        setCatalog(updatedCatalog);
    }
    
    const handlePermissionsAdd = event => {
        setSelector({
            element: event.currentTarget,
            choices: buildExcludedGroupChoices(groups, catalog.permissions),
            value: 'addGroup'
        })
    }

    const handlePermissionsAddSelect = (choices, id) => {
        catalog.permissions.push({
            group: choices[id].title,
            allow: []
        });
        setSelector(null);
    }

    const handlePermissionsAddClose = () => {
        setSelector(null);
    }

    const handlePermissionUpdate = (pid, key) => {
        var updatedCatalog = reassignObject({}, catalog);
        var updatedAllow = [];
        var found = false;

        for (let i = 0; i < updatedCatalog.permissions[pid].allow.length; i++) {
            if (updatedCatalog.permissions[pid].allow[i] !== key) {
                updatedAllow.push(updatedCatalog.permissions[pid].allow[i]);
            } else {
                found = true;
            }
        }

        if (!found) {
            updatedAllow.push(key);
        }

        updatedCatalog.permissions[pid].allow = updatedAllow;
        setCatalog(updatedCatalog);
    }

    const handlePermissionDelete = pid => {
        var updatedCatalog = reassignObject({}, catalog);
        updatedCatalog['permissions'].splice(pid, 1);
        setCatalog(updatedCatalog);
    }

    const handlePredicateConfigMapUpdate = (type, pid, key, event) => {
        var updatedCatalog = reassignObject({}, catalog);
        updatedCatalog.predicates[type][pid][key] = event.currentTarget.value;
        addConfigMapEmptyEntry(updatedCatalog.predicates[type]);
        setCatalog(updatedCatalog);
    }

    const handlePredicateConfigMapDelete = (type, pid) => {
        var updatedCatalog = reassignObject({}, catalog);
        updatedCatalog.predicates[type].splice(pid, 1);
        addConfigMapEmptyEntry(updatedCatalog.predicates[type]);
        setCatalog(updatedCatalog);
    }

    const handleSubmit = event => {
        event.preventDefault()
        var finalCatalog = reassignObject({}, catalog);
        var labels = [];
        var types = [];

        for (let i = 0; i < catalog.predicates.labels.length; i++) {
            if (catalog.predicates.labels[i].name !== '' && catalog.predicates.labels[i].uri !== '') {
                labels.push(catalog.predicates.labels[i]);
            } else if (catalog.predicates.labels[i].name === '' && catalog.predicates.labels[i].uri === '') {
                continue;
            } else {
                alert('Missing key/value in predicate config map.');
                return;
            }
        }

        for (let i = 0; i < catalog.predicates.types.length; i++) {
            if (catalog.predicates.types[i].name !== '' && catalog.predicates.types[i].uri !== '') {
                types.push(catalog.predicates.types[i]);
            } else if (catalog.predicates.types[i].name === '' && catalog.predicates.types[i].uri === '') {
                continue;
            } else {
                alert('Missing key/value in predicate config map.');
                return;
            }
        }
        
        finalCatalog.predicates.labels = labels;
        finalCatalog.predicates.types = types;

        onCatalogSave(finalCatalog);
    }

    return (
        <div className={clsx([pageClasses.page.container, pageClasses.page.centeredContainer])}>
            <div className={pageClasses.page.centeredWrapper}>
                <div className={clsx([pageClasses.page.content, pageClasses.page.paddedContent])}>
                    <form onSubmit={handleSubmit}>
                        <div className={pageClasses.page.title}>
                            <Language text={content.head.title} /> / 
                            <TextField 
                                label="Title" 
                                variant="outlined" 
                                value={catalog.title} 
                                style={{marginLeft: 10}}
                                onChange={event => handleCatalogUpdate('title', event)} 
                                required 
                                autoFocus 
                            />
                        </div>
                        <div className={pageClasses.page.text}>
                            <div><Language text={content.catalog.nameAndURIExplain} /></div>
                            <TextField 
                                label="Name" 
                                style={{width: '30%'}} 
                                value={catalog.name} 
                                onChange={event => handleCatalogUpdate('name', event)} 
                                required 
                            />
                            <TextField 
                                label="URI" 
                                style={{width: '70%'}} 
                                value={catalog.uri} 
                                onChange={event => handleCatalogUpdate('uri', event)} 
                                required 
                            />
                            <TextField 
                                label="Description" 
                                style={{width: '100%', marginTop: 20}} 
                                value={catalog.description} 
                                onChange={event => handleCatalogUpdate('description', event)} 
                                variant="outlined" rowsMax={4} 
                                multiline 
                            />
                        </div>
                        <div className={pageClasses.section.container}>
                            <div className={pageClasses.section.title}>
                                <Language text={content.catalog.permissions} />
                            </div>
                            <div className={pageClasses.page.text}>
                                <Language text={content.catalog.permissionsExplain} />
                            </div>
                            <div className={pageClasses.list.container}>
                                <div className={pageClasses.list.itemBlock} style={{cursor: 'default'}}>
                                    <div className={pageClasses.list.itemDetailBlock}>
                                        <div className={pageClasses.list.itemTitle}>
                                            <Language text={content.catalog.administrators} />
                                        </div>
                                    </div>
                                    <div className={pageClasses.list.itemActionsBlock} style={{flex: '0 0 150px'}}>
                                        <IconButton size="small" style={{marginRight: 5}} disabled>
                                            <VisibilityIcon style={{color: blue[400]}} />
                                        </IconButton>
                                        <IconButton size="small" style={{marginRight: 5}} disabled>
                                            <EditIcon style={{color: orange[400]}} />
                                        </IconButton>
                                        <IconButton size="small" style={{marginRight: 5}} disabled>
                                            <DoneAllIcon style={{color: green[400]}}  />
                                        </IconButton>
                                        <IconButton size="small" disabled>
                                            <LockIcon style={{color: 'white'}}  />
                                        </IconButton>
                                    </div>
                                </div>
                                {catalog.permissions.map((item, id) => (
                                    <div key={id} className={pageClasses.list.itemBlock} style={{cursor: 'default'}}>
                                        <div className={pageClasses.list.itemDetailBlock}>
                                            <div className={pageClasses.list.itemTitle}>{item.group}</div>
                                        </div>
                                        <div className={pageClasses.list.itemActionsBlock} style={{flex: '0 0 150px'}}>
                                            <Tooltip title={<Language text={content.catalog.read} />}>
                                                <IconButton size="small" style={{marginRight: 5}} onClick={() => handlePermissionUpdate(id, 'read')}>
                                                    <VisibilityIcon style={{color: item.allow.includes('read') ? blue[400] : 'grey'}} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={<Language text={content.catalog.write} />}>
                                                <IconButton size="small" style={{marginRight: 5}} onClick={() => handlePermissionUpdate(id, 'write')}>
                                                    <EditIcon style={{color: item.allow.includes('write') ? orange[400] : 'grey'}} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={<Language text={content.catalog.commit} />}>
                                                <IconButton size="small" style={{marginRight: 5}} onClick={() => handlePermissionUpdate(id, 'commit')}>
                                                    <DoneAllIcon style={{color: item.allow.includes('commit') ? green[400] : 'grey'}}  />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={<Language text={content.catalog.delete} />}>
                                                <IconButton size="small" onClick={() => handlePermissionDelete(id)}>
                                                    <DeleteIcon style={{color: red[400]}}  />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {catalog.permissions.length < groups.length ?
                                <div className={classes.permissions.addBlock}>
                                    <Selector 
                                        choices={excludedGroups} 
                                        value="addGroup" 
                                        color="blue"
                                        onClick={event => handlePermissionsAdd(event)} 
                                    />
                                </div>
                            : '' }
                        </div>
                        <div className={pageClasses.section.container}>
                            <div className={pageClasses.section.title}>
                                <Language text={content.catalog.predicates} />
                            </div>
                            <div className={pageClasses.page.text}>
                                <Language text={content.catalog.predicatesExplain} />
                            </div>
                            <div className={pageClasses.list.container} style={{border: 'none'}}>
                                <div className={pageClasses.list.sectionTitleBlock}>
                                    <Language text={content.catalog.labels} />
                                </div>
                                {catalog.predicates.labels.map((item, id) => (
                                    <div key={id} className={pageClasses.list.itemBlock} style={{cursor: 'default', border: 'none'}}>
                                        <div className={classes.predicates.itemShortBlock}>
                                            <TextField 
                                                label="Short URI"
                                                variant="outlined"
                                                value={item.name}
                                                className={classes.predicates.input} 
                                                onChange={event => handlePredicateConfigMapUpdate('labels', id, 'name', event)}
                                            />
                                        </div>
                                        <div className={classes.predicates.itemURIBlock}>
                                            <TextField 
                                                label="Full URI"
                                                variant="outlined"
                                                value={item.uri}
                                                className={classes.predicates.input} 
                                                onChange={event => handlePredicateConfigMapUpdate('labels', id, 'uri', event)}
                                            />
                                        </div>
                                        <div className={classes.predicates.itemActionsBlock}>
                                            <Tooltip title={<Language text={content.catalog.delete} />}>
                                                <IconButton size="small" onClick={() => handlePredicateConfigMapDelete('labels', id)}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                ))}
                                <div className={pageClasses.list.sectionTitleBlock}>
                                    <Language text={content.catalog.types} />
                                </div>
                                {catalog.predicates.types.map((item, id) => (
                                    <div key={id} className={pageClasses.list.itemBlock} style={{cursor: 'default', border: 'none'}}>
                                        <div className={classes.predicates.itemShortBlock}>
                                            <TextField 
                                                label="Short URI"
                                                variant="outlined"
                                                value={item.name}
                                                className={classes.predicates.input} 
                                                onChange={event => handlePredicateConfigMapUpdate('types', id, 'name', event)}
                                            />
                                        </div>
                                        <div className={classes.predicates.itemURIBlock}>
                                            <TextField 
                                                label="Full URI"
                                                variant="outlined"
                                                value={item.uri}
                                                className={classes.predicates.input} 
                                                onChange={event => handlePredicateConfigMapUpdate('types', id, 'uri', event)}
                                            />
                                        </div>
                                        <div className={classes.predicates.itemActionsBlock}>
                                            <Tooltip title={<Language text={content.catalog.delete} />}>
                                                <IconButton size="small" onClick={() => handlePredicateConfigMapDelete('types', id)}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={pageClasses.actions.container} style={{marginBottom: 20}}>
                            <div className={pageClasses.actions.centeredWrapper}>
                                <button type="submit" className="btn btn-primary" style={{marginRight: 5}}>Save</button>
                                <button type="button" className="btn btn-secondary" style={{marginRight: 5}} onClick={onCatalogCancel}>Cancel</button>
                            </div>
                        </div>
                        <SelectorMenu
                            selector={selector !== null ? selector.element : null}
                            choices={selector !== null ? selector.choices : null}
                            value={selector !== null ? selector.value : null}
                            onSelect={id => handlePermissionsAddSelect(selector.choices, id)}
                            onClose={() => handlePermissionsAddClose()}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        reducers: {
            catalogs: state.catalogReducer,
            console: state.consoleReducer
        }
    };
}

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            console: {
                updateAppBar: bindActionCreators(updateAppBar, dispatch),
            },
            catalogs: {
                updateCatalogs: bindActionCreators(updateCatalogs, dispatch),
                updateActiveCatalog: bindActionCreators(updateActiveCatalog, dispatch)
            }
        }
    }
}

const Catalogs = connect(mapStateToProps, mapDispatchToProps)(CatalogsClass);
export default withSnackbar(Catalogs);
