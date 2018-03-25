import { HttpUtil } from 'djmodules-utils/lib'
import { message } from 'antd'
import { toJS } from 'mobx';
import Load from '../models/load';
const loadingInstance = Load.getInstance();

export default class Http {
    static promiseGet(url, options) { //过时了 
        options = Object.assign({}, {
            method: 'get',
            data: options
        });
        return Http.ajax(url, options).then(res => {
            return res && res.resultObject
        });
    }
    static promisePost(url, options) {  //过时了
        options = Object.assign({}, {
            method: 'post',
            data: options
        });
        return Http.ajax(url, options).then(res => {
            return res && res.resultObject
        });
    }
    static promiseAjax(url, options) {
        return new Promise((resolve, reject) => {
            if (!options.unLoading) {
                loadingInstance.setLoading(true)
            }
            options.data = filterData(toJS(options.data));
            HttpUtil.promiseAjax(url, options).then(response => {
                loadingInstance.setLoading(false)
                resolve(response)
            }).catch(err => {
                loadingInstance.setLoading(false)
                message.error(err.exceptionMessage || err.message || '请求错误')
                reject(err)
            })
        })
    }
    static ajax(url, options) {
        return new Promise((resolve, reject) => {
            loadingInstance.setLoading(true)
            options.data = filterData(toJS(options.data));
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
        if (_data[key] === '' || _data[key] === undefined || _data[key] === null) {
            continue
        }
        filterData[key] = _data[key];
    }
    return filterData;
}