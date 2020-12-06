import React from 'react';

import { blue } from 'styles/colors.css';

const NodeColorIcon = props => {
    const { size, fill, disabled } = props;
    const inactive = disabled ? '#888' : null;

    return (
        <svg width={size || 24} height={size || 24} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" style={{fill: inactive || fill || blue}} />
        </svg>
    );
}

export default NodeColorIcon;
