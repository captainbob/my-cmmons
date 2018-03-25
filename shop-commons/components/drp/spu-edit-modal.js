import React, { Component } from 'react';
import SpuEdit from './spu-edit';
import { Modal } from 'antd';
import { clone } from 'ramda';

export default class SpuEditModal extends Component {

    state = {
        visible: this.props.visible,
        spu: clone(this.props.spu)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.visible != nextProps.visible && this.props.spu != nextProps.spu) {
            this.setState({ visible: nextProps.visible, spu: clone(nextProps.spu) })
        }
    }

    render() {
        return <Modal maskClosable={false} title='编辑整款' visible={this.state.visible} width={950} onOk={this.onOk} onCancel={this.onCancel}>
            <SpuEdit allowDelete={false} agentJoin={this.props.agentJoin} spu={this.state.spu} onChange={this.onChange}></SpuEdit>
        </Modal>
    }

    onChange = (skuId, num) => {
        this.setState({
            spu: Object.assign({}, this.state.spu, {
                skus: this.state.spu.skus.map(sku => {
                    if (sku.skuId == skuId) {
                        sku.num = num;
                        sku.requestNum = num;
                    }
                    return sku;
                })
            })
        });
    }

    showModal(visible, spu) {
        this.setState({ visible, spu: clone(spu) });
    }

    onCancel = () => {
        Modal.confirm({
            title: '确认框',
            content: '你确定要放弃编辑吗？',
            onOk: () => {
                this.setState({ visible: false });
                if (this.props.onCancel) {
                    this.props.onCancel();
                }
            }
        })
    }

    onOk = () => {
        this.setState({ visible: false })
        if (this.props.onOk) {
            this.props.onOk(clone(this.state.spu));
        }
    }
}