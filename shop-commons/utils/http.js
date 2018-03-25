import { HttpUtil } from 'djmodules-utils/lib'
import { message } from 'antd'
import Load from '../view-models/load';
const loadingInstance = Load.getInstance();
message.config({
    top: 50
})
export default class Http {
    static promiseGet(url, options) {
        options = Object.assign({}, {
            method: 'GET',
            data: options
        });
        return Http.ajax(url, options).then(res => {
            return res && res.resultObject
        });
    }
    static promisePost(url, options) {
        options = Object.assign({}, {
            method: 'POST',
            data: options
        });
        return Http.ajax(url, options).then(res => {
            return res && res.resultObject
        });
    }
    static promiseAjax(url, options, noLoading = false) {
        return new Promise((resolve, reject) => {
            if (!noLoading) {
                loadingInstance.setLoading(true);
            }
            options.data = filterData(options.data);
            HttpUtil.promiseAjax(url, options).then(response => {
                if (!noLoading) {
                    loadingInstance.setLoading(false);
                }
                resolve(response)
            }).catch(err => {
                if (!noLoading) {
                    loadingInstance.setLoading(false);
                }
                message.error(err.exceptionMessage || err.message || '请求错误')
                reject(err.exceptionMessage || err.message || '请求错误')
            })
        })
    }
    static ajax(url, options, noLoading) {
        return new Promise((resolve, reject) => {
            if (!noLoading) {
                loadingInstance.setLoading(true)
            }
            options.data = filterData(options.data);
            HttpUtil.ajax(url, options).then(response => {
                loadingInstance.setLoading(false)
                if (response.status == 'success') {
                    if (response) {
                        resolve(response)
                    } else {
                        resolve()
                    }
                } else {
                    message.error(response.exceptionMessage || response.message || '请求错误')
                    reject(response.exceptionMessage || response.message || '请求错误')
                }
            }).catch(err => {
                loadingInstance.setLoading(false)
                reject('请求错误')
            })
        })
    }
}

function filterData(data) {
    let _data = Object.assign({}, data), filterData = {};

    for (let key in _data) {
        if (_data[key] === undefined || _data[key] === null) {
            continue
        }
        filterData[key] = _data[key];
    }
    return filterData;
}