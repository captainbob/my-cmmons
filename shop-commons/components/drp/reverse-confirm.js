import React, { Component } from 'react';
import { Modal } from 'antd';
import { Radio, Input } from 'antd';
const RadioGroup = Radio.Group;

export default class extends Component {
    state = {
        value: false
    }
    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return <Modal maskClosable={false}
            visible={this.state.visible} 
            title='冲销' 
            onOk={this.onOk} 
            onCancel={this.onCancel}>
            <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio style={radioStyle} value={false}>仅冲销本单据</Radio>
                <Radio style={radioStyle} value={true}>冲销并复制本单据</Radio>
            </RadioGroup>
        </Modal>
    }

    showModal = () => {
        this.setState({ visible: true, value: false });
    }

    onOk = () => {
        this.setState({ visible: false });
        if (this.props.onOk) {
            this.props.onOk(this.state.value);
        }
    }

    onCancel = () => {
        this.setState({ visible: false });
        if (this.props.onCancel) {
            this.props.onCancel(this.state.value);
        }
    }

    onChange = (event) => {
        this.setState({ value: event.target.value })
    }
}