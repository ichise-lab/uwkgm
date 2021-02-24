import React from 'react';
import clsx from 'clsx';
import { connect } from "react-redux";

import CloudIcon from '@material-ui/icons/Cloud';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import LayersIcon from '@material-ui/icons/Layers';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import LinkIcon from '@material-ui/icons/Link';
import Popover from '@material-ui/core/Popover';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';

import PulseLoader from "react-spinners/PulseLoader";

import { apiEndpoint } from 'services/servers';
import { genLabelFromURI, owl, rdf, rdfs, xsd } from 'libs/rdf';
import { getActiveCatalog } from 'services/catalogs/catalogs';
import { getStyles } from 'styles/styles';
import { request } from 'services/http';
import { styles } from './search.css';

export const fetchSuggestions = (search, graph) => {
    var promise = new Promise((resolve, reject) => {
        request.json({
            url: apiEndpoint + '/databases/graphs/entities/candidates',
            params: {graph: graph, search: search},
            passError: true
        }).then(data => {
            var items = [];

            const assignSuggestions = matches => {
                matches.map(match => {
                    var types = [];
        
                    if (match.types.length > 0 && match.types[0].length > 0) {
                        match.types.map(type => {
                            const typed = genLabelFromURI(type);
            
                            if (typed.length > 1) {
                                types.push(typed);
                            }

                            return null;
                        });
                    }
        
                    items.push({uri: match.uri, label: match.label, types: types});
                    return null;
                });
            };

            assignSuggestions(data.exact_matches);
            assignSuggestions(data.first_matches);
            assignSuggestions(data.partial_matches);

            resolve({search: search, items: items});
        })
        .catch(error => {
            reject({error: error})
        });
    });

    return promise;
}

export class BaseEntitySearch extends React.Component {
    isComponentMounted = false;
    defaultSuggestions = [];

    state = {
        search: '',
        suggestions: null,
        focusedId: null,
        selectedId: null,
        invalidSearch: null,
        isSearching: false
    }

    constructor(props) {
        super(props);

        const convertRDF = (original, type, uri) => {
            var processed = {};

            for(const [key, value] of Object.entries(original)) {
                processed[type + key.toLowerCase()] = {name: type + key, uri: uri + key, description: value};
            }

            return processed;
        };

        this.rdf = convertRDF(rdf, 'rdf:', 'https://www.w3.org/1999/02/22-rdf-syntax-ns#');
        this.rdfs = convertRDF(rdfs, 'rdfs:', 'https://www.w3.org/2000/01/rdf-schema#');
        this.owl = convertRDF(owl, 'owl:', 'https://www.w3.org/2002/07/owl');
        this.xsd = {};

        for(let i = 0; i < xsd.length; i++) {
            for(const [key, value] of Object.entries(xsd[i].items)) {
                this.xsd['xsd:' + key] = {name: 'xsd:' + key, uri: 'http://www.w3.org/2001/XMLSchema#' + key, description: value};
            }
        }
    }

    handleInputChange = event => {
        const search = event.target.value;
        const target = event.target;

        const searchRDF = (term, dict) => {
            var filtered = [];

            for(const [key, item] of Object.entries(dict)) {
                if (key.includes(term.toLowerCase())) {
                    filtered.push({label: item.name, uri: item.uri, icon: 'code', description: item.description});
                }
            }

            return filtered;
        };

        this.setState(() => ({
            search: search,
            invalidSearch: null
        }), () => {
            if (search.length > 1) {
                if (search.startsWith('rdf:') || search.startsWith('rdfs:') || search.startsWith('owl:') || search.startsWith('xsd:')) {
                    var suggestions = [];

                    if (search.startsWith('rdf:')) { suggestions = searchRDF(search, this.rdf); }
                    if (search.startsWith('rdfs:')) { suggestions = searchRDF(search, this.rdfs); }
                    if (search.startsWith('owl:')) { suggestions = searchRDF(search, this.owl); }
                    if (search.startsWith('xsd:')) { suggestions = searchRDF(search, this.xsd); }

                    this.setState(() => ({
                        suggestions: suggestions,
                        focusedId: null,
                        selectedId: null,
                        isSearching: false
                    }));
                } else {
                    setTimeout(() => {
                        if (this.isComponentMounted && search === this.state.search) {
                            this.setState(() => ({isSearching: true}), () => {
                                fetchSuggestions(search, getActiveCatalog(this.props.reducers.catalogs).uri).then(data => {
                                    if (this.isComponentMounted && target.value === data.search) {
                                        if (data.items.length) {
                                            var items = [];

                                            for(let i = 0; i < data.items.length; i++) {
                                                items.push({icon: 'cloud', description: 'Entity in the graph', ...data.items[i]});
                                            }

                                            this.setState(() => ({
                                                suggestions: items,
                                                focusedId: null,
                                                selectedId: null,
                                                isSearching: false
                                            }));
                                        } else if (search.startsWith('http://') || search.startsWith('https://')) {
                                            this.setState(() => ({
                                                suggestions: [],
                                                focusedId: null,
                                                selectedId: null,
                                                isSearching: false
                                            }));
                                        } else {
                                            this.setState(() => ({
                                                suggestions: this.defaultSuggestions,
                                                focusedId: null,
                                                selectedId: null,
                                                isSearching: false
                                            }));
                                        }
                                    }
                                })
                                .catch(error => {
                                    this.setState(() => ({invalidSearch: error, isSearching: false}));
                                });
                            });
                        }
                    }, 500);
                }
            } else {
                this.setState(() => ({
                    suggestions: this.defaultSuggestions,
                    focusedId: null,
                    selectedId: null,
                    isSearching: false
                }));
            }
        });
    }

    handleInputKeyDown = event => {
        if (event.key === 'ArrowDown' || event.keyCode === 40) {
            if (this.state.focusedId === null && this.state.suggestions.length > 0) {
                if (this.state.suggestions[0].section && this.state.suggestions.length > 1) {
                    this.setState(() => ({focusedId: 1}));
                } else {
                    this.setState(() => ({focusedId: 0}));
                }
            } else if (this.state.focusedId !== null && this.state.focusedId < this.state.suggestions.length - 1) {
                if (this.state.suggestions[this.state.focusedId + 1].section && this.state.focusedId < this.state.suggestions.length - 2) {
                    this.setState(() => ({focusedId: this.state.focusedId + 2}));
                } else {
                    this.setState(() => ({focusedId: this.state.focusedId + 1}));
                }
            }
        } else if (event.key === 'ArrowUp' || event.keyCode === 38) {
            if (this.state.focusedId !== null && this.state.focusedId > 0) {
                if (this.state.focusedId > 1 && this.state.suggestions[this.state.focusedId - 1].section) {
                    this.setState(() => ({focusedId: this.state.focusedId - 2}));
                } else if (this.state.focusedId > 1 || typeof(this.state.suggestions[0].section) === 'undefined') {
                    this.setState(() => ({focusedId: this.state.focusedId - 1}));
                }
            }
        } else if (event.key === 'Enter' || event.keyCode === 13) {
            if (this.state.focusedId !== null) {
                this.handleSelect(this.state.focusedId);
            }
        }
    }

    handleSuggestionClick = suggestionId => {
        this.handleSelect(suggestionId);
    }

    handleSuggestionMouseOver = suggestionId => {
        this.setState(() => ({focusedId: suggestionId})) ;
    }

    handleSelect = (suggestionId, callback=null) => {
        if (typeof(this.state.suggestions[suggestionId]) !== 'undefined') {
            const suggestion = this.state.suggestions[suggestionId];

            if ('onSelect' in this.props) { 
                this.props.onSelect(suggestion); 
            }
            
            this.setState(() => ({
                selectedId: suggestionId,
                search: suggestion.label
            }), () => {
                if (callback !== null) {
                    callback();
                }
            });

            this.handleClose();
        }
    }

    handleClose = () => {
        if ('onClose' in this.props) { 
            this.props.onClose();
        }
    }

    componentDidMount() {
        this.isComponentMounted = true;
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }
}

export const EntitySearchSuggestions = props => {
    const classes = getStyles(styles.suggestions);
    const {
        search,
        suggestions,
        focusedId,
        onSuggestionClick,
        onSuggestionMouseOver
    } = props;

    const groupTypes = types => {
        var filteredTypes = [];

        for (let i = 0; i < types.length; i++) {
            if (!filteredTypes.includes(types[i])) {
                filteredTypes.push(types[i]);
            }
        }

        return filteredTypes;
    }

    return (
        suggestions !== null ?
            <div className={classes.container}>
                {suggestions.length ?
                    suggestions.map((suggestion, suggestionId) => (
                        suggestion.section ?
                            <div key={suggestionId} className={classes.block}>
                                <div className={classes.detail}>
                                    <div className={clsx([classes.title, classes.sectionTitle])}>
                                        {suggestion.section}
                                    </div>
                                </div>
                            </div>
                        :
                            <div 
                                key={suggestionId} 
                                className={clsx([classes.block], {[classes.selected]: focusedId === suggestionId})}
                                onClick={() => onSuggestionClick(suggestionId)}
                                onMouseOver={() => onSuggestionMouseOver(suggestionId)}
                            >
                                <div className={classes.detail}>
                                    <div className={classes.title}>
                                        {suggestion.label}
                                    </div>
                                    <div className={classes.uri}>
                                        {suggestion.uri}
                                    </div>
                                    {suggestion.types && suggestion.types !== null && suggestion.types.length ?
                                        <div className={classes.typeContainer}>
                                            {groupTypes(suggestion.types).map((type, typeId) => (
                                                <div key={typeId}>{type}</div>
                                            ))}
                                        </div>
                                    : ''}
                                </div>
                                {suggestion.icon ?
                                    <div className={classes.icon}>
                                        <Tooltip title={suggestion.description} arrow>
                                            {suggestion.icon === 'layers' ?
                                                <LayersIcon className={clsx({[classes.selectedFont]: focusedId === suggestionId})} />
                                            : suggestion.icon === 'cloud' ?
                                                <CloudIcon className={clsx({[classes.selectedFont]: focusedId === suggestionId})} />
                                            : suggestion.icon === 'code' ?
                                                <DeveloperBoardIcon className={clsx({[classes.selectedFont]: focusedId === suggestionId})} />
                                            : suggestion.icon === 'link' ?
                                                <LinkIcon className={clsx({[classes.selectedFont]: focusedId === suggestionId})} />
                                            : suggestion.icon === 'text' ?
                                                <TextFieldsIcon className={clsx({[classes.selectedFont]: focusedId === suggestionId})} />
                                            : ''}
                                        </Tooltip>
                                    </div>
                                : ''}
                            </div>
                    ))
                : search != null && (search.startsWith('http://') || search.startsWith('https://')) ?
                    <div 
                        className={clsx([classes.block], {[classes.selected]: focusedId === 0})}
                        onClick={() => onSuggestionClick(null)}
                        onMouseOver={() => onSuggestionMouseOver(0)}
                        onMouseLeave={() => onSuggestionMouseOver(null)}
                    >
                        <div className={classes.detail}>
                            <div className={classes.title}>
                                Add New Entity
                            </div>
                            <div className={classes.uri}>
                                {search}
                            </div>
                        </div>
                        <div className={classes.icon}>
                            <LibraryAddIcon className={clsx({[classes.selectedFont]: focusedId === 0})} />
                        </div>
                    </div>
                : ''}
            </div>
        : ''
    );
}

export class EntitiSearchPopoverClass extends BaseEntitySearch {
    handleSelect = suggestionId => {
        if (this.state.suggestions.length) {
            if ('onSelect' in this.props) { this.props.onSelect(this.state.suggestions[suggestionId]); }
            if ('onSelect' in this.props.selector) { this.props.selector.onSelect(this.state.suggestions[suggestionId]); }
        } else {
            this.props.onSelect({uri: this.state.search, label: '-- New Entity --', new: true});
        }
        this.handleClose();
    }

    componentDidMount() {
        this.isComponentMounted = true;

        if (this.props.selector) {
            if (this.props.selector.target === 'predicate') {
                const catalog = getActiveCatalog(this.props.reducers.catalogs);
                const labels = catalog.predicates.labels;
                const types = catalog.predicates.types;
                const description = "Catalog-specific configuration";
                
                this.defaultSuggestions.push({section: 'Label'});
                
                for(let i = 0; i < labels.length; i++) {
                    this.defaultSuggestions.push({label: labels[i].name, uri: labels[i].uri, icon: 'layers', description: description});
                }

                this.defaultSuggestions.push({section: 'Type'});

                for(let i = 0; i < types.length; i++) {
                    this.defaultSuggestions.push({label: types[i].name, uri: types[i].uri, icon: 'layers', description: description});
                }

                this.setState(() => ({suggestions: this.defaultSuggestions}));

            } else if (this.props.selector.target === 'object') {
                this.defaultSuggestions.push({section: 'RDF'});
                this.defaultSuggestions.push({label: 'rdf:PlainLiteral', uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral', icon: 'code', description: 'The class of plain (i.e. untyped) literal values, as used in RIF and OWL 2' });

                for(let i = 0; i < xsd.length; i++) {
                    this.defaultSuggestions.push({section: xsd[i].section});

                    for(const [key, value] of Object.entries(xsd[i].items)) {
                        this.defaultSuggestions.push({label: 'xsd:' + key, uri: 'http://www.w3.org/2001/XMLSchema#' + key, icon: 'code', description: value});
                    }
                }

                this.setState(() => ({suggestions: this.defaultSuggestions}));
            }
        }
    }

    render() {
        return (
            <EntitySearchPopoverFunc
                search={this.state.search}
                selector={this.props.selector}
                suggestions={this.state.suggestions}
                focusedId={this.state.focusedId}
                isSearching={this.state.isSearching}
                onInputChange={this.handleInputChange}
                onInputKeyDown={this.handleInputKeyDown}
                onSuggestionClick={this.handleSuggestionClick}
                onSuggestionMouseOver={this.handleSuggestionMouseOver}
                onSelect={this.handleSelect}
                onClose={this.handleClose}
            />
        );
    }
}

export const EntitySearchPopoverFunc = props => {
    const classes = getStyles(styles.popover);
    const theme = useTheme();

    const {
        search,
        selector,
        suggestions,
        focusedId,
        isSearching,
        onInputChange,
        onInputKeyDown,
        onSuggestionClick,
        onSuggestionMouseOver,
        onClose
    } = props;

    return (
        <Popover
            anchorEl={Boolean(selector) ? selector.element : null}
            open={Boolean(selector)}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
         >
            <div className={classes.editor}>
                <input
                    type="text" 
                    className={classes.textInput} 
                    placeholder="URI/Label" 
                    onChange={onInputChange} 
                    onKeyDown={onInputKeyDown}
                    autoComplete="off"
                    spellCheck="false"
                    autoFocus 
                />
                <div className={clsx([classes.loaderBlock], {[classes.loaderBlockVisible]: isSearching})}>
                    <PulseLoader 
                        color={theme.palette.text.primary}
                        size={10}
                    />
                </div>
                <EntitySearchSuggestions 
                    search={search}
                    suggestions={suggestions}
                    focusedId={focusedId}
                    onSuggestionClick={onSuggestionClick}
                    onSuggestionMouseOver={onSuggestionMouseOver}
                />
            </div>
        </Popover>
    );
}

const mapStateToProps = state => {
    return {
        reducers: {
            catalogs: state.catalogReducer
        }
    };
}

export const EntitySearchPopover = connect(mapStateToProps)(EntitiSearchPopoverClass);
