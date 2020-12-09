import React from 'react';
import clsx from 'clsx';
import { connect } from "react-redux";

import CloudIcon from '@material-ui/icons/Cloud';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';

import PulseLoader from "react-spinners/PulseLoader";

import { apiEndpoint } from 'services/servers';
import { getGraphURIfromName } from 'services/catalogs/catalogs';
import { getStyles } from 'styles/styles';
import { request } from 'services/http';
import { styles } from './search.css';

export const fetchSuggestions = (search, graph) => {
    var promise = new Promise((resolve, reject) => {
        request.json({
            url: apiEndpoint + '/cui/graphs/entities/candidates',
            params: {graph: graph, search: search},
            passError: true
        }).then(data => {
            var items = [];

            const assignSuggestions = matches => {
                matches.map(match => {
                    var types = [];
        
                    if (match.types.length > 0 && match.types[0].length > 0) {
                        match.types.map(type => {
                            const urlSections = type.split('/');
                            const identifierSections = urlSections[urlSections.length - 1].split('#');
                            const typed = identifierSections[identifierSections.length - 1]
                                                .replace(/([0-9])/g, '')
                                                .replace(/([A-Z])/g, ' $1')
                                                .trim();
            
                            if (typed.length > 1) {
                                types.push(typed);
                            }

                            return null;
                        });
                    }
        
                    items.push({entity: match.entity, label: match.label, types: types});
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

    state = {
        search: '',
        suggestions: null,
        focusedId: null,
        selectedId: null,
        suggestionsVisible: true,
        invalidSearch: null,
        isSearching: false
    }

    handleInputClick = () => {
        this.setState(() => ({suggestionsVisible: true}));
    }

    handleInputChange = event => {
        const search = event.target.value;
        const target = event.target;

        this.setState(() => ({
            search: search,
            invalidSearch: null
        }), () => {
            if (search.length > 1) {
                setTimeout(() => {
                if (search == this.state.search) {
                this.setState(() => ({isSearching: true}), () => {
                    fetchSuggestions(search, getGraphURIfromName(this.props.reducers.catalogs.graph)).then(data => {
                        if (this.isComponentMounted && target.value === data.search) {
                            this.setState(() => ({
                                suggestions: data.items,
                                focusedId: null,
                                selectedId: null,
                                suggestionsVisible: true,
                                isSearching: false
                            }));
                        }
                    })
                    .catch(error => {
                        this.setState(() => ({invalidSearch: error, isSearching: false}));
                    });
                });
                }
                }, 500);
            } else {
                this.setState(() => ({suggestions: null}));
            }
        });
    }

    handleInputKeyDown = event => {
        if (event.key === 'ArrowDown' || event.keyCode === 40) {
            if (this.state.focusedId === null && this.state.suggestions.length > 0) {
                this.setState(() => ({focusedId: 0}));
            } else if (this.state.focusedId !== null && this.state.focusedId < this.state.suggestions.length - 1) {
                this.setState(() => ({focusedId: this.state.focusedId + 1}));
            }
        } else if (event.key === 'ArrowUp' || event.keyCode === 38) {
            if (this.state.focusedId !== null && this.state.focusedId > 0) {
                this.setState(() => ({focusedId: this.state.focusedId - 1}));
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

    handleClose = () => {
        if ('onClose' in this.props) { this.props.onClose(); }
        this.setState(() => ({suggestionsVisible: false}));
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
        suggestions,
        focusedId,
        suggestionsVisible,
        onSuggestionClick,
        onSuggestionMouseOver
    } = props;

    return (
        suggestionsVisible && Boolean(suggestions) && suggestions.length ?
            <div className={classes.container}>
                {suggestions.map((suggestion, suggestionId) => (
                    <div 
                        key={suggestionId} 
                        className={clsx({[classes.block]: true, [classes.selected]: focusedId === suggestionId})}
                        onClick={() => onSuggestionClick(suggestionId)}
                        onMouseOver={() => onSuggestionMouseOver(suggestionId)}
                    >
                        <div className={classes.detail}>
                            <div className={classes.title}>
                                {suggestion.label}
                            </div>
                            <div className={classes.entity}>
                                {suggestion.entity}
                            </div>
                            <div className={classes.typeContainer}>
                                {suggestion.types.map((type, typeId) => (
                                    <div key={typeId}>{type}</div>
                                ))}
                            </div>
                        </div>
                        <div className={classes.icon}>
                            <Tooltip title="Included in Displaying Graph" arrow>
                                <CloudIcon className={clsx({[classes.selectedFont]: focusedId === suggestionId})} />
                            </Tooltip>
                        </div>
                    </div>
                ))}
            </div>
        : ''
    );
}

export class EntitiSearchPopoverClass extends BaseEntitySearch {
    handleSelect = suggestionId => {
        if ('onSelect' in this.props) { this.props.onSelect(this.state.suggestions[suggestionId]); }
        if ('onSelect' in this.props.selector) { this.props.selector.onSelect(this.state.suggestions[suggestionId]); }
        this.handleClose();
    }

    render() {
        return (
            <EntitySearchPopoverFunc
                selector={this.props.selector}
                suggestions={this.state.suggestions}
                focusedId={this.state.focusedId}
                suggestionsVisible={this.state.suggestionsVisible}
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
        selector,
        suggestions,
        focusedId,
        suggestionsVisible,
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
                    placeholder="Entity/Label" 
                    onChange={onInputChange} 
                    onKeyDown={onInputKeyDown}
                    autoFocus 
                />
                <div className={clsx([classes.loaderBlock], {[classes.loaderBlockVisible]: isSearching})}>
                    <PulseLoader 
                        color={theme.palette.text.primary}
                        size={10}
                    />
                </div>
                <EntitySearchSuggestions 
                    suggestions={suggestions}
                    focusedId={focusedId}
                    suggestionsVisible={suggestionsVisible}
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
