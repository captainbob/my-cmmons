import React, { Component } from 'react'
import classnames from 'classnames/bind'
import AppLayoutCss from './app-layout.less'

const cx = classnames.bind(AppLayoutCss)

const getWeight = (type) => {
    switch (type) {
        case AppLayout.Header:
            return 1
        case AppLayout.Filter:
            return 2
        case AppLayout.Operations:
            return 3
        case AppLayout.List:
            return 4
        case AppLayout.Pagination:
            return 5
        default:
            return 6
    }
}

export default class AppLayout extends Component {
    render() {
        let children = React.Children.toArray(this.props.children)
        children = children.sort((a, b) => {
            return getWeight(a.type) - getWeight(b.type)
        })
        return (
            <div className={cx('container')}>
                {children}
            </div>
        )
    }
}

AppLayout.Header = class extends Component {
    render() {
        return (
            < div className={cx('header', 'header-container', 'title')} >
                {this.props.title ?
                    <div className={cx('header-first')}>{this.props.title}</div>
                    : undefined
                }
                <div className={cx('inline-block')}>{this.props.children}</div>
            </div >
        )
    }
}

AppLayout.Filter = class extends Component {
    render() {
        return (
            < div className={cx('border-bottom', 'sub-container')} >
                {this.props.children}
            </div >
        )
    }
}

AppLayout.Operations = class extends Component {
    render() {
        return (
            <div className={cx('operations')}>
                {this.props.children}
            </div>
        )
    }
}

AppLayout.List = class extends Component {
    render() {
        return (
            <div className={cx('sub-container')}>
                {this.props.children}
            </div>
        )
    }
}

AppLayout.Pagination = class extends Component {
    render() {
        return (
            <div className={cx('sub-container', 'pagination')}>
                {this.props.children}
            </div>
        )
    }
}