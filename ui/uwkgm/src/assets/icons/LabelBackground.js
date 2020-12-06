import React from 'react';

import { blue } from 'styles/colors.css';

const LabelBackgroundIcon = props => {
    const { size, stroke, strokeWidth, fill, disabled } = props;
    const inactive = disabled ? '#888' : null;
    const darkInactive = disabled ? '#666' : null;

    return (
        <svg width={size || 24} height={size || 24} viewBox="0 0 24 24">
            <rect x="0" y="0" width="24" height="24" style={{fill: inactive || fill || blue}} />
            <path d="M 7 19 L 12 6 L 17 19 M 8 15 L 16 15" style={{stroke: darkInactive || stroke || 'white', strokeWidth: strokeWidth || 2, fill: 'none'}} />
        </svg>
    );
}

export default LabelBackgroundIcon;
