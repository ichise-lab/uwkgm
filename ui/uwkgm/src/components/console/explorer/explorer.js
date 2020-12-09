import React from 'react';
import ReactJson from 'react-json-view';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import { useTheme } from '@material-ui/core/styles';

import { apiEndpoint } from 'services/servers';
import { content } from './explorer.content';
import { getStyles } from 'styles/styles';
import { init, updateActiveBranch, updateEndpointParams, updateResult } from './explorer.action';
import { Language } from 'services/languages/languages';
import { request } from 'services/http';
import { Ribbon } from './ribbon/ribbon';
import { styles as pageStyles } from 'components/console/templates/page.css';

class ExplorerClass extends React.Component {
    constructor(props) {
        super(props);

        const endpoints = apiEndpoint.split('/');
        const version = endpoints[endpoints.length - 1];
        
        endpoints.pop();

        const server = endpoints.join('/');

        this.state = {
            isProcessing: false,
            server: server,
            version: version,
            api: 'knowledge',
        };

        this.isComponentMounted = false;
    }

    initTree = tree => {
        const initParams = params => {
            params.map(param => {
                param.value = param.example;
                return null;
            })
        }

        for (var key in tree) {
            if (key === '*') {
                tree[key].map(endpoint => {
                    initParams(endpoint.arguments.required);
                    initParams(endpoint.arguments.optional);
                    endpoint.result = null;
                    return null;
                });

            } else {
                this.initTree(tree[key]);
            }
        }
    }

    initBranch = (tree, branch) => {
        var children = Object.entries(tree);
    
        if (children[0][0] !== '*') {
            branch.push(children[0][0])
            return this.initBranch(children[0][1], branch);
        } else {
            branch.push(children[0][1][0].name);
            return children[0][1][0];
        }
    }

    getActiveEndpoint = (tree=null, activeBranch=null) => {
        if (!tree && this.props.reducers) {
            tree = this.props.reducers.explorer.tree;
        }

        if (!activeBranch && this.props.reducers) {
            activeBranch = this.props.reducers.explorer.activeBranch.slice();
        }
    
        if (activeBranch.length > 1) {
            const node = activeBranch[0];
            activeBranch.shift();
            return this.getActiveEndpoint(tree[node], activeBranch)
        } else {
            for (var i = 0; i < tree['*'].length; i++) {
                if (tree['*'][i].name === activeBranch[0]) {
                    return tree['*'][i];
                }
            }
        }
    }

    handleBranchChange = (event, branchLevel) => {
        const changeTo = event.target.value;

        const walkActiveBranch = (tree, branch, level, targetLevel) => {
            return (level < targetLevel) ? walkActiveBranch(tree[branch[level]], branch, level + 1, targetLevel) : tree;
        }

        var tree = walkActiveBranch(this.props.reducers.explorer.tree, this.props.reducers.explorer.activeBranch, 0, branchLevel);
        var branch = this.props.reducers.explorer.activeBranch;
        var subBranch = [];
        var newBranch = [];
        var i;

        if (changeTo in tree) {
            this.initBranch(tree[changeTo], subBranch);
        }

        branch[branchLevel] = changeTo;

        for (i = 0; i < branchLevel; i++) {
            newBranch.push(branch[i]);
        }

        newBranch.push(changeTo);

        for (i = 0; i < subBranch.length; i++) {
            newBranch.push(subBranch[i]);
        }

        this.props.actions.explorer.updateActiveBranch(newBranch, this.getActiveEndpoint(this.props.reducers.explorer.tree, newBranch.slice()));
    }

    handleParamChange = (event, param) => {
        const assignValue = (params, targetParam, value) => {
            params.map(item => {
                if (item.name === targetParam) {
                    item.value = value
                }
                return null;
            });
            return null;
        }

        var meta = this.getActiveEndpoint();
        assignValue(meta.arguments.required, param, event.target.value);
        assignValue(meta.arguments.optional, param, event.target.value);
        this.props.actions.explorer.updateEndpointParams(meta);
    }

    handleSubmit = event => {
        const endpoint = this.state.server + '/' + this.state.version + '/' + this.props.reducers.explorer.activeBranch.join('/');
        const params = {};
        const addParams = args => {
            args.map(arg => {
                if (arg.value.length > 0) {
                    params[arg.name] = arg.value;
                }
                return null;
            });
            return null;
        };

        addParams(this.getActiveEndpoint().arguments.required);
        addParams(this.getActiveEndpoint().arguments.optional);

        request.json({
            url: endpoint,
            params: params
        }).then(data => {
            const activeEndpoint = this.getActiveEndpoint(this.props.reducers.explorer.tree, this.props.reducers.explorer.activeBranch.slice());
            activeEndpoint.result = {data: data};
            this.props.actions.explorer.updateResult(activeEndpoint, this.props.reducers.explorer.tree);

            if (this.isComponentMounted) { 
                this.setState(() => ({
                    isProcessing: false
                })); 
            }
        }).catch(error => {
            alert("An error occurred while sending the request: " + error);
            this.setState(() => ({
                isProcessing: false
            })); 
        });

        this.setState(() => ({isProcessing: true}));
    }

    componentDidMount() {
        this.isComponentMounted = true;

        if (!this.props.reducers.explorer.isTreeLoaded) {
            request.json({
                url: apiEndpoint + '/?**&reduce'
            }).then(data => {
                if (this.isComponentMounted) {
                    var branch = [];
                    const meta = this.initBranch(data.packages, branch);

                    this.initTree(data.packages);
                    this.setState(() => ({isProcessing: false}), () => {
                        this.props.actions.explorer.init(true, branch, meta, data.packages);
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }
    
    render() {
        return (
            <ExplorerFunc
                server={this.state.server}
                version={this.state.version}
                api={this.state.api}
                isProcessing={this.state.isProcessing}
                onSubmit={this.handleSubmit}
                onParamChange={this.handleParamChange}
                onBranchChange={this.handleBranchChange}
                isTreeLoaded={this.props.reducers.explorer.isTreeLoaded}
                activeBranch={this.props.reducers.explorer.activeBranch}
                activeEndpoint={this.props.reducers.explorer.activeEndpoint}
                tree={this.props.reducers.explorer.tree}
            />
        );
    }
}

const ExplorerFunc = props => {
    const pageClasses = getStyles(pageStyles.page);
    const theme = useTheme();
    const {
        server,
        version,
        api,
        isProcessing,
        onSubmit,
        onParamChange,
        onBranchChange,
        isTreeLoaded,
        activeBranch,
        activeEndpoint,
        tree
    } = props;
    
    return (
        <div className={pageClasses.container}>
            <div className={clsx([pageClasses.content, pageClasses.paddedContent])}>
                <div className={pageClasses.title}>
                    <Language text={content.head.title} />
                </div>
                <div className={pageClasses.text}>
                    <Language text={content.head.description} />
                </div>
                {tree ?
                    <React.Fragment>
                        <Ribbon 
                            server={server}
                            version={version}
                            api={api}
                            isProcessing={isProcessing}
                            onSubmit={onSubmit}
                            onParamChange={onParamChange}
                            onBranchChange={onBranchChange}
                            isTreeLoaded={isTreeLoaded}
                            activeBranch={activeBranch}
                            activeEndpoint={activeEndpoint}
                            tree={tree}
                        />
                        {activeEndpoint && activeEndpoint.result ?
                            <ReactJson 
                                src={activeEndpoint.result}
                                theme="monokai"
                                style={{backgroundColor: theme.palette.background.default}}
                             />
                        : ''}
                    </React.Fragment>
                : '' }
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        reducers: {
            explorer: state.explorerReducer
        }
    };
}

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            explorer: {
                init: bindActionCreators(init, dispatch),
                updateActiveBranch: bindActionCreators(updateActiveBranch, dispatch), 
                updateEndpointParams: bindActionCreators(updateEndpointParams, dispatch), 
                updateResult: bindActionCreators(updateResult, dispatch)
            }
        }
    }
}

const Explorer = connect(mapStateToProps, mapDispatchToProps)(ExplorerClass);
export default Explorer;
