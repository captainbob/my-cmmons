import _ from 'lodash';
import { observable } from 'mobx';

const convertSchema = (schema) => {
    return schema.map(item => {
        const newItem = Object.assign({}, item);
        const hasOwnProperty = {}.hasOwnProperty;
        if (!hasOwnProperty.call(item, 'from') || !hasOwnProperty.call(item, 'to')) {
            throw new Error('from, to must be provide');
        }
        if (!hasOwnProperty.call(item, 'convert')) {
            newItem.convert = (value) => {
                return value;
            }
        }
        return newItem;
    });
}

const generateObject = (schema, object) => {
    const newObject = {};
    schema.forEach((element) => {
        const oldValue = _.get(object, element.from);
        let newValue = element.convert(oldValue == null ? '' : oldValue, object);
        _.set(newObject, element.to, newValue);
    });
    return newObject;
}

function convert(schema, object, extend) {
    extend = extend || {};
    schema = convertSchema(schema);
    let newObject = generateObject(schema, object);
    newObject = Object.assign({ '$object': object }, newObject, extend);
    const keys = Object.keys(newObject);
    newObject = new Proxy(newObject, {
        get: function (target, key, receiver) {
            return Reflect.get(target, key, receiver);
        },
        set: function (target, key, value, receiver) {
            const none = keys.reduce((pre, next) => {
                return key != next && pre;
            }, true);
            if (!none && key != '$object') {
                return Reflect.set(target, key, value, receiver);
            } else {
                throw new Error('Change unknow property or $object is not allowed');
            }
        }
    });
    return newObject;
}

function promiseConvert(options) {
    const schema = options.schema,
        extend = options.extend,
        key = options.key,
        disableArrayCheck = options.disableArrayCheck || false,
        disablePaginationCheck = options.disablePaginationCheck || false;
    return function (target, name, descriptor) {
        var oldValue = descriptor.value;
        descriptor.value = function () {
            return new Promise((resolve, reject) => {
                oldValue.apply(target, arguments).then((response) => {
                    if (!response) {
                        return resolve(response);
                    }
                    let objectToConvert = response;
                    if (key) {
                        objectToConvert = _.get(response, key);
                    }

                    //array parse
                    if (!disableArrayCheck) {
                        if (Array.isArray(objectToConvert)) {
                            const newReponse = objectToConvert.map(item => {
                                return convert(schema, item, extend);
                            });
                            return resolve(newReponse);
                        }
                    }

                    //pagination parse
                    if (!disablePaginationCheck) {
                        if (response.pagination) {
                            let results = [];
                            if (Array.isArray(response.results)) {
                                results = response.results.map(item => {
                                    return convert(schema, item, extend);
                                });
                            }
                            return resolve({
                                results: results,
                                pagination: response.pagination
                            });
                        }
                    }
                    resolve(convert(schema, response, extend));
                }).catch(error => {
                    reject(error);
                });
            });
        }
        return descriptor;
    }
}

export { convert, promiseConvert };