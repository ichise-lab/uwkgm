import React from 'react';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { useSelector } from 'react-redux';
import { withRouter } from "react-router-dom";

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import IconButton from '@material-ui/core/IconButton';
import { withSnackbar } from 'notistack';

import { apiEndpoint } from 'services/servers';
import { getActiveCatalog } from 'services/catalogs/catalogs';
import { getStyles } from 'styles/styles';
import { OptionContainer } from 'components/console/templates/options';
import { request } from 'services/http';
import { styles } from './entity.css';
import { styles as optionStyles } from 'components/console/templates/options.css';
import { styles as pageStyles } from 'components/console/templates/page.css';
import { Tools } from './tools/tools';
import { updateAppBar } from 'components/console/console.action';
import { Collapse } from '@material-ui/core';

class EntityClass extends React.Component {
    constructor(props) {
        super(props);

        var opens = [true];
        this.state = {
            opens: opens,
            uri: null,
            label: null
        };
    }

    handleSectionToggle = index => {
        var opens = this.state.opens;
        opens[index] = !opens[index];
        this.setState(() => ({opens: opens}));
    }

    componentDidMount() {
        var searchParams = new URLSearchParams(this.props.location.search);

        if (searchParams.has('uri')) {
            console.log(searchParams.get('uri'));
            console.log(getActiveCatalog(this.props.reducers.catalogs).uri);

            request.json({
                url: apiEndpoint + '/databases/graphs/entities/find',
                params: {
                    graph: getActiveCatalog(this.props.reducers.catalogs).uri, 
                    uris: [searchParams.get('uri')],
                    include_incomings: false
                }
            })
        }
    }

    render() {
        return (
            <EntityFunc 
                isOpens={this.state.opens}
            />
        );
    }
}

const EntityFunc = props => {
    const isOptionsOpen = useSelector(state => state.consoleReducer).options.isOpen;
    const classes = getStyles(styles);
    const pageClasses = getStyles(pageStyles.page);
    const optionClasses = getStyles(optionStyles.options);
    const { isOpens } = props;

    return (
        <div className={clsx(pageClasses.container, {[optionClasses.contentShift]: isOptionsOpen})}>
            <div className={pageClasses.centeredWrapper} style={{maxWidth: 1024}}>
                <div className={clsx([pageClasses.content, pageClasses.paddedContent, pageClasses.toolHeadedContent])}>
                    <div className={pageClasses.title}>
                        Barack Obama
                    </div>
                    <div className={pageClasses.text}>
                        http://dbpedia.org/resource/Barack_Obama
                    </div>
                    <div className={classes.types.container}>
                        <div className={classes.types.block}>
                            Title
                        </div>
                    </div>
                    <div className={classes.list.container}>
                        <div className={classes.list.section}>
                            <div className={clsx([classes.list.sectionHead, classes.list.sectionRow])}>
                                <div>Head</div>
                                <div>URI</div>
                                <div>
                                    <div>
                                        <IconButton size="small">
                                            <EditIcon />
                                        </IconButton>
                                    </div>
                                    <div>
                                        <IconButton size="small">
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                    <div>
                                        <IconButton size="small">
                                            <KeyboardArrowDown />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                            <Collapse in={isOpens[0]} timeout="auto" unmountOnExit>
                                <div className={classes.list.sectionContent}>
                                    <div className={clsx([classes.list.sectionItem, classes.list.sectionRow])}>
                                        <div>Detail</div>
                                        <div>URI</div>
                                        <div>Actions</div>
                                    </div>
                                </div>
                            </Collapse>
                        </div>
                    </div>
                </div>
            </div>
            <Tools />
            <OptionContainer>

            </OptionContainer>
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
            console: {
                updateAppBar: bindActionCreators(updateAppBar, dispatch)
            }
        }
    };
}

const Entity = connect(mapStateToProps, mapDispatchToProps)(EntityClass);
export default withRouter(withSnackbar(Entity));
