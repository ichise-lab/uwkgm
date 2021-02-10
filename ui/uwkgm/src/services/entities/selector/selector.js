import React from 'react';
import clsx from 'clsx';

import BackspaceIcon from '@material-ui/icons/Backspace';
import TranslateIcon from '@material-ui/icons/Translate';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';

import { EntitySearchSuggestions } from 'services/entities/search/search';
import { getStyles } from 'styles/styles';
import { iso_639_1 } from 'libs/languages';
import { styles } from './selector.css';
import { styles as formStyles } from 'components/templates/forms/forms.css';
import { styles as searchStyles } from 'services/entities/search/search.css';

export const EntitySelector = props => {
    const formClasses = getStyles(formStyles.form);
    const {
        element,
        status,
        onClick
    } = props;

    const handleButtonClick = event => {
        onClick(event, element);
    }

    return (
        <React.Fragment>
            <button 
                className={clsx(
                    [formClasses.block, formClasses.select], 
                    {
                        [formClasses.blue]: element.entity.uri !== null && (typeof(status) === 'undefined' || status === null),
                        [formClasses.green]: status === 'pass',
                        [formClasses.orange]: status === 'warn',
                        [formClasses.red]: status === 'error'
                    }
                )} 
                onClick={handleButtonClick}
            >
                {element.entity.uri === null ? 
                    <span style={{paddingLeft: 10, paddingRight: 10}}>...</span>
                :
                element.entity.label !== null ?
                        <span>{element.entity.label}</span>
                    :
                        <span>{element.entity.uri}</span>
                }
                <KeyboardArrowDownIcon style={{fontSize: '1em'}} />
            </button>
        </React.Fragment>
    );
}

export const EntitySelectorMenu = props => {
    const classes = getStyles(searchStyles.popover);
    const [search, setSearch] = React.useState('');
    const [filteredChoices, setFilteredChoices] = React.useState(null);
    const [focusedId, setFocusedId] = React.useState(null);
    const {
        selector,
        choices,
        onSelect,
        onClose
    } = props;

    const handleInputChange = event => {
        const text = event.currentTarget.value.toLowerCase();
        var filtered = [];

        if (text.length) {
            for (let i = 0; i < choices.length; i++) {
                if (('uri' in choices[i] && choices[i].uri.toLowerCase().includes(text)) || 
                    ('label' in choices[i] && choices[i].label.toLowerCase().includes(text))) {
                    filtered.push(choices[i]);
                }
            }
        }

        setSearch(event.currentTarget.value);
        setFilteredChoices(filtered);
    }

    const handleInputKeyDown = event => {

    }

    const handleSuggestionMouseOver = id => {
        setFocusedId(id);
    }

    const handleSuggestionClick = id => {
        onSelect(search.length ? filteredChoices[id] : choices[id]);
    }

    return (
        <Popover 
            anchorEl={selector}
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
                    value={search}
                    className={classes.textInput} 
                    placeholder="URI/Label" 
                    onChange={handleInputChange} 
                    onKeyDown={handleInputKeyDown}
                    autoComplete="off"
                    spellCheck="false"
                    autoFocus 
                />
                <EntitySearchSuggestions 
                    suggestions={search.length ? filteredChoices : choices}
                    focusedId={focusedId}
                    onSuggestionClick={handleSuggestionClick}
                    onSuggestionMouseOver={handleSuggestionMouseOver}
                />
            </div>
        </Popover>
    );
}

export const LanguageSelector = props => {
    const classes = getStyles(styles);
    const formClasses = getStyles(formStyles.form);
    const [languageSelector, setLanguageSelector] = React.useState(null);
    const [languages, setLanguages] = React.useState(iso_639_1);

    const { 
        disabled,
        activeLanguage,
        onLanguageChange 
    } = props;

    const updateLanguageList = language => {
        if (language !== null && language.length) {
            var filteredLanguages = [];

            for(let i = 0; i < iso_639_1.length; i++) {
                if (iso_639_1[i][0].includes(language)) {
                    filteredLanguages.push(iso_639_1[i]);
                }
            }

            setLanguages(filteredLanguages);
        } else {
            setLanguages(iso_639_1);
        }
    }

    const handleInputChange = event => {
        const language = event.currentTarget.value.toLowerCase();
        onLanguageChange(language);
        updateLanguageList(language);
    }

    const handleLanguageClick = event => {
        setLanguageSelector(event.currentTarget);
    }

    const handleSLanguageClose = () => {
        setLanguageSelector(null);
    }

    const handleLanguageSelect = language => {
        setLanguageSelector(null);
        onLanguageChange(language);
        updateLanguageList(language);
    }

    const handleLanguageApply = () => {
        setLanguageSelector(null);

        if (typeof(onLanguageChange) !== 'undefined') {
            onLanguageChange(activeLanguage);
        }
    }

    return (
        <React.Fragment>
            <button
                className={clsx([formClasses.block, formClasses.select], {[formClasses.blue]: !disabled})}
                onClick={handleLanguageClick}
                disabled={disabled}
            >
                {activeLanguage === null || activeLanguage === '' ? '...' : activeLanguage}
                <KeyboardArrowDownIcon style={{fontSize: '1em'}} />
            </button>
            <Popover 
                anchorEl={languageSelector}
                open={Boolean(languageSelector)}
                onClose={handleSLanguageClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className={classes.languagePopover.editor}>
                    <input
                        type="text" 
                        value={activeLanguage || ''}
                        className={classes.languagePopover.textInput} 
                        placeholder="Language" 
                        onChange={handleInputChange}
                        autoFocus 
                    />
                    <div className={classes.languagePopover.addButtonBlock}>
                        <IconButton aria-label="select" size="small" onClick={handleLanguageApply}>
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </div>
                </div>
                <div className={classes.languagePopover.container}>
                    <Tooltip title="No language filter" arrow>
                        <div 
                            className={classes.languagePopover.block}
                            onClick={() => handleLanguageSelect(null)}
                        >
                            <div className={classes.languagePopover.text}>
                                <TranslateIcon size="small" />
                            </div>
                        </div>
                    </Tooltip>
                    <Tooltip title="No language tag only" arrow>
                        <div 
                            className={classes.languagePopover.block}
                            onClick={() => handleLanguageSelect('No tag')}
                        >
                            <div className={classes.languagePopover.text}>
                                <BackspaceIcon size="small" />
                            </div>
                        </div>
                    </Tooltip>
                    {languages.map((item, index) => (
                        <Tooltip key={index} title={item[1]} arrow>
                            <div 
                                className={classes.languagePopover.block}
                                onClick={() => handleLanguageSelect(item[0])}
                            >
                                <div className={classes.languagePopover.text}>
                                    <div>{item[0]}</div>
                                </div>
                            </div>
                        </Tooltip>
                    ))}
                </div>
            </Popover>
        </React.Fragment>
    );
}