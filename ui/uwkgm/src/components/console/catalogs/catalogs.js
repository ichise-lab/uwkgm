import React from 'react';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import { apiEndpoint } from 'services/servers';
import { content } from './catalogs.content';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { request } from 'services/http';
import { styles as pageStyles } from 'components/console/templates/page.css';
import { updateAppBar } from 'components/console/console.action';
import { updateCatalogs } from 'services/catalogs/catalogs.action';

class CatalogsClass extends React.Component {
    constructor(props) {
        super(props);
        this.isComponentMounted = false;

        this.state = {
            isEditing: false,
            editingName: null,
            newName: null,
            newDescription: null
        }
    }

    handleCreateButtonClick = () => {
        this.setState(() => ({isEditing: true}));
    }

    componentDidMount() {
        this.isComponentMounted = true;
        this.props.actions.console.updateAppBar({title: ['Catalogs']});
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    render() {
        return (
            this.state.isEditing ?
                <CatalogFunc 
                    catalogReducer={this.props.reducers.catalogs}
                />
            :
                <CatalogsFunc 
                    catalogReducer={this.props.reducers.catalogs}
                    onCreateButtonClick={this.handleCreateButtonClick}
                />
        );
    }
}

const CatalogsFunc = props => {
    const pageClasses = getStyles(pageStyles);
    const {
        catalogReducer,
        onCreateButtonClick
    } = props;

    return (
        <div className={clsx([pageClasses.page.container, pageClasses.page.centeredContainer])}>
            <div className={pageClasses.page.centeredWrapper}>
                <div className={clsx([pageClasses.page.content, pageClasses.page.paddedContent])}>
                    <div className={pageClasses.page.title}>
                        <Language text={content.head.title} />
                    </div>
                    <div className={pageClasses.page.text}>
                        <Language text={content.head.description} />
                    </div>
                    <div className={pageClasses.section.container}>
                        <div className={pageClasses.section.title}>
                            <Language text={content.catalogs.localCatalogs} />
                        </div>
                        <div className={pageClasses.list.container}>
                            {catalogReducer.catalogs.map((item, index) => (
                                <div key={index} className={pageClasses.list.itemBlock}>
                                    <div className={pageClasses.list.itemDetail}>
                                        <div className={pageClasses.list.itemTitle}>{item.title}</div>
                                        <div className={pageClasses.list.itemDescription}>{item.description}</div>
                                        <div className={pageClasses.list.itemLink}>{item.uri}</div>
                                    </div>
                                    <div className={pageClasses.list.itemActions}>
                                        {catalogReducer.catalogs.length > 1 ?
                                            <IconButton>
                                                <DeleteIcon />
                                            </IconButton>
                                        : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={pageClasses.actions.container}>
                            <div className={pageClasses.actions.centeredWrapper}>
                                <button type="button" className="btn btn-primary" style={{marginRight: 5}} onClick={onCreateButtonClick}>Create Catalog</button>
                                <button type="button" className="btn btn-secondary" style={{marginRight: 5}} disabled>Export Settings</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CatalogFunc = props => {
    const pageClasses = getStyles(pageStyles);

    return (
        <div className={clsx([pageClasses.page.container, pageClasses.page.centeredContainer])}>
            <div className={pageClasses.page.centeredWrapper}>
                <div className={clsx([pageClasses.page.content, pageClasses.page.paddedContent])}>
                    <div className={pageClasses.page.title}>
                        <Language text={content.head.title} /> / <TextField label="Title" variant="outlined" required autoFocus />
                    </div>
                    <div className={pageClasses.page.text}>
                        <div>Graph name and URI must be unique. Graph name can include only a-z, A-Z, 0-9, -, and _.</div>
                        <TextField label="Name" style={{width: '30%'}} required />
                        <TextField label="URI" style={{width: '70%'}} required />
                        <TextField label="Description" style={{width: '100%', marginTop: 20}} variant="outlined" rowsMax={4} multiline />
                    </div>
                    <div className={pageClasses.section.container}>
                        <div className={pageClasses.section.title}>
                            <Language text={content.catalog.permissions} />
                        </div>
                        <div className={pageClasses.page.text}>
                            
                        </div>
                    </div>
                    <div className={pageClasses.section.container}>
                        <div className={pageClasses.section.title}>
                            <Language text={content.catalog.labels} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        reducers: {
            catalogs: state.catalogReducer,
            console: state.consoleReducer
        }
    };
}

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            console: {
                updateAppBar: bindActionCreators(updateAppBar, dispatch),
            },
            catalogs: {
                updateCatalogs: bindActionCreators(updateCatalogs, dispatch)
            }
        }
    }
}

const Catalogs = connect(mapStateToProps, mapDispatchToProps)(CatalogsClass);
export default Catalogs;
