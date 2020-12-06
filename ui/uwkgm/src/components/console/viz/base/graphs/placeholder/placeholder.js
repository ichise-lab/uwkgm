import React from 'react';

import blue from '@material-ui/core/colors/blue';
import { useTheme, withTheme } from '@material-ui/core/styles';

import { getStyles } from 'styles/styles';
import { styles } from './placeholder.css';

export class PlaceholderClass extends React.Component {
    constructor(props) {
        super(props);
        this.svg = React.createRef();
        this.animations = [];
    }

    componentDidMount() {
        function generate(size) {
            var array = [];

            for (let i = 1; i <= size; i++) {
                array.push(i);
            }

            return array;
        }

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }

            return array;
        }

        const pos = [[[21, 2], [31, 2]],
                     [[11, 11], [21, 11], [31, 11], [41, 11]],
                     [[2, 21], [11, 21], [21, 21], [31, 21], [41, 21], [50, 21]],
                     [[2, 31], [11, 31], [21, 31], [31, 31], [41, 31], [50, 31]],
                     [[11, 41], [21, 41], [31, 41], [41, 41]],
                     [[21, 50], [31, 50]]];
        
        const rs = [[2, 2],
                    [3, 3, 3, 3],
                    [2, 3, 4, 4, 3, 2],
                    [2, 3, 4, 4, 3, 2],
                    [3, 3, 3, 3],
                    [2, 2]];

        const shuffled = shuffle(generate(24));
        var k = 0;

        for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < pos[i].length; j++) {
                var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute('cx', pos[i][j][0]);
                circle.setAttribute('cy', pos[i][j][1]);
                circle.setAttribute('r', 0);
                circle.style.fill = this.props.theme.palette.type === 'light' ? blue[600] : blue[500];
                circle.style.opacity = rs[i][j] / 4;

                var animation = document.createElementNS("http://www.w3.org/2000/svg", "animate");
                animation.setAttribute('attributeName', 'r');
                animation.setAttribute('from', '0');
                animation.setAttribute('to', rs[i][j]);
                animation.setAttribute('begin', (.1 + shuffled[k] / 24 / 8) + 's');
                animation.setAttribute('dur', '0.3s');
                animation.setAttribute('fill', 'freeze');

                circle.appendChild(animation);
                this.svg.current.appendChild(circle);
                this.animations[k++] = animation;
            }
        }
    }

    render() {
        return (
            <PlaceholderFunc svg={this.svg} />
        );
    }
}

const PlaceholderFunc = props => {
    const classes = getStyles(styles.placeholder);
    const theme = useTheme();
    const { svg } = props;

    return (
        <div className={classes.body}>
            <div className={classes.container}>
                <div>
                    <svg ref={svg} viewBox="0 0 52 52" style={{width: 150, margin: 'auto'}} />
                </div>
                <div className={classes.content}>Search and add entities to start.</div>
                <div className={classes.actions}>
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        style={{color: theme.palette.text.primary}}
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
}

export const Placeholder = withTheme(PlaceholderClass);
