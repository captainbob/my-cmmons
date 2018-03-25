import React, { Component } from 'react';
import SpuNumberEdit from './spu-number-edit';
import { Modal } from 'antd';
import { clone } from 'ramda';

export default class SpuNumberEditModal extends Component {

    state = {
        visible: this.props.visible,
        spu: clone(this.props.spu)
    }

    componentWillReceiveProps(nextProps) {
        // if (this.props.visible != nextProps.visible && this.props.spu != nextProps.spu) {
        this.setState({ visible: nextProps.visible, spu: clone(nextProps.spu) });
        // }
    }

    render() {
        return <Modal maskClosable={false} title={this.props.title || '编辑整款'} visible={this.state.visible} width={950} onOk={this.onOk} onCancel={this.onCancel}>
            <SpuNumberEdit
                refBillId={this.props.refBillId}
                editType={this.props.editType}
                allowDelete={false}
                spu={this.state.spu}
                onChange={this.onChange}
            ></SpuNumberEdit>
        </Modal>
    }

    onChange = (data, value) => {
        let spu = JSON.parse(JSON.stringify(this.state.spu.map(item => {
            if (item.spuId === data.spuId) {
                item.skcList = item.skcList.map(itm => {
                    if (itm.colorId === data.colorId) {
                        itm.skuList = itm.skuList.map(iem => {
                            if (iem.skuId === data.skuId) {
                                iem['paperNum'] = data.value;
                            }
                            return iem;
                        })
                    }
                    return itm;
                })
            }
            return item;
        })))
        this.setState({ spu });
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
        this.setState({ visible: false });
        if (this.props.onOk) {
            this.props.onOk(clone(this.state.spu));
        }
    }
}