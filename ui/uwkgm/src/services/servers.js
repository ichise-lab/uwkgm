function resolveAPIVersion() {
    const version = process.env.REACT_APP_VERSION.split('.');
    version.pop();
    return version.join('.');
}

export const publicURL = process.env.PUBLIC_URL;
export const apiEndpoint = process.env.REACT_APP_API_ENDPOINT + '/v' + resolveAPIVersion();
export const authEndpoint = process.env.REACT_APP_AUTH_ENDPOINT + '/v' + resolveAPIVersion();
