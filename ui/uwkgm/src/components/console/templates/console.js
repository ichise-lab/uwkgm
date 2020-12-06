import React from 'react';
import clsx from 'clsx';

import { Container, ContentContainer, TitleContainer, TextBlock } from './console.css';
import { useStyles } from './console.css';

export class Page extends React.Component {
    render() {
        return (
            <Container
                style={this.props.style || {}}
                className={this.props.className || {}}
            >
                {this.props.children}
            </Container>
        );
    }
}

export class Content extends React.Component {
    render() {
        return (
            <ContentFunc
                children={this.props.children}
                padded={this.props.padded}
                syle={this.props.style}
                className={this.props.className}
            />
        );
    }
}

const ContentFunc = props => {
    const classes = useStyles();
    const {
        children,
        padded,
        style,
        className
    } = props;

    return (
            <ContentContainer
                style={style || {}}
                className={clsx(padded ? classes.paddedContent : '', className)}
            >
                {children}
            </ContentContainer>
    );
}

export class Sidebar extends React.Component {
    render() {
        return (
            <div
                style={this.props.style || {}}
                className={this.props.className || {}}
            >
                {this.props.children}
            </div>
        );
    }
}

export class Title extends React.Component {
    render() {
        return (
            <TitleContainer
                style={this.props.style || {}}
                className={this.props.className || {}}
            >
                {this.props.children}
            </TitleContainer>
        );
    }
}

export class Text extends React.Component {
    render() {
        return (
            <TextBlock
                style={this.props.style || {}}
                className={this.props.className || {}}
            >
                {this.props.children}
            </TextBlock>
        );
    }
}