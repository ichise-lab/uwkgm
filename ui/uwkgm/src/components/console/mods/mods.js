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
import { useTheme } from '@material-ui/core/styles';

import PuffLoader from "react-spinners/PuffLoader";
import Modal from 'react-bootstrap/Modal'
import BoostrapButton from 'react-bootstrap/Button';

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

export default class Mods extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeScreen: 'triples',
            isAddingMod: false,
            triples: []
        };

        this.isComponentMounted = false;
    }

    handleAddModClick = () => {
        this.setState(() => ({isAddingMod: !this.state.isAddingMod}))
    }

    fetch = async () => {
        request.json({
            url: apiEndpoint + '/databases/docs/triples/find'
        }).then(data => {
            if (this.isComponentMounted) {
                this.setState(() => ({triples: data}));
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
                onAddModClick={this.handleAddModClick}
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
        isComponentMounted ,
        onAddModClick,
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
                    onAddModClick={onAddModClick}
                    fetch={fetch}
                />
            </div>
            <Tools 
                onAddModClick={onAddModClick}
                onReloadClick={fetch}
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
        onAddModClick,
        fetch
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
                    <NewItem 
                        isComponentMounted={isComponentMounted}
                        onAddModClick={onAddModClick}
                        fetch={fetch}
                    />
                : ''}
                {triples.map((triple, index) => (
                    <Item 
                        triple={triple} 
                        key={index}
                    />
                ))}
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
    const { triple } = props;

    return (
        <div className={classes.list.item}>
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
                            <React.Fragment>
                                <IconButton size="small">
                                    <CheckIcon />
                                </IconButton>
                            </React.Fragment>
                        : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}

const NewItem = props => {
    const classes = getStyles(styles);
    const [tripleSelector, setTripleSelector] = React.useState({subject: null, predicate: null, object: null});
    const [entitySelector, setEntitySelector] = React.useState(null);
    const [editingState, setEditingState] = React.useState({isEditing: false, triple: null});
    const [verifyState, setVerifyState] = React.useState({isVerifying: null, result: null, detail: null, code: null});
    const { isComponentMounted, onAddModClick, fetch } = props;
    
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
            url: apiEndpoint + '/databases/docs/triples/add',
            method: 'POST',
            body: {
                triple: tripleSelector
            }
        }).then(data => {
            onAddModClick();
            fetch();
        });
    }

    const handleEditButtonClick = () => {
        if (editingState.isEditing) {
            request.json({
                url: apiEndpoint + '/databases/docs/triples/edit',
                method: 'PATCH',
                body: {
                    triple: tripleSelector,
                    original_triple: editingState.triple
                }
            }).then(data => {
                onAddModClick();
                fetch();
            });
        } else {
            setEditingState({isEditing: true, triple: {subject: tripleSelector.subject, predicate: tripleSelector.predicate, object: tripleSelector.object}});
        }
    }

    const handleDeleteButtonClick = () => {
        request.json({
            url: apiEndpoint + '/databases/docs/triples/delete',
            method: 'POST',
            body: {
                triple: tripleSelector
            }
        }).then(data => {
            onAddModClick();
            fetch();
        });
    }

    const handleCancelButtonClick = () => {
        if (editingState.isEditing) {
            setEditingState({isEditing: false, triple: null});
        } else {
            onAddModClick();
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
            <div className={clsx([classes.list.item, classes.newItem.container])}>
                <div>
                    <div className={classes.list.itemHead}>
                        {editingState.isEditing ?
                            <React.Fragment>
                                <div><EditIcon className={classes.mods.editingIcon} /></div>
                                <div><Language text={content.edit} /></div>
                            </React.Fragment>
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
                                <div>
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
                    [classes.orange]: status === 'triple_already_exists'
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
            url: apiEndpoint + '/databases/docs/triples/commit',
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