import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import { Api } from './api/api';
import { updateAppBar } from 'components/console/console.action';

export class DashboardClass extends React.Component {
    componentDidMount() {
        this.props.actions.console.updateAppBar({title: ['Dashboard']});
    }

    render() {
        return (
            <Api />
        );
    }
}

const mapStateToProps = state => {
    return {
        reducers: {
            console: state.consoleReducer
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

export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardClass);
