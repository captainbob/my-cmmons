import React, { Component } from 'react';
import { Row, Col, Button, Icon } from 'antd';
import { fjs } from 'djmodules-utils';

import { Modal } from 'antd';
import OpLogController from './op-log-controler'

class OpLogModal extends Component {
    state = {
        billId: undefined,
        visible: false
    }
    render() {
        return <Modal title='操作日志'
            width={1100}
            visible={this.state.visible}
            maskClosable={true}
            footer={<Button type='primary' onClick={this.onOk}>确定</Button>}
            onOk={this.onOk}
            destroyOnClose={true}
            onCancel={this.onCancel}>
            {this.state.billId ? <OpLogController dataType={this.props.dataType} billId={this.state.billId} columns={this.props.columns}></OpLogController> : null}
        </Modal>
    }

    showModal(billId) {
        this.setState({ visible: true, billId });
    }

    onOk = () => {
        this.setState({ visible: false });
    }

    onCancel = () => {
        this.setState({ visible: false });
    }
}

export default class EditArea extends Component {
    static defaultProps = {
        editable: true,
        onChange: (values) => { },
        onValidate: (values) => { return true; },
        dataType: undefined,
        prompt: {
            text: '',
            visible: false
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            collapse: this.props.collapse,
            mode: 'normal',
            values: {},
            errors: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.collapse != 'undefined' && nextProps.collapse != this.props.collapse) {
            this.setState({ collpase: nextProps.collapse });
        }
    }

    render() {
        return <div style={{ border: '1px solid #f3f3f3', borderRadius: 4, overflow: 'hidden', color: 'rgba(0,0,0,0.65)', position: 'relative' }}>
            <div style={{ height: 30, lineHeight: '30px', background: '#f2f2f2' }}>
                <Row>
                    <Col span={18} style={{ paddingLeft: 8, paddingRight: 8 }}>
                        {
                            (this.props.headerItems || []).map(item => {
                                return <EditArea.Item
                                    marginTop={0}
                                    mode={'normal'}
                                    normal={item.normal}
                                    key={item.key}
                                    label={item.label}
                                    contentWidth={item.contentWidth}></EditArea.Item>
                            })
                        }
                    </Col>
                    <Col span={6}>
                        {
                            this.state.mode == 'edit' ? <div style={{ textAlign: 'right', lineHeight: '30px' }}>
                                <Button type='primary' style={{ marginRight: 16, height: 25, lineHeight: '25px', marginTop: 2 }} onClick={this.onOk}>完成</Button>
                                <Button style={{ marginRight: 16, height: 25, lineHeight: '25px', marginTop: 2 }} onClick={this.onCancel}>取消</Button>
                            </div> : <div style={{ textAlign: 'right' }}>
                                    {this.props.editable ? <Button type='primary'
                                        style={{
                                            marginRight: 16,
                                            cursor: 'pointer',
                                            border: '0px solid white',
                                            paddingLeft: 0,
                                            paddingRight: 0,
                                            height: 25,
                                            lineHeight: '25px'
                                        }} ghost onClick={this.onEdit}>
                                        <Icon type="edit" />编辑
                                    </Button> : null}
                                    <Button style={{ marginRight: 8, height: 25, lineHeight: '25px', marginTop: 2, paddingLeft: 8, paddingRight: 8 }} onClick={this.onCollapse}>
                                        {
                                            this.state.collapse ? <Icon type="down" /> : <Icon type="up" />
                                        }
                                    </Button>
                                </div>
                        }
                    </Col>
                </Row>
            </div>
            <div style={{ display: this.state.collapse ? 'none' : 'block', padding: 8, paddingTop: 3 }}>
                {
                    (this.props.items || []).map(item => {
                        if (item.newline === true) {
                            return <div key={item.key} style={{ clear: 'left' }}></div>
                        }
                        const keys = Object.keys(this.state.values).filter(key => key == item.key) || [];
                        return <EditArea.Item value={keys.length > 0 ? this.state.values[item.key] : item.value}
                            onChange={this.onChange}
                            onItemChange={item.onChange}
                            getValueFromEvent={item.getValueFromEvent}
                            mode={this.state.mode}
                            edit={item.edit}
                            normal={item.normal}
                            key={item.key}
                            id={item.key}
                            label={item.label}
                            error={this.state.errors[item.key]}
                            contentWidth={item.contentWidth}
                            contentEditWidth={item.contentEditWidth}></EditArea.Item>
                    })
                }
                <div style={{ clear: 'both' }}></div>
            </div>
            {
                this.props.enableLog && !this.state.collapse ? <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                    <Button type='primary' style={{ padding: 0, border: '0px solid white' }} ghost onClick={this.onShowOpLogModal}>操作日志</Button>
                </div> : null
            }

            <OpLogModal dataType={this.props.dataType} ref='opLogModal' columns={this.props.columns}></OpLogModal>
        </div>
    }

    onShowOpLogModal = (event) => {
        if (this.props.onLogBtnClick) {
            this.props.onLogBtnClick(event);
        } else {
            this.refs.opLogModal.showModal(this.props.billId);
        }
    }

    onChange = (key, value) => {
        this.setState((state) => {
            return { values: Object.assign({}, state.values, { [key]: value }) }
        })
    }

    onEdit = () => {
        this.setState({ mode: 'edit', collapse: false });
    }

    onOk = () => {
        const process = () => {
            const originalValues = this.props.items.reduce((total, next) => {
                total[next.key] = next.value;
                return total;
            }, {})

            const resultValues = Object.assign({}, originalValues, this.state.values);
            if (this.props.onValidate(this.state.values)) {
                if (this.props.onChange) {
                    const errors = {};
                    this.props.items.forEach(item => {
                        if (item.onValidate) {
                            const result = item.onValidate(resultValues[item.key]);
                            if (result !== true) {
                                errors[item.key] = result;
                            }
                        }
                    });
                    if (Object.keys(errors).length > 0) {
                        return this.setState({ errors });
                    }
                    this.props.onChange(resultValues, {
                        ok: () => {
                            this.setState({ mode: 'normal' });
                            this.setState({ values: {} });
                        }
                    });
                }
            }
        }
        if (this.props.prompt.visible === true) {
            Modal.confirm({
                title: '提示框',
                content: this.props.prompt.text,
                onOk: () => {
                    process();
                }
            })
        } else {
            process();
        }
    }

    onCancel = () => {
        const cancel = () => {
            this.setState({ mode: 'normal' });
            if (this.props.onCancel) {
                this.props.onCancel();
            }
            this.setState({ values: {} })
        };
        if (Object.keys(this.state.values).length > 0) {
            return Modal.confirm({
                title: '确认框',
                content: '内容已经发生改变，你确定要取消操作吗？',
                onOk: () => {
                    cancel();
                }
            })
        }
        cancel();
    }

    onCollapse = () => {
        this.setState((state) => {
            if (this.props.onCollapse) {
                this.props.onCollapse(!state.collapse);
            }
            return {
                collapse: !state.collapse
            }
        });
    }
}

EditArea.Item = class extends Component {
    render() {
        const length = fjs.commons.safeProp(0, [null, undefined], 'props.label.length', this);
        const labelWidth = length > 0 ? (length + 1) * 12 : 0;
        return <div style={{
            width: labelWidth + ((this.props.mode == 'edit' ? (this.props.edit ? this.props.contentEditWidth : this.props.contentWidth) : this.props.contentWidth) || 0),
            float: 'left',
            marginRight: 8,
            color: `${this.props.mode == 'edit' && typeof this.props.error != 'undefined' ? 'red' : 'rgba(0,0,0,0.65)'}`,
            boxSizing: 'content-box',
            marginTop: typeof this.props.marginTop != 'undefined' ? this.props.marginTop : 5
        }}>
            <div style={{ width: labelWidth, float: 'left', lineHeight: '28px', overflow: 'hidden' }}>
                <span>{this.props.label}：</span>
            </div>
            <div style={{
                width: (this.props.mode == 'edit' ? (this.props.edit ? this.props.contentEditWidth : this.props.contentWidth) : this.props.contentWidth) || 0,
                float: 'left',
                lineHeight: '28px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }}>
                {
                    this.props.mode == 'edit' ? (this.props.edit ? React.cloneElement(this.props.edit, {
                        onChange: this.onChange,
                        value: this.props.value
                    }) : React.cloneElement(this.props.normal, {
                    })) : React.cloneElement(this.props.normal, {
                    })
                }
            </div>
            <div style={{ clear: 'both' }}></div>
        </div>
    }

    onChange = (event) => {
        if (this.props.onChange) {
            let value = event;

            if (this.props.onItemChange) {
                this.props.onItemChange(event);
            }

            if (event && event.target && typeof event.target.value != 'undefined') {
                return this.props.onChange(this.props.id, event.target.value);
            }

            if (event && event.target && typeof event.target.checked != 'undefined') {
                return this.props.onChange(this.props.id, event.target.checked);
            }

            return this.props.onChange(this.props.id, this.props.getValueFromEvent ? this.props.getValueFromEvent(event) : event);
        }
    }
}