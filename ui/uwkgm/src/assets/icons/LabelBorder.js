import React from 'react';

import { darkGrey, blue } from 'styles/colors.css';

const LabelBorderIcon = props => {
    const { size, aStroke, aStrokeWidth, borderStroke, borderStrokeWidth, disabled } = props;
    const inactive = disabled ? '#888' : null;

    return (
        <svg width={size || 24} height={size || 24} viewBox="0 0 24 24">
            <path d="M 2 2 L 22 2 L 22 22 L 2 22 Z" style={{stroke: inactive || borderStroke || blue, strokeWidth: borderStrokeWidth || 2, fill: 'none'}} />
            <path d="M 7 19 L 12 6 L 17 19 M 8 15 L 16 15" style={{stroke: inactive || aStroke || darkGrey, strokeWidth: aStrokeWidth || 2, fill: 'none'}} />
        </svg>
    );
}

export default LabelBorderIcon;
