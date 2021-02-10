import React from 'react';

import { useTheme } from '@material-ui/core/styles';

const NodeBorderIcon = props => {
    const theme = useTheme();
    const { size, stroke, strokeWidth, disabled } = props;
    const inactive = disabled ? '#888' : null;

    return (
        <svg width={size || 20} height={size || 20} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" style={{stroke: inactive || stroke || theme.palette.info.main, strokeWidth: strokeWidth || 2, fill: 'none'}} />
        </svg>
    );
}

export default NodeBorderIcon;
