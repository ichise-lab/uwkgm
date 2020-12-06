import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useTheme } from '@material-ui/core/styles';

import { getStyles } from 'styles/styles';
import { updateCatalog } from 'services/catalogs/catalogs.action';
import { getGraphURIfromName } from 'services/catalogs/catalogs';
import { Language } from 'services/languages/languages';
import { apiEndpoint } from 'services/servers';
import { request } from 'services/http';
import { content } from './search.content';
import { 
    styles,
    CustomTextField,
    SuggestionBlock,
    Suggestion,
    SuggestionTitle,
    SuggestionEntity,
    SuggestionTypeBlock,
    SuggestionType,
} from './search.css';

export class SearchClass extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            selected: -1,
            suggestions: [],
            suggestionsVisible: false
        }
    }

    fetchSuggestions = search => {
        const graph = getGraphURIfromName(this.props.reducers.catalogs.graph);
        // const graph = 'http://jpcovid19.uwkgm.com';

        request.json({
            url: apiEndpoint + '/cui/graphs/entities/candidates',
            params: {graph: graph, search: search}
        }).then(data => {
            var suggestions = [];

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
    
                    suggestions.push({entity: match.entity, label: match.label, types: types});
                    return null;
                });
            };

            if (this.state.search === search) {
                assignSuggestions(data.exact_matches);
                assignSuggestions(data.first_matches);
                assignSuggestions(data.partial_matches);

                this.setState(() => ({
                    suggestions: suggestions,
                    suggestionsVisible: true
                }));
            }
        });
    }

    findSearchInSuggestions = () => {
        var activeIndex = null;

        this.state.suggestions.map((suggestion, index) => {
            if (this.state.search === suggestion.label) {
                activeIndex = index;
            }
            return null;
        });

        return activeIndex;
    }

    handleAddNode = () => {
        const suggesion = this.state.suggestions[this.state.selected];
        this.props.handleAddNode({label: suggesion.label, entity: suggesion.entity, types: suggesion.types});
        this.setState(() => ({
            search: '',
            selected: -1,
            suggestions: []
        }));
    }

    handleInputClick = () => {
        this.setState(() => ({suggestionsVisible: true}));
        // this.props.setSearchFocus(true);
    }

    handleAddClick = event => {
        this.handleAddNode();
    }

    handleInputChange = event => {
        const search = event.target.value;

        if (search.length > 1) {
            this.fetchSuggestions(event.target.value);
        } else {
            this.setState(() => ({
                selected: -1,
                suggestions: [],
                suggestionsVisible: false
            }));
        }

        this.setState(() => ({search: search}));
        // this.props.findNode(search);
    }

    handleInputKeyDown = event => {
        if (event.key === 'ArrowDown' || event.keyCode === 40) {
            if (this.state.selected < this.state.suggestions.length - 1) {
                this.setState(() => (
                    {
                        search: this.state.suggestions[this.state.selected + 1].label,
                        selected: this.state.selected + 1
                    }
                ));
            }
        } else if (event.key === 'ArrowUp' || event.keyCode === 38) {
            if (this.state.selected > 0) {
                this.setState(() => (
                    {
                        search: this.state.suggestions[this.state.selected - 1].label,
                        selected: this.state.selected - 1
                    }
                ));
            }
        } else if (event.key === 'Enter' || event.keyCode === 13) {
            if (this.findSearchInSuggestions()) {
                this.setState(() => ({
                    suggestionsVisible: false
                }));
            }
        }
    }

    handleSuggestionClick = index => {
        this.setState(() => ({
            search: this.state.suggestions[index].label,
            suggestionsVisible: false
        }));
    }

    handleSuggestionMoseOver = index => {
        this.setState(() => ({selected: index}));
    }

    handleClickAway = () => {
        this.setState(() => ({suggestionsVisible: false}));
        // this.props.setSearchFocus(false);
    }

    componentDidMount() {
        // this.props.setSearchFocus(true);
    }

    render() {
        return (
            <SearchFunc 
                search={this.state.search}
                selected={this.state.selected}
                suggestions={this.state.suggestions}
                suggestionsVisible={this.state.suggestionsVisible}
                handleAddClick={this.handleAddClick}
                handleInputClick={this.handleInputClick}
                handleInputChange={this.handleInputChange}
                handleInputKeyDown={this.handleInputKeyDown}
                handleSuggestionClick={this.handleSuggestionClick}
                handleSuggestionMoseOver={this.handleSuggestionMoseOver}
                handleClickAway={this.handleClickAway}
                findSearchInSuggestions={this.findSearchInSuggestions}
            />
        );
    }
}

const SearchFunc = (props) => {
    const theme = useTheme();
    const classes = getStyles(styles);
    const {
        search,
        selected,
        suggestions,
        suggestionsVisible,
        handleAddClick,
        handleInputClick,
        handleInputChange,
        handleInputKeyDown,
        handleSuggestionClick,
        handleSuggestionMoseOver,
        handleClickAway,
        findSearchInSuggestions
    } = props;

    return (
        <div className={classes.flex.container}>
            <div className={classes.flex.content} />
            <div className={classes.flex.content}>
                <div className={classes.search.inputBlock}>
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <FormControl className={classes.search.form}>
                            <CustomTextField 
                                label={<Language text={content.addEntity} />}
                                value={search}
                                variant="outlined" 
                                onClick={handleInputClick}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                className={classes.search.input}
                                style={{backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.background.default}}
                                InputProps={{
                                    endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            disabled={(findSearchInSuggestions() === null) ? true: false}
                                            onClick={handleAddClick}
                                        >
                                            <AddCircleIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }}
                                autoFocus
                            />
                            {(suggestions.length > 0 && suggestionsVisible === true) ?
                                <SuggestionBlock>
                                    {suggestions.map((suggestion, suggestionIndex) => (
                                        <Suggestion 
                                            key={suggestionIndex}
                                            className={(selected === suggestionIndex) ? classes.suggestion.selected : {}}
                                            onClick={event => {handleSuggestionClick(suggestionIndex)}}
                                            onMouseOver={event => {handleSuggestionMoseOver(suggestionIndex)}}
                                        >
                                            <SuggestionTitle
                                                className={(selected === suggestionIndex) ? classes.suggestion.selectedTitle : {}}
                                            >
                                                {suggestion.label}
                                            </SuggestionTitle>
                                            <SuggestionEntity
                                                className={(selected === suggestionIndex) ? classes.suggestion.selectedEntity : {}}
                                            >
                                                {suggestion.entity}
                                            </SuggestionEntity>
                                            <SuggestionTypeBlock>
                                                {suggestion.types.map((type, typeIndex) => (
                                                    <SuggestionType 
                                                        key={typeIndex}
                                                        className={(selected === suggestionIndex) ? classes.suggestion.selectedType : {}}
                                                    >
                                                        {type}
                                                    </SuggestionType>
                                                ))}
                                            </SuggestionTypeBlock>
                                        </Suggestion>
                                    ))}
                                </SuggestionBlock>
                            : '' }
                        </FormControl>
                    </ClickAwayListener>
                </div>
            </div>
            <div className={classes.flex.content}>
            </div>
        </div>
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
            catalog: {
                update: bindActionCreators(updateCatalog, dispatch),
            }
        }
    }
}

export const Search = connect(mapStateToProps, mapDispatchToProps)(SearchClass);
