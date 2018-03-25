import React, { Component } from 'react';
import { Icon } from 'antd';

const style = {
    color: '#108ee9'
}

export default class extends Component {
    render() {
        return <span style={{display:this.props.number == 0 ? 'none':'inline'}}>
            <Icon type="exclamation-circle" style={style} />
            &nbsp;
            已选择 <span style={style}>{this.props.number}</span> 条数据
        </span>
    }
}