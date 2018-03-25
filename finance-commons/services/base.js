import Http from '../utils/http';

export function createWebService(baseUrl) {
    return new Proxy({}, {
        get(target, propKey, receiver) {
            return httpGet(baseUrl + '/' + propKey);
        }
    });
}

const httpGet = (url) => (ajaxMethod = 'post') => (options = {}) => {

    options = Object.assign({}, {
        method: ajaxMethod
    }, options)
    return Http.ajax(url, options);

}