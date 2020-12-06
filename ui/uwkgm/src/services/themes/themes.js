export const initTheme = 'dark';

export function getSemanticColors(theme, type=null) {
    const names = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];
    const oppositeType = theme.palette.type === 'light' ? 'dark' : 'light';
    var colors = {};

    names.map(name => {
        colors[name] = theme.palette[name][type === null ? oppositeType : type];
        return null;
    });

    return colors;
}
