import React from 'react';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { useSelector } from 'react-redux';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import FormControl from '@material-ui/core/FormControl';
import BuildIcon from '@material-ui/icons/Build'
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import ToolTip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';

import PuffLoader from "react-spinners/PuffLoader";
import PulseLoader from "react-spinners/PulseLoader";
import Modal from 'react-bootstrap/Modal'
import BoostrapButton from 'react-bootstrap/Button';
import { withSnackbar, useSnackbar } from 'notistack';

import { apiEndpoint } from 'services/servers';
import { content as options } from './options/options.content';
import { content } from './mods.content';
import { EntitySearchPopover } from 'services/entities/search/search';
import { EntitySelector, EntitySelectorMenu, LanguageSelector } from 'services/entities/selector/selector';
import { Selector, SelectorMenu } from 'templates/forms/forms';
import { genLabelFromURI, shortenURI } from 'libs/rdf';
import { getActiveCatalog } from 'services/catalogs/catalogs';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { Options as ModsOptions } from './options/options';
import { Options } from 'components/console/templates/options';
import { request } from 'services/http';
import { styles as formStyles} from 'templates/forms/forms.css';
import { styles as globalStyles } from 'styles/styles.css';
import { styles as optionStyles } from 'components/console/templates/options.css';
import { styles as pageStyles } from 'components/console/templates/page.css';
import { styles, CustomTextField } from './mods.css';
import { Tools } from './tools/tools';
import { updateAppBar } from 'components/console/console.action';

class ModsClass extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeScreen: 'triples',
            isAddingMod: false,
            triples: [],
            selectedIds: [],
            editingIds: [],
            hoveringId: null,
            clonedTriple: null
        };

        this.isComponentMounted = false;
    }

    handleAddClick = () => {
        this.setState(() => ({
            isAddingMod: !this.state.isAddingMod,
            selectedIds: [],
            clonedTriple: null
        }));
    }

    handleEditClick = () => {
        this.setState(() => ({
            hoveringId: null,
            selectedIds: [],
            editingIds: this.state.selectedIds
        }));
    }

    handleEditDone = itemId => {
        var editingIds = this.state.editingIds;
        editingIds.splice(editingIds.indexOf(itemId), 1);
        this.setState(() => ({editingIds: editingIds}));
    }

    handleRemoveClick = () => {
        var selectedDocIds = [];

        for (let i = 0; i < this.state.selectedIds.length; i++) {
            if (!this.state.triples[this.state.selectedIds[i]].committed) {
                selectedDocIds.push(this.state.triples[this.state.selectedIds[i]].id);
            }
        }

        request.json({
            method: 'DELETE',
            url: apiEndpoint + '/databases/mods/triples/remove',
            body: {
                document_ids: selectedDocIds,
                graph: this.props.reducers.catalogs.active
            }
        }).then(data => {
            if (this.isComponentMounted) {
                this.setState(() => ({
                    selectedIds: []
                }));

                this.fetch();
                this.props.enqueueSnackbar('Removed ' + data + ' modifiers', 
                                            {variant: 'success', autoHideDuration: 2000});
            }
        });
    }

    handleSelectAllClick = () => {
        var selectedIds = [];
        var shouldDeselect = true;

        for (let i = 0; i < this.state.triples.length; i++) {
            if (!this.state.triples[i].committed) {
                selectedIds.push(i);
            }
        }

        for (let i = 0; i < selectedIds.length; i++) {
            if (!this.state.selectedIds.includes(selectedIds[i])) {
                shouldDeselect = false;
            }
        }

        this.setState(() => ({selectedIds: shouldDeselect ? [] : selectedIds}));
    }

    handleCloneClick = () => {
        this.setState(() => ({
            isAddingMod: true,
            clonedTriple: this.state.triples[this.state.selectedIds[0]].triple
        }), () => {
            this.setState(() => ({
                selectedIds: []
            }));
        });
    }

    handleReloadClick = () => {
        this.fetch(true);
    }

    handleItemHover = itemId => {
        if (this.state.editingIds.length === 0) {
            this.setState(() => ({hoveringId: itemId}));
        }
    }

    handleItemEndHover = () => {
        if (this.state.editingIds.length === 0) {
            this.setState(() => ({hoveringId: null}));
        }
    }

    handleItemClick = itemId => {
        if (this.state.editingIds.length === 0) {
            var selectedIds = this.state.selectedIds;

            if (selectedIds.includes(itemId)) {
                selectedIds.splice(selectedIds.indexOf(itemId), 1);
            } else {
                selectedIds.push(itemId);
            }

            this.setState(() => ({selectedIds: selectedIds}));
        }
    }

    fetch = async (reloading = false) => {
        request.json({
            url: apiEndpoint + '/databases/mods/triples/find',
            params: {graph: this.props.reducers.catalogs.active}
        }).then(data => {
            if (this.isComponentMounted) {
                this.setState(() => ({triples: data}), () => {
                    if (reloading) {
                        this.props.enqueueSnackbar('Reloaded', 
                                                   {variant: 'success', autoHideDuration: 2000});
                    }
                });
            }
        });
    }

    componentDidMount() {
        this.isComponentMounted = true;
        this.fetch();
        this.props.actions.console.updateAppBar({title: ['Modifiers']});
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    render() {
        return (
            <ModsFunc 
                triples={this.state.triples}
                isAddingMod={this.state.isAddingMod}
                isComponentMounted={this.isComponentMounted}
                selectedIds={this.state.selectedIds}
                hoveringId={this.state.hoveringId}
                editingIds={this.state.editingIds}
                clonedTriple={this.state.clonedTriple}
                onAddClick={this.handleAddClick}
                onEditClick={this.handleEditClick}
                onEditDone={this.handleEditDone}
                onRemoveClick={this.handleRemoveClick}
                onSelectAllClick={this.handleSelectAllClick}
                onCloneClick={this.handleCloneClick}
                onReloadClick={this.handleReloadClick}
                onItemHover={this.handleItemHover}
                onItemEndHover={this.handleItemEndHover}
                onItemClick={this.handleItemClick}
                fetch={this.fetch}
            />
        );
    }
}

const ModsFunc = props => {
    const isOptionsOpen = useSelector(state => state.consoleReducer).options.isOpen;
    const classes = getStyles(styles);
    const pageClasses = getStyles(pageStyles.page);
    const optionClasses = getStyles(optionStyles.options);
    const [isCommitModalOpen, setCommitModalOpen] = React.useState(false);
    const { 
        triples, 
        isAddingMod,
        isComponentMounted,
        selectedIds,
        hoveringId,
        editingIds,
        clonedTriple,
        onAddClick,
        onEditClick,
        onEditDone,
        onRemoveClick,
        onSelectAllClick,
        onCloneClick,
        onReloadClick,
        onItemHover,
        onItemEndHover,
        onItemClick,
        fetch
    } = props;

    const handleCommitModalClose = () => {
        setCommitModalOpen(false);
    }

    const handleCommitClick = () => {
        setCommitModalOpen(true);
    }

    return (
        <div className={clsx(pageClasses.container, {[optionClasses.contentShift]: isOptionsOpen})}>
            <div className={clsx([pageClasses.content, pageClasses.paddedContent, pageClasses.toolHeadedContent])}>
                <div className={classes.head.container}>
                    <div className={classes.head.leftBlock}>
                        {triples.length > 0 ?
                            <Button startIcon={<KeyboardArrowLeftIcon />} disabled>Back</Button>
                        : ''}
                    </div>
                    <div>
                        <div className={classes.head.searchBlock}>
                        <FormControl className={classes.mods.form}>
                            <CustomTextField 
                                label={<Language text={content.search} />}
                                variant="outlined" 
                                className={classes.mods.input}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton disabled>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                }}
                                disabled
                            />
                        </FormControl>
                        </div>
                    </div>
                    <div className={classes.head.rightBlock}>
                        {triples.length > 0 ?
                            <Button endIcon={<KeyboardArrowRightIcon />} disabled>Next</Button>
                        : ''}
                    </div>
                </div>
                <List 
                    triples={triples}
                    isAddingMod={isAddingMod}
                    isComponentMounted={isComponentMounted}
                    selectedIds={selectedIds}
                    hoveringId={hoveringId}
                    editingIds={editingIds}
                    clonedTriple={clonedTriple}
                    fetch={fetch}
                    onItemHover={onItemHover}
                    onItemEndHover={onItemEndHover}
                    onItemClick={onItemClick}
                    onAddClick={onAddClick}
                    onEditDone={onEditDone}
                />
            </div>
            <Tools 
                triples={triples}
                selectedIds={selectedIds}
                editingIds={editingIds}
                onAddClick={onAddClick}
                onEditClick={onEditClick}
                onRemoveClick={onRemoveClick}
                onSelectAllClick={onSelectAllClick}
                onCloneClick={onCloneClick}
                onReloadClick={onReloadClick}
                onCommitClick={handleCommitClick}
            />
            <Options
                title={<Language text={options.title} />}
                isOptionsOpen={isOptionsOpen}
                disabled={isCommitModalOpen}
            >
                <ModsOptions />
            </Options>
            <CommitModal 
                fetch={fetch}
                isCommitModalOpen={isCommitModalOpen}
                handleCommitModalClose={handleCommitModalClose}
            />
        </div>
    );
}

const List = props => {
    const classes = getStyles(styles);
    const theme = useTheme();
    const { 
        triples, 
        isAddingMod,
        isComponentMounted,
        selectedIds,
        hoveringId,
        editingIds,
        clonedTriple,
        fetch,
        onAddClick,
        onEditDone,
        onItemHover,
        onItemEndHover,
        onItemClick,
    } = props;

    return (
        triples.length > 0 || isAddingMod ?
            <div className={classes.list.container}>
                <div className={classes.list.head}>
                    <div></div>
                    <div>
                        <div className={classes.list.triple}>
                            <div><Language text={content.subject} /></div>
                            <div><Language text={content.predicate} /></div>
                            <div><Language text={content.object} /></div>
                        </div>
                    </div>
                </div>
                {isAddingMod ?
                    <EditItem 
                        clonedTriple={clonedTriple}
                        isComponentMounted={isComponentMounted}
                        onAddClick={onAddClick}
                        fetch={fetch}
                    />
                : ''}
                <div onMouseLeave={onItemEndHover}>
                {triples.map((triple, index) => (
                    !editingIds.includes(index) ?
                        <Item 
                            triple={triple} 
                            key={index}
                            id={index}
                            selectedIds={selectedIds}
                            hoveringId={hoveringId}
                            onItemHover={onItemHover}
                            onItemClick={onItemClick}
                        />
                    : 
                        <EditItem 
                            id={index}
                            triple={triple}
                            isComponentMounted={isComponentMounted}
                            fetch={fetch}
                            onAddClick={onAddClick}
                            onEditDone={onEditDone}
                        />
                ))}
                </div>
            </div>
        : 
            <div className={classes.placeholder.body}>
                <div className={classes.placeholder.container}>
                    <div>
                        <BuildIcon className={classes.placeholder.icon} />
                    </div>
                    <div className={classes.placeholder.content}>
                        <Language text={content.placeholder} />
                    </div>
                    <div className={classes.placeholder.actions}>
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            style={{color: theme.palette.text.primary}}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
    );
}

const Item = props => {
    const classes = getStyles(styles);
    const { 
        triple,
        id,
        selectedIds,
        hoveringId,
        onItemHover,
        onItemClick
    } = props;

    const shouldFade = () => {
        if (selectedIds.length > 0) {
            if (!selectedIds.includes(id) && hoveringId !== id) {
                return true
            }
        } else {
            if (hoveringId !== null && hoveringId !== id) {
                return true
            }
        }
    }

    return (
        <div 
            className={clsx([classes.list.item], 
                            {[classes.list.itemFade]: shouldFade(),
                             [classes.list.itemHover]: id === hoveringId,
                             [classes.list.itemSelected]: selectedIds.includes(id),
                             [classes.list.itemSelectable]: true})} 
            onMouseEnter={() => {onItemHover(id)}}
            onClick={() => {onItemClick(id)}}
        >
            <div>
                {triple.action === 'add' ?
                    <div className={classes.list.itemHead}>
                        <div><AddCircleIcon className={clsx([classes.mods.addIcon], {[classes.list.iconSelected]: selectedIds.includes(id)})} /></div>
                        <div><Language text={content.add} /></div>
                    </div>
                : triple.action === 'edit' ?
                    <div className={classes.list.itemHead}>
                        <div><EditIcon className={clsx([classes.mods.editIcon], {[classes.list.iconSelected]: selectedIds.includes(id)})} /></div>
                        <div><Language text={content.edit} /></div>
                    </div>
                : triple.action === 'delete' ?
                    <div className={classes.list.itemHead}>
                        <div><RemoveCircleIcon className={clsx([classes.mods.deleteIcon], {[classes.list.iconSelected]: selectedIds.includes(id)})} /></div>
                        <div><Language text={content.delete} /></div>
                    </div>
                : ''}
            </div>
            <div>
                <div className={classes.list.triple}>
                    {['subject', 'predicate', 'object'].map(element => (
                        <div className={classes.list.tripleItem} key={element}>
                            <div className={clsx([classes.list.entityBlock, classes.list.entityLabel])}>
                                {triple.triple[element].entity.label}
                            </div>
                            <div className={clsx([classes.list.entityBlock, classes.list.entityURI])}>
                                {triple.triple[element].entity.uri}
                            </div>
                            {element === 'object' && triple.triple.object.type === 'literal' ?
                                <React.Fragment>
                                    <div className={clsx([classes.list.entityBlock, classes.list.entityLiteral])}>
                                        {triple.triple.object.literal}
                                    </div>
                                    {triple.triple.object.language !== null ?
                                        <div className={clsx([classes.list.entityBlock, classes.list.entityLanguage])}>
                                            Language: {triple.triple.object.language}
                                        </div>
                                    : ''}
                                </React.Fragment>
                            : ''}
                        </div>
                    ))}
                </div>
                {triple.action === 'edit' ? 
                    <div className={classes.list.triple}>
                        {['subject', 'predicate', 'object'].map(element => (
                            <div className={classes.list.tripleItem} key={element}>
                                <div className={clsx([classes.list.entityBlock, classes.list.entityLabel, classes.mods.deprecated])}>
                                    {triple.triple[element].entity.label !== triple.originalTriple[element].entity.label ?
                                        triple.originalTriple[element].entity.label
                                    : ''}
                                </div>
                                <div className={clsx([classes.list.entityBlock, classes.list.entityURI, classes.mods.deprecated])}>
                                    {triple.triple[element].entity.uri !== triple.originalTriple[element].entity.uri ?
                                        triple.originalTriple[element].entity.uri
                                    : ''}
                                </div>
                                {element === 'object' && triple.originalTriple.object.type === 'literal' ?
                                    <React.Fragment>
                                        {triple.triple.object.literal !== triple.originalTriple.object.literal ?
                                            <div className={clsx([classes.list.entityBlock, classes.list.entityURI, classes.mods.deprecated])}>
                                                {triple.originalTriple.object.literal || ''}
                                            </div>
                                        : ''}
                                        {triple.triple.object.language !== triple.originalTriple.object.language ||
                                         (triple.triple.object.entity.uri !== 'http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral' &&
                                          triple.originalTriple.object.entity.uri === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral') ?
                                            <div className={clsx([classes.list.entityBlock, classes.list.entityURI, classes.mods.deprecated])}>
                                                Language: {triple.originalTriple.object.language || ''}
                                            </div>
                                        : ''}
                                    </React.Fragment>
                                : ''}
                            </div>
                        ))}
                    </div>
                : ''}
                <div className={clsx([classes.list.meta], {[classes.list.metaSelected]: selectedIds.includes(id)})}>
                    <div>
                        <Language text={content.issuer} /> <b>{triple.issuer}</b> <Language text={content.issueTime} /> <b>{triple.created}</b> <Language text={content.apiVersion} /> <b>{triple.api}</b>
                    </div>
                    <div>
                        {triple.committed ?
                            <ToolTip title="Commited. Changes not permitted.">
                                <IconButton size="small">
                                    <CheckIcon />
                                </IconButton>
                            </ToolTip>
                        : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}

const EditItem = props => {
    const { 
        id,
        triple,
        clonedTriple,
        isComponentMounted, 
        fetch,
        onAddClick, 
        onEditDone
    } = props;

    const editingTriple = triple ? {subject: {...triple.triple.subject}, predicate: {...triple.triple.predicate}, object: {...triple.triple.object}} : {};
    const editingClonedTriple = clonedTriple ? {subject: {...clonedTriple.subject}, predicate: {...clonedTriple.predicate}, object: {...clonedTriple.object}} : {};

    const theme = useTheme();
    const classes = getStyles(styles);
    const formClasses = getStyles(formStyles.form);
    const catalogReducer = useSelector(state => state.catalogReducer);
    const [tripleSelector, setTripleSelector] = React.useState(triple ? editingTriple : clonedTriple ? editingClonedTriple : {
        subject: {entity: {uri: null, label: null}},
        predicate: {entity: {uri: null, label: null}, language: null},
        object: {entity: {uri: null, label: null}, literal: null, language: null, type: 'entity'}
    });
    const [entitySelector, setEntitySelector] = React.useState(null);
    const [entityListSelector, setEntityListSelector] = React.useState(null);
    const [objectTypeSelector, setObjectTypeSelector] = React.useState(null);
    const [editingState, setEditingState] = React.useState({isEditing: false, triple: null});
    const [verifyState, setVerifyState] = React.useState({isVerifying: null, result: null, detail: null, code: null});
    const [entityDict, setEntityDict] = React.useState(null);
    const [loadingEntityDict, setLoadingEntityDict] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        if (checkDuplicate()) {
            verify();
        }
    }, [tripleSelector]);

    const fetchEntity = uri => {
        setLoadingEntityDict(true);

        request.json({
            method: 'GET',
            url: apiEndpoint + '/cui/graphs/entities/entity',
            params: {subject: uri, graph: catalogReducer.active},
        }).then(data => {
            if (isComponentMounted) {
                setEntityDict(data);
                setLoadingEntityDict(false);
            }
        }).catch(error => {
            alert("An error occurred while loading entity's information: " + error);
            setLoadingEntityDict(false);
        });
    }

    const setEntity = (target, entity) => {
        var triple = tripleSelector;
        var payload = Object.assign(triple[target], {entity: {uri: entity.uri, label: entity.label}});

        if ('new' in entity) {
            payload.entity['new'] = true
        }

        triple[target] = payload;
        setTripleSelector(Object.assign({}, triple));

        if (target === 'subject' && entity.uri !== null) {
            fetchEntity(entity.uri);
        }
    }

    const getLabelByLanguage = (item, language) => {
        if (!('labels' in item)) {
            return null;
        }

        for (let i = 0; i < item.labels.length; i++) {
            if (language === null || language === '') {
                return item.labels[i].value;
            } else if ('language' in item.labels[i] && item.labels[i].language === language) {
                return item.labels[i].value;
            } else if (!('language' in item.labels[i]) && (language === 'No tag')) {
                return item.labels[i].value;
            }
        }

        return null;
    }

    const getTypesFromEntity = item => {
        var types = [];

        if ('types' in item) {
            for (let i = 0; i < item.types.length; i++) {
                types.push(genLabelFromURI(item.types[i]));
            }
        }

        return types;
    }

    const genPredicateList = () => {
        const catalog = getActiveCatalog(catalogReducer);
        var labels = [];
        var types = [];
        var items = [];
        var labelItems = [];
        var typeItems = [];
        var otherItems = [];

        for (let i = 0; i < catalog.predicates.labels.length; i++) {
            labels.push(catalog.predicates.labels[i].uri);
        }
        for (let i = 0; i < catalog.predicates.types.length; i++) {
            types.push(catalog.predicates.types[i].uri);
        }

        for (const [key, item] of Object.entries(entityDict)) {
            const dict = {uri: key, 
                          label: getLabelByLanguage(item, tripleSelector.predicate.language) || genLabelFromURI(key),
                          types: getTypesFromEntity(item),
                          type: 'entity',
                          icon: 'link',
                          description: tripleSelector.subject.entity.label || genLabelFromURI(tripleSelector.subject.entity.uri)};
            
            if (labels.includes(key)) { labelItems.push(dict); } 
            else if (types.includes(key)) { typeItems.push(dict); } 
            else { otherItems.push(dict); }
        }

        if (labelItems.length) {
            items.push({section: 'Label'});
            items = [...items, ...labelItems];
        }

        if (typeItems.length) {
            items.push({section: 'Type'});
            items = [...items, ...typeItems];
        }

        if (labelItems.length || typeItems.length) {
            items.push({section: 'Other'});
        }

        return [...items, ...otherItems];
    }

    const genObjectList = () => {
        const genObjectsFromPredicate = (predKey, predItem) => {
            var subItems = [];

            for (const [objKey, objItem] of Object.entries(predItem.objects)) {
                subItems.push({uri: objKey, 
                               label: getLabelByLanguage(objItem, tripleSelector.object.language) || genLabelFromURI(objKey),
                               types: getTypesFromEntity(objItem),
                               type: 'entity',
                               icon: 'link',
                               description: getLabelByLanguage(predItem, tripleSelector.object.language) || genLabelFromURI(predKey)});
            }

            return subItems;
        }

        const genAttributesFromPredicate = (predKey, predItem) => {
            var subItems = [];

            for (let i = 0; i < predItem.attributes.length; i++) {
                const attr = predItem.attributes[i];
                var dict = {uri: 'datatype' in attr ? attr.datatype : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral',
                            types: 'language' in attr ? [attr.language] : null,
                            type: 'literal',
                            icon: 'text',
                            description: getLabelByLanguage(predItem, tripleSelector.object.language) || genLabelFromURI(predKey)}
                
                if ('language' in attr) {
                    dict.language = attr.language
                }

                if (tripleSelector.object.language === null || tripleSelector.object.language === '') {
                    dict.label = attr.value;
                    subItems.push(dict);
                } else if ('language' in attr && attr['language'] === tripleSelector.object.language) {
                    dict.label = attr.value;
                    subItems.push(dict);
                } else if (!('language' in attr) && (tripleSelector.object.language === 'No tag')) {
                    dict.label = attr.value;
                    subItems.push(dict);
                }
            }

            return subItems;
        }

        var entityItems = [];
        var literalItems = [];

        if (tripleSelector.predicate.entity.uri === null || !(tripleSelector.predicate.entity.uri in entityDict)) {
            for (const [predKey, predItem] of Object.entries(entityDict)) {
                if ('objects' in predItem) {
                    entityItems = [...entityItems, ...genObjectsFromPredicate(predKey, predItem)];
                } else if ('attributes' in predItem) {
                    literalItems = [...literalItems, ...genAttributesFromPredicate(predKey, predItem)];
                }
            }
        } else {
            const predItem = entityDict[tripleSelector.predicate.entity.uri];

            if ('objects' in predItem) {
                entityItems = [...entityItems, ...genObjectsFromPredicate(tripleSelector.predicate.entity.uri, predItem)];
            } else if ('attributes' in predItem) {
                literalItems = [...literalItems, ...genAttributesFromPredicate(tripleSelector.predicate.entity.uri, predItem)];
            }
        }

        return [...entityItems, ...literalItems]
    }

    const convertEntityStatus = status => {
        switch(status) {
            case 'triple_verification_pass': return 'pass';
            case 'triple_already_exists': return 'warn';
            case 'domain_range_fail': return 'error';
        }
    }

    const checkDuplicate = () => {
        const exist = {isVerifying: false, 
                       result: false, 
                       detail: 'Triple already exists in the graph.', 
                       code: 'triple_already_exists'};

        if (tripleSelector.subject.entity.uri !== null && 
            tripleSelector.predicate.entity.uri !== null && 
            tripleSelector.object.entity.uri !== null) {
            if (tripleSelector.object.type === 'entity') {
                if (entityDict != null && tripleSelector.predicate.entity.uri in entityDict &&
                    'objects' in entityDict[tripleSelector.predicate.entity.uri] &&
                    tripleSelector.object.entity.uri in entityDict[tripleSelector.predicate.entity.uri].objects) {
                    setVerifyState(exist);
                    return false;
                }
            } else if (tripleSelector.predicate.entity.uri in entityDict && 
                      'attributes' in entityDict[tripleSelector.predicate.entity.uri]) {
                const attributes = entityDict[tripleSelector.predicate.entity.uri].attributes;
                const searchURI = tripleSelector.object.entity.uri;
                const searchLiteral = tripleSelector.object.literal;
                const searchLanguage = tripleSelector.object.language;

                for (let i = 0; i < attributes.length; i++) {
                    if (searchURI === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral' &&
                        !('datatype' in attributes[i])) {
                        if (searchLiteral === attributes[i].value && 
                            (((searchLanguage === null || searchLanguage === '') && !('language' in attributes[i]))
                             || searchLanguage === attributes[i].language)) {
                            setVerifyState(exist);
                            return false;
                        }
                    } else {
                        if (searchLiteral === attributes[i].value && searchURI === attributes[i].datatype) {
                            setVerifyState(exist);
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    const verify = () => {
        console.log(tripleSelector.subject.entity);
        if (tripleSelector.subject.entity.uri !== null && tripleSelector.predicate.entity.uri !== null && tripleSelector.object.entity.uri !== null) {
            if (tripleSelector.object.type === 'entity' && !('new' in tripleSelector.predicate.entity) && !('new' in tripleSelector.object.entity)) {
                const snappedTriple = JSON.stringify(tripleSelector);

                setVerifyState({isVerifying: true, result: null, detail: null, code: null});
        
                if (JSON.stringify(tripleSelector) === snappedTriple) {
                    request.json({
                        url: apiEndpoint + '/databases/graphs/triples/verify',
                        params: {
                            triple: JSON.stringify([tripleSelector.subject.entity.uri, tripleSelector.predicate.entity.uri, tripleSelector.object.entity.uri]),
                            graph_uri: getActiveCatalog(catalogReducer).uri
                        }
                    }).then(data => {
                        if (isComponentMounted) {
                            if (JSON.stringify(tripleSelector) === snappedTriple) {
                                setVerifyState({isVerifying: false, result: data.result, detail: data.detail, code: data.code});
                            }
                        }
                    });
                }
            } else {
                setVerifyState({isVerifying: false, result: true, detail: 'Triple verification pass.', code: 'triple_verification_pass'});
            }
        } else {
            setVerifyState({isVerifying: false, result: null, detail: null, code: null});
        }
    }
    
    const handleEntityClick = (event, target) => {
        setEntitySelector({
            element: event.currentTarget,
            target: target,
            language: tripleSelector[target].language
        });
    }

    const handleEntitySelect = entity => {
        setEntity(entitySelector.target, entity);
    }

    const handleEntityClose = () => {
        setEntitySelector(null);
    }

    const handleAddButtonClick = () => {
        request.json({
            url: apiEndpoint + '/databases/mods/triples/add',
            method: 'POST',
            body: {
                triple: tripleSelector,
                doc_id: triple ? triple.id : '',
                graph: catalogReducer.active
            }
        }).then(data => {
            if (triple) {
                enqueueSnackbar('Edited 1 modifer', {variant: 'success', autoHideDuration: 2000});
            } else {
                enqueueSnackbar('Added 1 modifer', {variant: 'success', autoHideDuration: 2000});
            }

            if (triple) {
                onEditDone(id);
            } else {
                onAddClick();
            }

            fetch();
        });
    }

    const handleEditButtonClick = () => {
        if (editingState.isEditing) {
            request.json({
                url: apiEndpoint + '/databases/mods/triples/edit',
                method: 'POST',
                body: {
                    triple: tripleSelector,
                    original_triple: editingState.triple,
                    doc_id: triple ? triple.id : '',
                    graph: catalogReducer.active
                }
            }).then(data => {
                if (triple) {
                    enqueueSnackbar('Edited 1 modifer', {variant: 'success', autoHideDuration: 2000});
                } else {
                    enqueueSnackbar('Added 1 modifer', {variant: 'success', autoHideDuration: 2000});
                }

                if (triple) {
                    onEditDone(id);
                } else {
                    onAddClick();
                }

                fetch();
            });
        } else {
            var triple = {subject: Object.assign({}, tripleSelector.subject), 
                          predicate: Object.assign({}, tripleSelector.predicate), 
                          object: Object.assign({}, tripleSelector.object)};

            triple.subject.entity = Object.assign({}, triple.subject.entity);
            triple.predicate.entity = Object.assign({}, triple.predicate.entity);
            triple.object.entity = Object.assign({}, triple.object.entity);

            setEditingState({isEditing: true, triple: {
                subject: Object.assign({}, tripleSelector.subject), 
                predicate: Object.assign({}, tripleSelector.predicate), 
                object: Object.assign({}, tripleSelector.object)
            }});
        }
    }

    const handleDeleteButtonClick = () => {
        request.json({
            url: apiEndpoint + '/databases/mods/triples/delete',
            method: 'POST',
            body: {
                triple: tripleSelector,
                doc_id: triple ? triple.id : '',
                graph: catalogReducer.active
            }
        }).then(data => {
            if (triple) {
                enqueueSnackbar('Edited 1 modifer', {variant: 'success', autoHideDuration: 2000});
            } else {
                enqueueSnackbar('Added 1 modifer', {variant: 'success', autoHideDuration: 2000});
            }

            if (triple) {
                onEditDone(id);
            } else {
                onAddClick();
            }

            fetch();
        });
    }

    const handleCancelButtonClick = () => {
        if (editingState.isEditing) {
            setEditingState({isEditing: false, triple: null});
        } else {
            if (triple) {
                onEditDone(id);
            } else {
                onAddClick();
            }
        }
    }

    const handleEntityListClick = (event, target) => {
        setEntityListSelector({
            element: event.currentTarget,
            target: target,
            choices: target === 'predicate' ? genPredicateList() : genObjectList()
        });
    }

    const handleEntityListSelect = entity => {
        var dict = {};

        if (entity.type === 'entity') {
            dict = {uri: entity.uri, label: entity.label};
        } else {
            dict = {uri: entity.uri, label: shortenURI(entity.uri) || 'Custom'};
        }

        setEntity(entityListSelector.target, dict);
        setEntityListSelector(null);

        if (entityListSelector.target === 'object') {
            var triple = tripleSelector;
            triple.object.type = entity.type;

            if ('language' in entity) {
                triple.object.language = entity.language;
            } else {
                triple.object.language = null;
            }

            if (entity.type === 'literal') {
                triple.object.literal = entity.label;
            }

            setTripleSelector(Object.assign({}, triple));
        }
    }

    const handleEntityListClose = () => {
        setEntityListSelector(null);
    }

    const handlePredicateLanguageChange = language => {
        var triple = tripleSelector;
        triple.predicate.language = language;
        setTripleSelector(Object.assign({}, triple));
    }

    const handleObjectTypeSelectorClick = (event, choices, value) => {
        setObjectTypeSelector({
            element: event.currentTarget, 
            choices: choices,
            value: value
        });
    }

    const handleObjectTypeSelectorChange = value => {
        var triple = tripleSelector;
        triple.object.type = value;
        setTripleSelector(Object.assign({}, triple));
        setObjectTypeSelector(null);
        verify();
    }

    const handleObjectTypeSelectorClose = () => {
        setObjectTypeSelector(null);
    }

    const handleObjectLanguageChange = language => {
        var triple = tripleSelector;
        triple.object.language = language;
        setTripleSelector(Object.assign({}, triple));
    }

    const handleLiteralChange = event => {
        var triple = tripleSelector;
        triple.object.literal = event.currentTarget.value;
        setTripleSelector(Object.assign({}, triple));
    }

    return (
        <React.Fragment>
            <div className={clsx([classes.list.item, classes.editItem.container])}>
                <div>
                    <div className={classes.list.itemHead}>
                        {editingState.isEditing ?
                            <React.Fragment>
                                <div><EditIcon className={classes.mods.editingIcon} /></div>
                                <div><Language text={content.edit} /></div>
                            </React.Fragment>
                        :
                            triple ?
                                triple.action === 'add' ?
                                    <React.Fragment>
                                        <div><AddCircleIcon className={classes.mods.editingIcon} /></div>
                                        <div><Language text={content.add} /></div>
                                    </React.Fragment>
                                : triple.action === 'edit' ?
                                    <React.Fragment>
                                        <div><EditIcon className={classes.mods.editingIcon} /></div>
                                        <div><Language text={content.edit} /></div>
                                    </React.Fragment>
                                : triple.action === 'delete' ?
                                    <React.Fragment>
                                        <div><RemoveCircleIcon className={classes.mods.editingIcon} /></div>
                                        <div><Language text={content.delete} /></div>
                                    </React.Fragment>
                                : ''
                            :
                                <React.Fragment>
                                    <div><AddCircleOutlineIcon className={classes.mods.editingIcon} /></div>
                                    <div><Language text={content.new} /></div>
                                </React.Fragment>
                        }
                    </div>
                </div>
                <div>
                    {editingState.isEditing ?
                        <div className={classes.list.triple} style={{marginBottom: 15}}>
                            {['subject', 'predicate', 'object'].map(element => (
                                <div className={classes.list.tripleItem} key={element}>
                                    <div className={clsx([classes.list.entityBlock, classes.list.entityLabel])}>{editingState.triple[element].entity.label}</div>
                                    <div className={clsx([classes.list.entityBlock, classes.list.entityURI])}>{editingState.triple[element].entity.uri}</div>
                                    {element === 'object' &&  editingState.triple.object.type === 'literal' ?
                                        <div className={classes.editItem.literalBlock}>
                                            <TextField
                                                label="Attribute's value"
                                                className={classes.editItem.literalTextBox}
                                                multiline
                                                rowsMax={4}
                                                value={editingState.triple.object.literal || ''}
                                                variant="outlined"
                                            />
                                        </div>
                                    : ''}
                                </div>
                            ))}
                        </div>
                    : ''}
                    <div className={classes.list.triple}>
                        {['subject', 'predicate', 'object'].map(element => (
                            <div className={classes.list.tripleItem} key={element}>
                                {element === 'object' ? 
                                    <Selector
                                        choices={{
                                            entity: {title: 'Entity', value: 'entity'},
                                            literal: {title: 'Literal', value: 'literal'}
                                        }}
                                        value={tripleSelector.object.type}
                                        onClick={(event, choices, value) => handleObjectTypeSelectorClick(event, choices, value)}
                                    />
                                : ''}
                                <EntitySelector 
                                    key={element}
                                    onClick={event => handleEntityClick(event, element)} 
                                    status={convertEntityStatus(verifyState.code)}
                                    element={tripleSelector[element]}
                                />
                                {element === 'subject' ? 
                                    <div className={clsx([classes.editItem.loaderBlock, {[classes.editItem.loaderBlockVisible]: loadingEntityDict}])}>
                                        <PulseLoader 
                                            color={theme.palette.text.primary}
                                            size={10}
                                        />
                                    </div>
                                : ''}
                                {element === 'predicate' ?
                                    <React.Fragment>
                                        <LanguageSelector 
                                            activeLanguage={tripleSelector.predicate.language}
                                            onLanguageChange={handlePredicateLanguageChange}
                                        />
                                        {entityDict !== null && Object.keys(entityDict).length ?
                                            <Selector 
                                                choices={{count: {title: Object.keys(entityDict).length}}}
                                                value="count"
                                                color="orange"
                                                onClick={(event, choices, value) => handleEntityListClick(event, 'predicate')}
                                            />
                                        : ''}
                                    </React.Fragment>
                                : ''}
                                {element === 'object' ?
                                    <React.Fragment>
                                        <LanguageSelector 
                                            activeLanguage={tripleSelector.object.language}
                                            onLanguageChange={handleObjectLanguageChange}
                                        />
                                        {entityDict !== null && Object.keys(entityDict).length ?
                                            <Selector 
                                                choices={{count: {title: genObjectList().length}}}
                                                value="count"
                                                color="orange"
                                                onClick={(event, choices, value) => handleEntityListClick(event, 'object')}
                                            />
                                        : ''}
                                    </React.Fragment>
                                : ''}
                                {tripleSelector[element].entity.uri != null ?
                                    <React.Fragment>
                                        <div 
                                            className={clsx([classes.list.entityBlock, classes.list.entityURI], 
                                                            {[classes.list.entityEmptyLabel]: tripleSelector[element].entity.uri === null})}
                                        >
                                            {tripleSelector[element].entity.uri}
                                        </div>
                                    </React.Fragment>
                                : ''}
                                {element === 'object' && tripleSelector.object.type === 'literal' && tripleSelector.object.entity.uri !== null ?
                                    <div className={classes.editItem.literalBlock}>
                                        <TextField
                                            label="Attribute's value"
                                            className={classes.editItem.literalTextBox}
                                            multiline
                                            rowsMax={4}
                                            value={tripleSelector.object.literal || ''}
                                            onChange={handleLiteralChange}
                                            variant="outlined"
                                        />
                                    </div>
                                : ''}
                            </div>
                        ))}
                    </div>
                    <div className={classes.list.meta}>
                        <div>
                            {verifyState.isVerifying ?
                                <React.Fragment>
                                    <div style={{display: 'inline-block'}}>
                                        <PuffLoader 
                                            color="#888"
                                            size={18}
                                        />
                                    </div>
                                    <div style={{display: 'inline-block', verticalAlign: 'top', marginLeft: 5}}>Verifying...</div>
                                </React.Fragment>
                            : verifyState.code === 'triple_already_exists' ?
                                <div className={classes.list.itemWarningMessage}>
                                    {verifyState.detail}
                                </div>
                            : verifyState.code === 'domain_range_fail' ?
                                <div className={classes.list.itemErrorMessage}>
                                    {verifyState.detail}
                                </div>
                            : verifyState.code === 'triple_verification_pass' ? 
                                'Once saved, the new modification will not be applied to the graph until it is committed.' 
                            : 
                                'Choose entities to add, edit, or remove a triple.'
                            }
                        </div>
                        <div>
                            {verifyState.code === 'triple_verification_pass' ?
                                editingState.isEditing ?
                                    <button className={clsx([formClasses.block, formClasses.button, formClasses.blue])} onClick={handleEditButtonClick}>Edit</button>
                                :
                                    <button className={clsx([formClasses.block, formClasses.button, formClasses.blue])} onClick={handleAddButtonClick}>Add</button>
                            : verifyState.code === 'triple_already_exists' ?
                                !editingState.isEditing ?
                                    <React.Fragment>
                                        <button className={clsx([formClasses.block, formClasses.button, formClasses.orange])} onClick={handleEditButtonClick}>Edit</button>
                                        <button className={clsx([formClasses.block, formClasses.button, formClasses.red])} onClick={handleDeleteButtonClick}>Delete</button>
                                    </React.Fragment>
                                : ''
                            : ''}
                            <button className={clsx([formClasses.block, formClasses.button])} onClick={handleCancelButtonClick} onClick={handleCancelButtonClick}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            {entitySelector ?
                <EntitySearchPopover
                    selector={entitySelector}
                    onSelect={handleEntitySelect}
                    onClose={handleEntityClose}
                />
            : ''}
            <SelectorMenu
                selector={objectTypeSelector !== null ? objectTypeSelector.element : null}
                choices={objectTypeSelector !== null ? objectTypeSelector.choices : null}
                value={objectTypeSelector !== null ? objectTypeSelector.value : null}
                onSelect={handleObjectTypeSelectorChange}
                onClose={handleObjectTypeSelectorClose}
            />
            {entityListSelector ?
            <EntitySelectorMenu
                selector={entityListSelector !== null ? entityListSelector.element : null}
                choices={entityListSelector !== null ? entityListSelector.choices : null}
                onSelect={handleEntityListSelect}
                onClose={handleEntityListClose}
            />
            : ''}
        </React.Fragment>
    );
}

const CommitModal = props => {
    const modalClasses = getStyles(globalStyles.modal);
    const [numCommited, setNumCommited] = React.useState(null);
    const catalogReducer = useSelector(state => state.catalogReducer);
    const { 
        fetch,
        isCommitModalOpen,
        handleCommitModalClose
    } = props;

    const handleCommitClick = () => {
        request.json({
            url: apiEndpoint + '/databases/mods/triples/commit',
            method: 'PATCH',
            body: {
                graph: getActiveCatalog(catalogReducer).name,
                graph_uri: getActiveCatalog(catalogReducer).uri
            }
        }).then(data => {
            setNumCommited(data);
            fetch();
        });
    }

    const handleCommitClose = () => {
        setNumCommited(null);
        handleCommitModalClose();
    }

    return (
        <Modal 
            className={modalClasses.background}
            show={isCommitModalOpen} 
            onHide={handleCommitClose} 
            animation={false} 
            centered
        >
            <Modal.Header className={clsx([modalClasses.common, modalClasses.header])} closeButton>
                <Modal.Title>Commit</Modal.Title>
            </Modal.Header>
            <Modal.Body className={modalClasses.common}>
                {numCommited ? 
                    <React.Fragment>
                        <div className={modalClasses.iconBlock}>
                            <CheckCircleIcon className={modalClasses.icon} />
                        </div>
                        <div className={modalClasses.content}>
                            Successfully committed {numCommited} changes.
                        </div>
                    </React.Fragment>
                :
                    <React.Fragment>
                        <div className={modalClasses.iconBlock}>
                            <ErrorOutlineIcon className={modalClasses.icon} />
                        </div>
                        <div className={modalClasses.content}>
                            Are you sure you want to commit changes? <br />
                            Committed changes will be permanent.
                        </div>
                    </React.Fragment>
                }
            </Modal.Body>
            <Modal.Footer className={clsx([modalClasses.common, modalClasses.footer])}>
                <BoostrapButton variant="secondary" onClick={handleCommitClose}>
                    Close
                </BoostrapButton>
                {numCommited === null ?
                    <BoostrapButton variant="primary" onClick={handleCommitClick}>
                        Commit
                    </BoostrapButton>
                : ''}
            </Modal.Footer>
        </Modal>
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
            console: {
                updateAppBar: bindActionCreators(updateAppBar, dispatch)
            }
        }
    };
}

const Mods = connect(mapStateToProps, mapDispatchToProps)(ModsClass);
export default withSnackbar(Mods);
