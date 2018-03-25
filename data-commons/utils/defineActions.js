const NAMESPACE_SEPARATOR = '/';
const DEFAULT_SUBACTIONS = ["PENDING", "REJECTED", "FULFILLED"];
/**
 * 用法:https://github.com/smeijer/redux-define
 * @param {*} type 
 * @param {*} subactions 
 * @param {*} namespace 
 */
const defineAction = (type, subactions = DEFAULT_SUBACTIONS, namespace) => {
    if (subactions && subactions.ACTION || typeof subactions === 'string') {
        namespace = subactions;
    }

    if (!Array.isArray(subactions)) {
        subactions = [];
    }

    const name = (namespace) ? [namespace, type].join(NAMESPACE_SEPARATOR) : type;

    const action = subactions.reduce((r, i) => Object.assign({}, r, {
        [i]: `${name}_${i}`,
    }), {});

    action.ACTION = name;
    action.defineAction = (type, subactions) => defineAction(type, subactions, name);

    action.toString = () => name.toString();
    return action;
};

export default defineAction;