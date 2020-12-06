import React from 'react';

import { darkGrey, blue } from 'styles/colors.css';

const FontColorIcon = props => {
    const { size, stroke, strokeWidth, fill, disabled } = props;
    const inactive = disabled ? '#888' : null;

    return (
        <svg height={size || 24} width={size || 24} viewBox="0 0 24 24">
            <path 
                d="M 6 15 L 11 2 L 16 15 M 7 11 L 15 11" 
                style={{
                    stroke: inactive || stroke || darkGrey, 
                    strokeWidth: strokeWidth || 2, 
                    fill: 'none'}} 
                />
            <rect x="3" y="18" width="16" height="5" style={{fill: inactive || fill || blue}} />
        </svg>
    );
}

export default FontColorIcon;
