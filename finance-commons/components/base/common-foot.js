import React, { Component } from 'react';
import { Button } from 'antd';
class FootView extends Component {
    render() {
        return (
            <div style={{ textAlign: "right", margin: '16px 10px 0px' }}>
                {
                    this.props.footer ? this.props.footer : ([
                        <Button key='1' onClick={this.props.onCancel} style={{ marginRight: 12 }}>{this.props.cancelText ? this.props.cancelText : "取消"}</Button>,
                        <Button key='2' onClick={this.props.onOk} type="primary">{this.props.okText ? this.props.okText : "确认"}</Button>
                    ])
                }

            </div>
        );
    }
}

export default FootView;