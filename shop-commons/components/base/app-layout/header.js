import React from 'react';
import { Menu } from 'djmodules';
import { Breadcrumb, Icon, Modal, Spin } from 'antd';

const style = {
    borderBottom: '1px solid #e3e3e3',
    height: 38,
    lineHeight: '38px',
    borderBottom: '2px solid rgb(16, 142, 233)',
    position: 'relative'
};

@Menu.inject
class _Header extends React.Component {
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
            <div style={style}>
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

export default class Header extends React.Component {
    render() {
        return <_Header {...this.props}></_Header>
    }
}