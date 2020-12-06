function resolveAPIVersion() {
    const version = process.env.REACT_APP_API_VERSION.split('.');
    version.pop();
    version.pop();
    return version.join('.');
}

export const apiEndpoint = process.env.REACT_APP_API_ENDPOINT + '/v' + resolveAPIVersion();
export const authEndpoint = process.env.REACT_APP_AUTH_ENDPOINT + '/v' + resolveAPIVersion();
