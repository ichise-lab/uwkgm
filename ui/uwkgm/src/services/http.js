import { auth } from 'services/auth';

export const request = props => {
    const url = new URL(props.url);
    const isJSON = props.json;
    const passError = props.passError;

    delete props.url;
    delete props.json;
    delete props.passError;

    var settings = props || {};
    settings.headers = settings.headers || {};
    settings.headers['Authorization'] = 'Bearer ' + auth.getTokens().access;
    url.search = new URLSearchParams(props.params || {}).toString();

    var promise = new Promise((resolve, reject) => {
        fetch(url, settings)
            .then(response => {
                if (response.status === 200) {
                    if (isJSON) {
                        response.json().then(data => {
                            resolve('data' in data ? data.data : data);
                        });
                    } else {
                        resolve(response);
                    }
                } else {
                    const message = 'The server responded with an error';

                    response.json().then(data => {
                        if (passError === undefined || !passError) {
                            alert(message + ': ' + data.detail);
                        }

                        reject({message: message, detail: data.detail, status: response.status, response: response});

                    }).catch(error => {
                        if (passError === undefined || !passError) {
                            alert(message + ': ' + error);
                        }

                        reject({message: message, detail: error, status: response.status, response: response});
                    });
                }
            })
            .catch(error => {
                const message = 'An error occured while fetching';

                if (passError === undefined || !passError) {
                    alert(message + ': ' + error);
                }
                
                reject({message: message, detail: error});
            });
    });

    return promise;
}

request.json = props => {
    var headers = props.headers || {};
    var body;

    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json';

    if ('method' in props && props.method.toUpperCase() !== 'GET') {
        var params = {};

        if ('body' in props) {
            for (let [key, value] of Object.entries(props.body)) {
                params[key] = JSON.stringify(value);
            }
        }

        body = JSON.stringify(params);
    }

    delete props.headers;
    delete props.body;

    return request({headers: headers, body: body, json: true, ...props});
}
