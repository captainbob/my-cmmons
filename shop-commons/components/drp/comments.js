import React, { Component } from 'react';
import { Tooltip } from 'antd';
export default class Comments extends Component {
    render() {
        return this.props.comments && this.props.comments.length > 0 ? <Tooltip placement="topLeft" title={this.props.comments}>
            <div style={{ background: '#8ec6ef', color: 'white', width: 30, height: 16, lineHeight: '16px', textAlign: 'center', borderRadius: 8, display: this.props.comments && this.props.comments.length > 0 ? 'block' : 'none' }}>
                ···
            </div>
        </Tooltip> : <span></span>
    }
}