import React from 'react';
import clsx from 'clsx';
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
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import SearchIcon from '@material-ui/icons/Search';
import ToolTip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';

import PuffLoader from "react-spinners/PuffLoader";
import Modal from 'react-bootstrap/Modal'
import BoostrapButton from 'react-bootstrap/Button';
import { withSnackbar, useSnackbar } from 'notistack';

import { apiEndpoint } from 'services/servers';
import { content as options } from './options/options.content';
import { content } from './mods.content';
import { EntitySearchPopover } from 'services/entities/search/search';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { Options as ModsOptions } from './options/options';
import { Options } from 'components/console/templates/options';
import { request } from 'services/http';
import { styles as globalStyles } from 'styles/styles.css';
import { styles as optionStyles } from 'components/console/templates/options.css';
import { styles as pageStyles } from 'components/console/templates/page.css';
import { styles, CustomTextField } from './mods.css';
import { Tools } from './tools/tools';

class Mods extends React.Component {
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
                document_ids: selectedDocIds
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
            url: apiEndpoint + '/databases/mods/triples/find'
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
                             [classes.list.itemSelectable]: true})} 
            onMouseEnter={() => {onItemHover(id)}}
            onClick={() => {onItemClick(id)}}
        >
            <div>
                {triple.action === 'add' ?
                    <div className={classes.list.itemHead}>
                        <div><AddCircleIcon className={classes.mods.addIcon} /></div>
                        <div><Language text={content.add} /></div>
                    </div>
                : triple.action === 'edit' ?
                    <div className={classes.list.itemHead}>
                        <div><EditIcon className={classes.mods.editIcon} /></div>
                        <div><Language text={content.edit} /></div>
                    </div>
                : triple.action === 'delete' ?
                    <div className={classes.list.itemHead}>
                        <div><RemoveCircleIcon className={classes.mods.deleteIcon} /></div>
                        <div><Language text={content.delete} /></div>
                    </div>
                : ''}
            </div>
            <div>
                <div className={classes.list.triple}>
                    {['subject', 'predicate', 'object'].map(element => (
                        <div className={classes.list.tripleItem} key={element}>
                            <div>
                                {triple.triple[element].label}
                            </div>
                            <div>
                                {triple.triple[element].entity}
                            </div>
                        </div>
                    ))}
                </div>
                {triple.action === 'edit' ? 
                    <div className={classes.list.triple}>
                        {['subject', 'predicate', 'object'].map(element => (
                            <div className={classes.list.tripleItem} key={element}>
                                <div className={classes.mods.deprecated}>
                                    {triple.triple[element].label !== triple.originalTriple[element].label ?
                                        triple.originalTriple[element].label
                                    : ''}
                                </div>
                                <div className={classes.mods.deprecated}>
                                    {triple.triple[element].entity !== triple.originalTriple[element].entity ?
                                        triple.originalTriple[element].entity
                                    : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                : ''}
                <div className={classes.list.meta}>
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

    const classes = getStyles(styles);
    const [tripleSelector, setTripleSelector] = React.useState(triple ? editingTriple : clonedTriple ? editingClonedTriple : {subject: null, predicate: null, object: null});
    const [entitySelector, setEntitySelector] = React.useState(null);
    const [editingState, setEditingState] = React.useState({isEditing: false, triple: null});
    const [verifyState, setVerifyState] = React.useState({isVerifying: null, result: null, detail: null, code: null});
    const { enqueueSnackbar } = useSnackbar();
    
    const handleEntityClick = (event, target) => {
        setEntitySelector({
            element: event.currentTarget,
            target: target
        });
    }

    const handleEntitySelect = entity => {
        var triple = tripleSelector;
        triple[entitySelector.target] = entity;
        setTripleSelector(triple);

        setTimeout(verify, 100);
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
                doc_id: triple ? triple.id : ''
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
                    doc_id: triple ? triple.id : ''
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
            setEditingState({isEditing: true, triple: {subject: tripleSelector.subject, predicate: tripleSelector.predicate, object: tripleSelector.object}});
        }
    }

    const handleDeleteButtonClick = () => {
        request.json({
            url: apiEndpoint + '/databases/mods/triples/delete',
            method: 'POST',
            body: {
                triple: tripleSelector,
                doc_id: triple ? triple.id : ''
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

    const verify = () => {
        if (tripleSelector.subject !== null &&  tripleSelector.predicate !== null && tripleSelector.object !== null) {
            const snappedTriple = JSON.stringify(tripleSelector);
    
            if (JSON.stringify(tripleSelector) === snappedTriple) {
                request.json({
                    url: apiEndpoint + '/databases/graphs/triples/verify',
                    params: {triple: JSON.stringify([tripleSelector.subject.entity, tripleSelector.predicate.entity, tripleSelector.object.entity])}
                }).then(data => {
                    if (isComponentMounted) {
                        if (JSON.stringify(tripleSelector) === snappedTriple) {
                            setVerifyState({isVerifying: false, result: data.result, detail: data.detail, code: data.code});
                        }
                    }
                });
            }
    
            setVerifyState({isVerifying: true, result: null, detail: null, code: null});
        }
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
                                    <div>{editingState.triple[element].label}</div>
                                    <div>{editingState.triple[element].entity}</div>
                                </div>
                            ))}
                        </div>
                    : ''}
                    <div className={classes.list.triple}>
                        {['subject', 'predicate', 'object'].map(element => (
                            <div className={classes.list.tripleItem} key={element}>
                                <Entity 
                                    onClick={event => handleEntityClick(event, element)} 
                                    status={verifyState.code}
                                    value={tripleSelector[element]}
                                />
                                {tripleSelector[element] ?
                                    <div className={clsx({[classes.form.entityEmptyLabel]: tripleSelector[element] === null})}>
                                        {tripleSelector[element].entity}
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
                                    <button className={clsx([classes.form.block, classes.form.button, classes.form.blue])} onClick={handleEditButtonClick}>Edit</button>
                                :
                                    <button className={clsx([classes.form.block, classes.form.button, classes.form.blue])} onClick={handleAddButtonClick}>Add</button>
                            : verifyState.code === 'triple_already_exists' ?
                                !editingState.isEditing ?
                                    <React.Fragment>
                                        <button className={clsx([classes.form.block, classes.form.button, classes.form.orange])} onClick={handleEditButtonClick}>Edit</button>
                                        <button className={clsx([classes.form.block, classes.form.button, classes.form.red])} onClick={handleDeleteButtonClick}>Delete</button>
                                    </React.Fragment>
                                : ''
                            : ''}
                            <button className={clsx([classes.form.block, classes.form.button])} onClick={handleCancelButtonClick} onClick={handleCancelButtonClick}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            {Boolean(entitySelector) ?
                <EntitySearchPopover
                    selector={entitySelector}
                    onSelect={handleEntitySelect}
                    onClose={handleEntityClose}
                />
            : '' }
        </React.Fragment>
    );
}

const Entity = props => {
    const classes = getStyles(styles.form);
    const {
        value,
        status,
        onClick
    } = props;

    const handleButtonClick = event => {
        onClick(event, value);
    }

    return (
        <button 
            className={clsx(
                [classes.block, classes.select], 
                {
                    [classes.blue]: value !== null && (status === null || status === 'triple_verification_pass'),
                    [classes.green]: status === 'triple_verification_pass',
                    [classes.orange]: status === 'triple_already_exists',
                    [classes.red]: status === 'domain_range_fail'
                }
            )} 
            onClick={handleButtonClick}
        >
            {value === null ? 
                <span style={{paddingLeft: 10, paddingRight: 10}}>...</span>
            :
                value.label !== null ?
                    <span>{value.label}</span>
                :
                    <span>{value.entity}</span>
            }
            <KeyboardArrowDownIcon style={{fontSize: '1em'}} />
        </button>
    );
}

const CommitModal = props => {
    const modalClasses = getStyles(globalStyles.modal);
    const [numCommited, setNumCommited] = React.useState(null);
    const { 
        fetch,
        isCommitModalOpen,
        handleCommitModalClose
    } = props;

    const handleCommitClick = () => {
        request.json({
            url: apiEndpoint + '/databases/mods/triples/commit',
            method: 'PATCH'
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

export default withSnackbar(Mods);
