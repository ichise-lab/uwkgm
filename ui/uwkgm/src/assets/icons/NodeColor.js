import React from 'react';

import { useTheme } from '@material-ui/core/styles';

const NodeColorIcon = props => {
    const theme = useTheme();
    const { size, fill, disabled } = props;
    const inactive = disabled ? '#888' : null;

    return (
        <svg width={size || 24} height={size || 24} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" style={{fill: inactive || fill || theme.palette.info.main}} />
        </svg>
    );
}

export default NodeColorIcon;
