import React, { Component } from 'react'
import { observer } from 'mobx-react'

//[a, [b, c], d]
// new a(new b(c), d)
function createObject(array) {
    if (!Array.isArray(array) || array.length == 0) {
        return undefined
    }
    array = array.map(item => {
        if (Array.isArray(item)) {
            return createObject(item)
        }
        return item
    })
    const [first, ...rest] = array
    if (typeof first == 'function') {
        return new first(...rest)
    } else {
        throw new Error(`${first} must be a function`)
    }
}

function observerExt(object) {
    return function (target) {
        return class extends Component {
            render() {
                const props = Object.assign({}, this.props)
                Object.keys(object).forEach(key => {
                    if (Array.isArray(object[key])) {
                        props[key] = createObject(object[key])
                    } else {
                        props[key] = new object[key]()
                    }
                })
                const observerTarget = observer(target)
                return React.createElement(observerTarget, props)
            }
        }
    }
}

export default { observerExt }