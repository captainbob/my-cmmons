import React, { Component } from 'react';
import { clone } from 'ramda';
import { fjs, StringUtils } from 'djmodules-utils';
import { Input, InputNumber, message, Icon } from 'antd';
import SpuNumberEditModal from './spu-number-edit-modal';

export default class extends Component {
    state = {
        num: 1,
        data: {}
    }
    componentDidMount() {
    }
    render() {
        let readOnly = this.props.readOnly || this.state.readOnly;
        return <div style={Object.assign({ marginLeft: 10 }, this.props.style || {}, this.props.hide ? { display: 'none' } : {})}>
            {this.props.label || '扫码'}：
            <Input
                ref="code"
                placeholder="扫码或输入货号"
                style={{ width: 200, marginRight: 10 }}
                size="large"
                value={this.state.code}
                suffix={this.state.code ? this.state.status : undefined}
                readOnly={readOnly}
                disabled={!this.props.editable}
                onFocus={() => {
                    this.setState({ code: '' });
                }}
                onKeyUp={(e) => {
                    // ESC 和 空格键
                    if ([27, 32].includes(e.keyCode)) {
                        this.setState({ code: '' });
                    }
                    this.pressChangeNum(e);
                }}
                onChange={(e) => {
                    this.setState({ code: StringUtils.trim(e.target.value), status: '' });
                }}
                onPressEnter={(e) => {
                    this.getData(this.state.code);
                }}
            />
            数量：
            <Input
                placeholder="请填写"
                style={{ width: '5em' }}
                size="large"
                min={1}
                value={this.state.num}
                readOnly={readOnly}
                disabled={!this.props.editable}
                onKeyUp={(e) => {
                    this.pressChangeNum(e);
                }}
                onChange={(e) => {
                    let text = e.target.value;
                    this.setState({ num: text === '' ? '' : (Number(text) || 1) })
                }}
                onBlur={(e) => {
                    let { num = 1 } = this.state;
                    this.setState({ num });
                }}
                onPressEnter={(e) => {
                    this.getData(this.state.code);
                }}
            />
            <SpuNumberEditModal
                title={this.props.title || '编辑整款（叠加）'}
                editType={this.props.editType}
                spu={this.state.spu || []}
                visible={this.state.modalVisible}
                onCancel={() => {
                    this.setState({ modalVisible: false, spu: [] });
                }}
                onOk={(data) => {
                    if (this.props.onOk) {
                        this.props.onOk(clone(data));
                    }
                    this.setState({ modalVisible: false, spu: [] });
                }} />
        </div>
    }
    pressChangeNum(e) {
        let { num = 0 } = this.state;
        if (e.keyCode === 40) {
            this.setNum(num - 1);
        }
        if (e.keyCode === 38) {
            this.setNum(num + 1);
        }
    }
    setNum(num) {
        num = num < 1 ? 1 : num;
        this.setState({ num })
    }
    getData(code) {
        message.destroy();
        if (!code) {
            message.error('请输入编码');
            return false;
        }
        // 只读或有值则存在状态时，证明错误或正在请求
        if (this.state.readOnly || (this.state.code && this.state.status)) {
            return false;
        }
        this.setState({ readOnly: true, status: <Icon type="loading" style={{ color: '#999999' }} /> });
        fjs.http.post('/rs/wms/bill_item/scan_code', {
            scanType: 1,
            billId: this.props.billId,
            num: this.state.num || 1,
            code,
        }).then(res => {
            if (res && (res.resultCode === 'success' || res.status === 'success')) {
                if (typeof res.resultObject === 'object') {
                    this.setState({
                        readOnly: false,
                        modalVisible: true,
                        spu: res.resultObject,  //this.clearNum(res.resultObject, 'paperNum'),
                        code: '', status: ''
                    });
                } else {
                    this.setState({ readOnly: false, spu: [], code: '', status: <Icon type="check" style={{ color: '#108ee9' }} /> });
                    if (this.props.onSku) {
                        this.props.onSku();
                    }
                }
            } else {
                this.setState({ readOnly: false, status: <Icon type="close" style={{ color: 'red', cursor: 'pointer' }} onClick={this.clearText} /> });
                message.error(res.message || res.exceptionMessage);
            }
        }).catch(err => {
            let { error } = err
            message.error((error && error.exceptionMessage) || '请求出错，请刷新重试！');
            this.setState({ readOnly: false, status: <Icon type="close" style={{ color: 'red', cursor: 'pointer' }} onClick={this.clearText} /> });
        })
    }
    clearNum(data, keyName) {
        if (!data || !keyName) return [];
        data = JSON.parse(JSON.stringify(data || []));
        let spu = (data || []).map(item => {
            item.skcList = (item.skcList || []).map(itm => {
                itm.skuList = (itm.skuList || []).map(iem => {
                    iem[keyName] = undefined;
                    return iem;
                })
                return itm;
            })
            return item;
        })
        return spu || [];
    }
    clearText = () => {
        this.setState({ code: '' });
        message.destroy();
        this.refs['code'].refs.input.focus()
    }
}