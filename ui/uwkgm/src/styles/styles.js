export function getStyles(styles) {
    if (typeof styles === 'function') {
        return styles();

    } else {
        var out = Object.keys(styles);

        for (let [key, obj] of Object.entries(styles)) {
            if (typeof obj === 'function') {
                out[key] = obj();
            } else {
                out[key] = getStyles(obj);
            }
        }

        return out;
    }
}
