import { HttpUtil } from 'djmodules-utils/lib'
import { Message } from 'antd'

export default class Helper {
    /**
     * 验证数字
     * @param n 输入数字
     */
    static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    /*
     移动数组记录
    */
    static moveArray(arr, index1, index2) {
        if (Math.abs(index1 - index2) > 1) {
            arr.splice(index2, 0, arr[index1]);
            if (index1 >= index2) {
                arr.splice(index1 + 1, 1);
            } else {
                arr.splice(index1, 1);
            }
        } else {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        }
        return arr;
    }
    /*
    * 四舍五入
    */
    static round(num, fractionDigits) {
        if (!num || isNaN(num)) {
            num = 0;
        }
        if (isNaN(fractionDigits) || fractionDigits < 0) {
            fractionDigits = 0;
        }
        return (Math.round(num * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits)).toFixed(fractionDigits);
    }
    //解析获取组件改变的值
    static changeValue(obj, excludeString, maxValue, minValue) {
        let text = '';
        if (obj && typeof (obj) === 'object' && obj.target) {
            text = obj.target.value;
        } else {
            text = obj;
        }
        // 排除字符
        if (excludeString && typeof (excludeString) !== 'number') {
            let reg;
            if (excludeString.constructor === RegExp) {
                reg = excludeString;
            } else if (excludeString.constructor === Array) {
                reg = new RegExp('(' + excludeString.join("|") + ')', 'g');
            } else {
                reg = new RegExp('(' + excludeString + ')', 'g');
            }
            if (reg && text) {
                text = text.toString().replace(reg, '');
            }
            if (maxValue && text.length > maxValue) {
                text = text.substring(0, maxValue);
            }
        } else if (typeof (excludeString) === 'number') {
            let _text = String([undefined, null].indexOf(text) < 0 ? text : '');
            if (_text.length) {
                let jian = _text.indexOf('-') === 0 ? '-' : '';
                _text = _text.replace(/([^0-9|^.])/ig, "");
                _text = _text.split('.');
                text = _text.length ? _text[0] : '';
                if (excludeString > 0) {
                    text += _text.length > 1 ? '.' + _text[1].substring(0, excludeString) : '';
                }
                text = jian + text;
                if (typeof (maxValue) === "number" && text > maxValue) {
                    text = text < maxValue ? text : maxValue
                }
                if (typeof (minValue) === "number" && text < minValue) {
                    text = text > minValue ? text : minValue
                }
            } else {
                text = '';
            }
        }
        return text;
    }
    // 设置键值
    static setKey(data, config) {
        let children = 'children';
        if (config && config.constructor === Object) {
            children = config.children;
        }
        let keyName = [];  //默认key
        config = config || 'key';
        if (typeof (config) === 'string' || config.constructor === Array) {
            keyName = toKeyName(config);
        } else if (config.constructor === Object) {
            keyName = toKeyName(config.keyName);
        }
        if (data && data.constructor === Array) {
            data = data.map((item, i) => {
                keyName.forEach(itm => {
                    item[itm] = i;
                });
                if (item[children] && item[children].constructor === Array) {
                    item[children] = item[children].map((itm, j) => {
                        keyName.forEach(iem => {
                            itm[iem] = j;
                        });
                        return itm;
                    });
                }
                return item;
            });
        }
        return data;
    }
    static ajax(url, options, jsonData) {
        // 按类型参数交换options<=>json
        if (!(options instanceof Object) && options) {
            let _options = options, _json = jsonData;
            _options = jsonData instanceof Object ? jsonData : {}
            _json = options;
            options = _options;
            jsonData = _json;
        }
        return new Promise((resolve, reject) => {
            if (!options.method) {
                options.method = "GET";
            }
            HttpUtil.ajax(url, options).then(response => {
                if ((response.resultCode === 'success' || response.status === 'success')) {
                    // json 等于 true 或 'all' 时，返回全部JSON数据
                    let resultObject = [true, 'all'].indexOf(jsonData) >= 0 ? response : response.resultObject;
                    resolve(resultObject);
                } else {
                    let message = response.exceptionMessage || response.message || '请求错误';
                    Message.error(message);
                    reject(message);
                }
            }).catch(err => {
                let message = '请求错误：请刷新重试！';
                Message.error(message);
                reject('请求错误');
            })
        })
    }
}

// 将字符串或数组中的字符串项转成keyName
function toKeyName(obj) {
    let _keyName = [];
    if (obj) {
        if (typeof (obj) === 'string') {
            _keyName = [obj];
        } else if (obj.constructor === Array) {
            obj.forEach(item => {
                if (typeof (item) === 'string') {
                    _keyName.push(item);
                }
            })
        }
    }
    return _keyName;
}