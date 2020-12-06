import React from 'react';

import {
    Container,
    useStyles,
    Wrapper 
} from './modal.css';

export class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.isActivated = false;
    }

    componentDidUpdate() {
        if (this.props.isActive === true) {
            this.isActivated = true;
        }
    }

    render() {
        return (
            <ModalFunc 
                isActive={this.props.isActive}
                isActivated={this.isActivated}
                children={this.props.children}
                style={this.props.style}
            />
        );
    }
}

const ModalFunc = (props) => {
    const classes = useStyles();
    const {
        isActive,
        isActivated,
        style
    } = props;

    return (
        <Wrapper className={
            (isActive) ? 
                classes.wrapperActive 
            : (isActivated) ?
                classes.wrapperInactive
            :
                {}
        }>
            <Container style={{...style, display: (isActive) ? 'block' : 'none'}}>
                {props.children}
            </Container>
        </Wrapper>
    );
}
