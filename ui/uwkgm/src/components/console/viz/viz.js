import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import { Base } from './base/base';
import { updateAppBar } from 'components/console/console.action';

class VizClass extends React.Component {
    componentDidMount() {
        this.props.actions.console.updateAppBar({title: ['Visalizer']});
    }

    render() {
        return (
            <Base />
        );
    }
}

const mapStateToProps = state => {
    return {};
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

const Viz = connect(mapStateToProps, mapDispatchToProps)(VizClass)
export default Viz;