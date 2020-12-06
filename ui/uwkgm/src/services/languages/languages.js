import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import LanguageIcon from '@material-ui/icons/Language';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { update } from './languages.action';

export const defaultLanguage = 'en';
export const initLanguage = window.localStorage.getItem('language') || defaultLanguage;

export function localize(selector, text) {
    const out = text[selector(state => state.languageReducer.language)];
    return out instanceof Object ? out() : out;
}

export const makeLocalizer = selector => {
    return text => {
        return text[selector(state => state.languageReducer.language)];
    };;
}

export const Language = props => {
    const { language } = useSelector(state => ({language: state.languageReducer.language}));
    const out = props.text[(language in props.text) ? language : defaultLanguage];
    return out instanceof Object ? out() : out;
};

export const LanguageSelector = props => {
    const dispatch = useDispatch();
    const { className } = props;
    const { language } = useSelector(state => ({language: state.languageReducer.language}));
    const [ languageAnchor, setLanguageAnchor ] = React.useState(null);
    const [ languageAbbr, setLanguageAbbr ] = React.useState(language.toUpperCase());

    const handleLanguageButtonClick = event => {
        setLanguageAnchor(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setLanguageAnchor(null);
    };

    const handleLanguageUpdate = language => {
        window.localStorage.setItem('language', language);
        dispatch(update(language));
        setLanguageAbbr(language.toUpperCase());
        handleLanguageMenuClose();
    }
    
    return (
        <React.Fragment>
            <Button
                className={className} 
                style={{fontWeight: 'bold'}}
                onClick={handleLanguageButtonClick}
            >
                <LanguageIcon className={className} style={{marginRight: 8}} /> {languageAbbr}
            </Button>
            <Menu
                anchorEl={languageAnchor}
                keepMounted
                open={Boolean(languageAnchor)}
                onClose={handleLanguageMenuClose}
            >
                <MenuItem onClick={() => handleLanguageUpdate('en')}>English</MenuItem>
                <MenuItem onClick={() => handleLanguageUpdate('jp')}>日本語</MenuItem>
            </Menu>
        </React.Fragment>
    );
}
