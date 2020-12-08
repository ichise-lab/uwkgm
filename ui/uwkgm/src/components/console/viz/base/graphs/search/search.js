import React from 'react';
import { connect } from "react-redux";

import AddCircleIcon from '@material-ui/icons/AddCircle';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useTheme } from '@material-ui/core/styles';

import { BaseEntitySearch, EntitySearchSuggestions } from 'services/entities/search/search';
import { content } from './search.content';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { styles, CustomTextField } from './search.css';

export class EntitySearchClass extends BaseEntitySearch {
    findSearchInSuggestions = () => {
        var activeIndex = null;

        if (this.state.suggestions !== null) {
            this.state.suggestions.map((suggestion, index) => {
                if (this.state.search === suggestion.label) {
                    activeIndex = index;
                }
                return null;
            });
        }

        return activeIndex;
    }

    handleAddClick = () => {
        const suggestion = this.state.suggestions[this.state.selectedId];
        if (typeof suggestion !== 'undefined' && typeof suggestion.label !== 'undefined') {
            this.props.onAddNode({label: suggestion.label, entity: suggestion.entity, types: suggestion.types});
            this.setState(() => ({
                search: '',
                suggestions: null,
                focusedId: null,
                selectedId: null
            }));
        }
    }

    handleSuggestionClick = suggestionId => {
        this.handleSelect(suggestionId, this.handleAddClick);
    }

    render() {
        return (
            <EntitySearchFunc
                search={this.state.search}
                focusedId={this.state.focusedId}
                suggestions={this.state.suggestions}
                suggestionsVisible={this.state.suggestionsVisible}
                findSearchInSuggestions={this.findSearchInSuggestions}
                invalidSearch={this.state.invalidSearch}
                onAddClick={this.handleAddClick}
                onInputClick={this.handleInputClick}
                onInputChange={this.handleInputChange}
                onInputKeyDown={this.handleInputKeyDown}
                onSuggestionClick={this.handleSuggestionClick}
                onSuggestionMouseOver={this.handleSuggestionMouseOver}
                onClose={this.handleClose}
            />
        );
    }
}

const EntitySearchFunc = props => {
    const theme = useTheme();
    const classes = getStyles(styles);
    const {
        search,
        focusedId,
        suggestions,
        suggestionsVisible,
        findSearchInSuggestions,
        invalidSearch,
        onAddClick,
        onInputClick,
        onInputChange,
        onInputKeyDown,
        onSuggestionClick,
        onSuggestionMouseOver,
        onClose
    } = props;

    return (
        <div className={classes.flex.container}>
            <div className={classes.flex.content} />
            <div className={classes.flex.content}>
                <div className={classes.search.inputBlock}>
                    <ClickAwayListener onClickAway={onClose}>
                        <FormControl className={classes.search.form}>
                            <CustomTextField 
                                label={<Language text={content.addEntity} />}
                                value={search}
                                variant="outlined" 
                                onClick={onInputClick}
                                onChange={onInputChange}
                                onKeyDown={onInputKeyDown}
                                className={classes.search.input}
                                style={{backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.default}}
                                InputProps={{
                                    endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            disabled={(findSearchInSuggestions() === null) ? true: false}
                                            onClick={onAddClick}
                                        >
                                            <AddCircleIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }}
                                autoFocus
                            />
                            <InvalidSearchNotifier 
                                invalidSearch={invalidSearch}
                            />
                            <EntitySearchSuggestions 
                                suggestions={suggestions}
                                focusedId={focusedId}
                                suggestionsVisible={suggestionsVisible}
                                onSuggestionClick={onSuggestionClick}
                                onSuggestionMouseOver={onSuggestionMouseOver}
                            />
                        </FormControl>
                    </ClickAwayListener>
                </div>
            </div>
            <div className={classes.flex.content} />
        </div>
    );
}

const InvalidSearchNotifier = props => {
    const classes = getStyles(styles.invalid);
    const { invalidSearch } = props;

    return (
        invalidSearch !== null ?
            <div className={classes.container}>
                <div className={classes.triangle}></div>
                <div className={classes.block}>
                    Invalid search terms
                </div>
            </div>
        : ''
    );
}

const mapStateToProps = state => {
    return {
        reducers: {
            catalogs: state.catalogReducer
        }
    };
}

export const EntitySearch = connect(mapStateToProps)(EntitySearchClass);
