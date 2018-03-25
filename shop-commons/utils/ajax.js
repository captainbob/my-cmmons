import { HttpUtil } from 'djmodules-utils/lib'
import { message } from 'antd'
import Load from '../view-models/load';
const loadingInstance = Load.getInstance();

export default function ajax(url, options, returnAll) {
    // 按类型参数交换options<=>returnAll
    options = options || {};
    if (!(options instanceof Object) && options) {
        let _options = options, _json = returnAll;
        _options = returnAll instanceof Object ? returnAll : {}
        _json = options;
        options = _options;
        returnAll = _json;
    }
    // 也可以设置在options中
    if (!returnAll && (options instanceof Object) && options.returnAll === true) {
        returnAll = true;
    }
    return new Promise((resolve, reject) => {
        if (!options.method) {
            options.method = "GET";
        }
        // 默认URL编码
        if (typeof options.encode !== 'boolean') {
            options.encode = true;
        }
        // 关闭消息提示
        let closeMessage;
        if (options && options.closeMessage) {
            closeMessage = options.closeMessage;
        }
        //开启加载效果
        if (options.loading) {
            loadingInstance.setLoading(true);
        }
        // 延时请求
        if (options && typeof options.delay === 'number' && options.delay > 0) {
            setTimeout(() => {
                httpAjax(url, options, returnAll, closeMessage, resolve, reject);
            }, options.delay);
        } else {
            httpAjax(url, options, returnAll, closeMessage, resolve, reject);
        }
    })
}
function httpAjax(url, options, returnAll, closeMessage, resolve, reject) {
    if (options && options.data instanceof Object) {
        options.data = filterData(options.data);
    }
    HttpUtil.ajax(url, options).then(response => {
        // 关闭加载效果
        if (options.loading) {
            loadingInstance.setLoading(false);
        }
        // returnAll 等于 true 或 'all' 时，返回全部JSON数据
        let resultObject = [true, 'all'].indexOf(returnAll) >= 0 ? response : response.resultObject;
        if ((response.status === 'success')) {
            resolve(resultObject);
        } else {
            let msg = response.exceptionMessage || response.message || '请求错误';
            let _t = (msg.length * 100) / 1000;
            _t = _t > 1 ? _t < 5 ? _t : 5 : 1;  // 不超出1-5秒
            if (!closeMessage) {
                message.destroy();
                message.error(msg, _t);
            } else if (closeMessage instanceof Function) {
                options.closeMessage(msg, 'warning');
            }
            reject(msg);
        }
    }).catch(err => {
        let msg = <span>请求异常或超时：请 <a href="javascript:;" onClick={() => location.reload()}>刷新</a> 重试！</span>;
        let _t = 5; //(msg.length * 100) / 1000;
        //_t = _t > 1 ? _t < 5 ? _t : 5 : 1;  // 不超出1-5秒
        if (!closeMessage) {
            message.destroy();
            message.error(msg, _t);
        } else if (closeMessage instanceof Function) {
            options.closeMessage(msg, 'error');
        }
        // 关闭加载效果
        if (options.loading) {
            loadingInstance.setLoading(false);
        }
        reject(true);   // 返回true时，表示catch error
    })
}
// 过滤一下无用的键值，好东东
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