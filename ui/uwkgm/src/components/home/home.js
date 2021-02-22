import React from 'react';

import Container from '@material-ui/core/Container';

import { getStyles } from 'styles/styles';
import { Header } from './header/header';
import { Landing } from './landing/landing';
import { publicURL } from 'services/servers';
import { Route } from "react-router-dom";
import { styles } from './home.css';

export default class Home extends React.Component {
    render() {
        return (
            <HomeFunc />
        );
    }
}

const HomeFunc = props => {
    const classes = getStyles(styles.home);

    return (
        <div className={classes.body}>
            <Container maxWidth="lg" className={classes.container}>
                <Header />
                <Route path={`${publicURL}/home`} component={Landing} />
            </Container>
        </div>
    );
}
