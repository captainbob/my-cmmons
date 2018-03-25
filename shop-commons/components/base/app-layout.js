import React, { Component } from 'react';
import { Breadcrumb, Icon, Modal, Spin } from 'antd';
import { Menu } from 'djmodules';
const style = {
    header: {
        borderBottom: '1px solid #e3e3e3',
        height: 38,
        lineHeight: '38px',
        marginLeft: 10,
        marginRight: 10,
        borderBottom: '2px solid rgb(16, 142, 233)',
        position: 'relative'
    },
    headerTable: {
        height: '100%'
    },
    filter: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        padding: 10,
        background: '#f9f9f9'
    },
    list: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
    },
    appLayout: {
        minWidth: 1024,
    },
    operations: {
        marginLeft: 10,
        marginRight: 10,
    },
    pagination: {
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'right',
        marginTop: 10,
        marginBottom: 10
    },
}

export default class AppLayout extends Component {
    static defaultProps = {
        mode: 'app'
    }
    state = {
        height: 'auto'
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        document.addEventListener('collapsechange', this.onResize);
        document.addEventListener('togglefullscreen', this.onResize);
        this.onResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener('collapsechange', this.onResize);
        document.removeEventListener('togglefullscreen', this.onResize);
    }

    onResize = () => {
        const container = this.props.container || document.getElementsByClassName('dj-menu-content')[0] || document.body;
        const height = this.props.mode !== 'app' ? 'auto' : container.clientHeight;
        this.setState({height:height});
    }

    render() {
        let children = React.Children.toArray(this.props.children);
        children = children.sort((a, b) => {
            return getWeight(a.type) - getWeight(b.type);
        });
        const bottomBar = getBottomBar(children);
        return (
            <div style={{width:'100%', height:this.state.height, position:'relative'}}>
                <div style={{position:this.props.mode === 'app' ? 'absolute' : 'relative', left:0, right:0, bottom:bottomBar ? 60 : 0, top:0, overflow:'auto'}}>
                    <Spin spinning={this.props.loading || false}>
                        <div style={Object.assign({}, style.appLayout, this.props.style)}>
                            <div id='@@app-layout-elements-without-content'>
                                {
                                    getAppLayoutElelmentWithOutContent(children)
                                }
                            </div>
                            {
                                getContent(children)
                            }
                        </div>
                    </Spin>
                    {
                        getOtherElements(children)
                    }
                </div>
                {bottomBar? <div id='@@app-layout-bottom-bar' style={{position:'absolute', left:0, right:0, bottom:0, height:60, maxHeight:60, overflow:'hidden', borderTop:'1px solid #f3f3f3', boxSizing: 'content-box'}}>
                    {
                        bottomBar
                    }
                </div> : null}
            </div>
        )
    }
}

@Menu.inject
class Header extends Component {
    static defaultProps = {
        separator: '/',
        screenMode: 'normal'
    }

    componentDidMount() {
        //bad impl
        if (this.props.screenMode == 'full') {
            setTimeout(() => {
                this.toggleFullScreen(this.props.screenMode == 'full');
            }, 30);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.screenMode != this.props.screenMode) {
            this.toggleFullScreen(nextProps.screenMode == 'full');
        }
    }

    render() {
        if (this.props.title) {
            document.title = this.props.title;
        } else {
            if (this.props.routes && this.props.routes.length > 0) {
                document.title = this.props.routes[this.props.routes.length - 1].title;
            }
        }
        return (
            <div style={style.header}>
                {this.props.title ? <span style={{ fontSize: 14, fontWeight: 700, marginRight: 10 }}>{this.props.title}</span> : null}
                {this.props.routes ? <div style={{ display: 'inline-block' }}>
                    <Breadcrumb separator={this.props.separator}>
                        {
                            this.props.routes.map((item, index) => {
                                let color = '#1890ff';
                                if (this.props.routes.length - 1 == index) {
                                    color = null;
                                }
                                if (!item.href) {
                                    return <Breadcrumb.Item key={index} style={{ fontSize: 14, fontWeight: 700, color: color }}>{item.title}</Breadcrumb.Item>
                                }
                                return <Breadcrumb.Item key={index}>
                                    <a onClick={() => { this.onHref(item.href, this.props.prompt) }}>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: color }}>{item.title}</span>
                                    </a>
                                </Breadcrumb.Item>
                            })
                        }
                    </Breadcrumb>
                </div> : null}
                <div style={{ position: 'absolute', right: 0, top: 0 }}>
                    {this.props.extraContent ? this.props.extraContent : null}
                    {this.props.allowFullScreen ? <Icon type={this.screenMode() ? 'shrink' : "arrows-alt"}
                        style={{ fontSize: 16, cursor: 'pointer', color: '#108ee9', marginLeft: 8 }}
                        onClick={() => { this.toggleFullScreen(!this.screenMode()) }} /> : null}
                    {this.props.allowClose ? <Icon type='close'
                        style={{ fontSize: 16, cursor: 'pointer', color: '#108ee9', marginLeft: 8 }}
                        onClick={() => { window.close() }} /> : null}
                </div>
            </div>
        )
    }

    onHref = (href, prompt) => {
        const jump = (myhref) => {
            if (myhref.startsWith('#/')) {
                window.location.hash = myhref;
            } else {
                window.location.href = myhref;
            }
        };
        if (prompt && prompt.visible) {
            return Modal.confirm({
                title:'确认框',
                content: prompt.text,
                onOk:() => {
                    jump(href);
                }
            })
        } else {
            jump(href);
        }
    }

    dispatchEvent = () => {
        const dispatchEvent = document.createEvent('HTMLEvents');
        dispatchEvent.initEvent('togglefullscreen', true, true);
        document.dispatchEvent(dispatchEvent)
    }

    toggleFullScreen = (screenMode) => {
        if (this.props.menu.toggleFullScreen) {
            this.props.menu.toggleFullScreen(screenMode);
        }
        //bad impl
        setTimeout(() => {
            this.dispatchEvent();
        }, 30);
    }

    screenMode = () => {
        if (this.props.menu.screenMode) {
            return this.props.menu.screenMode();
        }
        return false;
    }
}

AppLayout.Header = Header;

AppLayout.Filter = class Filter extends Component {
    render() {
        const newStyle = Object.assign({}, style.filter, this.props.style || {})
        return (
            <div style={newStyle}>
                {this.props.children}
            </div>
        )
    }
}

AppLayout.Content = class Content extends Component {
    render() {
        const newStyle = Object.assign({}, style.list, this.props.style || {})
        return (
            <div id='@@app-layout-content' style={newStyle}>
                {this.props.children}
            </div>
        )
    }
}

AppLayout.Operations = class extends Component {
    render() {
        return (
            <div style={{ marginTop: 10, marginBottom: 10, marginLeft: 10, marginRight: 10 }}>
                {this.props.children}
            </div>
        )
    }
}

AppLayout.Pagination = class extends Component {
    render() {
        return (
            <div style={style.pagination}>
                {this.props.children}
            </div>
        )
    }
}

const getWeight = (type) => {
    if (type == AppLayout.Header) {
        return 0;
    }
    if (type == AppLayout.Filter) {
        return 1;
    }
    if (type == AppLayout.Content) {
        return 3;
    }
    if (type == AppLayout.Operations) {
        return 2;
    }
    if (type == AppLayout.Pagination) {
        return 4;
    }
    return 5;
}

function getContent(children) {
    for (let i = 0; i < children.length; i++) {
        if (children[i].type == AppLayout.Content) {
            return children[i];
        }
    }
}

function getAppLayoutElelmentWithOutContent(children) {
    const newChildren = [];
    for (let i = 0; i < children.length; i++) {
        if (children[i].type == AppLayout.Header
            || children[i].type == AppLayout.Filter
            || children[i].type == AppLayout.Operations
            || children[i].type == AppLayout.Pagination) {
            newChildren.push(children[i]);
        }
    }
    return newChildren;
}

function getBottomBar(children) {
    for (let i = 0; i < children.length; i++) {
        if (children[i].type == AppLayout.BottomBar) {
            return children[i];
        }
    }
}

function getOtherElements(children) {
    const newChildren = [];
    for (let i = 0; i < children.length; i++) {
        if (children[i].type != AppLayout.Header
            && children[i].type != AppLayout.BottomBar
            && children[i].type != AppLayout.Content
            && children[i].type != AppLayout.Filter
            && children[i].type != AppLayout.Operations
            && children[i].type != AppLayout.Pagination) {
            newChildren.push(children[i]);
        }
    }
    return newChildren;
}


AppLayout.BottomBar = class extends Component {
    render() {
        return <div style={{ width:'100%', height:'100%', position:'relative', boxShadow: '0px -1px 5px #f3f3f3' }}>
            {this.props.children}
        </div>
    }
}

AppLayout.wrap = function (target) {
    return class extends Component {

        state = {
            maxContentHeightInClient: -1
        }

        componentDidMount() {
            window.addEventListener('resize', this.onResize);
            this.onResize()
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.onResize);
        }

        onResize = () => {
            let content = document.getElementsByClassName('dj-menu-content')[0];
            if (typeof content == 'undefined') {
                content = document.body;
            }
            let element = document.getElementById('@@app-layout-elements-without-content');
            this.setState({
                maxContentHeightInClient: content.clientHeight - element.clientHeight - 10 - (document.getElementById('@@app-layout-bottom-bar') ? 60 : 0)
            });
        }

        render() {
            return React.createElement(target, Object.assign({}, this.props, {
                maxContentHeightInClient: this.state.maxContentHeightInClient,
                appLayoutResize: () => {
                    this.onResize();
                }
            }));
        }
    }
}
