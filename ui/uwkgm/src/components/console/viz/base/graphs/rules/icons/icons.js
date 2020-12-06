import React from 'react';
import { useSelector } from 'react-redux';

import classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { content } from './icons.content';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { makeLocalizer } from 'services/languages/languages';
import { materialIcons } from './icons.material';
import { styles } from './icons.css';

export default class IconPicker extends React.Component {
    state = {
        transition: null,
        initialized: false,
        search: ''
    }

    constructor(props) {
        super(props);

        this.searchBox = React.createRef();
    }

    handleSearchChange = event => {
        const newValue = event.target.value;
        this.setState(() => ({search: newValue}));
    }

    componentDidMount() {
        this.setState(() => ({transition: 'in'}));

        setTimeout(() => {
            this.setState(() => ({initialized: true}));
            this.searchBox.current.focus();
        }, 300);
    }

    render() {
        return (
            <IconPickerFunc 
                transition={this.state.transition}
                initialized={this.state.initialized}
                search={this.state.search}
                searchBox={this.searchBox}
                onSearchChange={this.handleSearchChange}
                onClose={this.props.onClose}
            />
        );
    }
}

const IconPickerFunc = props => {
    const classes = getStyles(styles.icons);
    const localize = makeLocalizer(useSelector);
    const { 
        transition,
        initialized,
        search,
        searchBox,
        onSearchChange,
        onClose
    } = props;

    return (
        <ClickAwayListener onClickAway={() => onClose(null)}>
            <div className={classNames(classes.outerContainer, transition === 'in' ? classes.outerContainerPulled : '')}>
                <div className={classes.innerContainer}>
                    <div className={classes.content}>
                        {initialized ? Object.keys(materialIcons).map((key, index) => {
                            const title = key.replace(/([0-9]+)/g, ' $1').replace(/([A-Z])/g, ' $1');

                            if (search.length === 0 || title.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
                                return (
                                    <div key={index} className={classes.iconBlock}>
                                        <div className={classes.iconButton} onClick={() => onClose(materialIcons[key])}>
                                            <svg viewBox="0 0 24 24" className={classes.icon}>
                                                <path 
                                                    d={materialIcons[key]}
                                                />
                                            </svg>
                                            <div>
                                                {title}
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return '';
                            }    
                        }) : 
                            <div className={classes.placeholderBlock}>
                                <Language text={content.loading} />
                            </div>
                        }
                    </div>
                    <div className={classes.searchContainer}>
                        <div className={classes.searchBlock}>
                            <input 
                                ref={searchBox}
                                type="text" 
                                placeholder={localize(content.search)} 
                                className={classes.search} 
                                onChange={onSearchChange}
                                value={search}
                            />
                        </div>
                    </div>
                </div>
                <div className={classes.clickAwayContainer} onClick={() => onClose(null)} />
            </div>
        </ClickAwayListener>
    );
}
