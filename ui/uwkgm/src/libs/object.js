export function reassignObject(obj, update) {
    var newObj = Object.assign({}, obj);
    
    for (let key of Object.keys(update)) {
        if (typeof update[key] === 'object' && update[key] !== null) {
            newObj[key] = reassignObject(newObj[key], update[key]);
        } else {
            newObj[key] = update[key];
        }
    }

    return newObj;
}
