import React from 'react';

import { blue } from 'styles/colors.css';

const NodeBorderIcon = props => {
    const { size, stroke, strokeWidth, disabled } = props;
    const inactive = disabled ? '#888' : null;

    return (
        <svg width={size || 20} height={size || 20} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" style={{stroke: inactive || stroke || blue, strokeWidth: strokeWidth || 2, fill: 'none'}} />
        </svg>
    );
}

export default NodeBorderIcon;
