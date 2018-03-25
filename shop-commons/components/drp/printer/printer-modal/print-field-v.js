import { Component } from 'react';
import { Button, Modal, Checkbox } from 'antd';
import { Helper } from 'djmodules-utils';
// import { Loading, Ajax, RootSpin } from 'djexports-commons';
import Loading from '../../../../view-models/load';
import RootSpin from '../../../base/root-spin';
import Ajax from '../../../../utils/ajax';
import _ from 'lodash';
const CheckboxGroup = Checkbox.Group;

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        }
    }
    loadingInstance = Loading.getInstance();
    componentWillMount() {
        this.setState({ data: Object.assign({}, this.props.data || {}) });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ data: Object.assign({}, nextProps.data || {}) });
    }
    render() {
        let { loading } = this.loadingInstance;
        let { header, list } = this.data;
        return (
            <Modal
                maskClosable={false}
                title={this.props.title || "自定义表单内容选择"}
                visible={this.props.visible}
                width={this.props.width || "80%"}
                style={this.props.style || { maxWidth: 600 }}
                confirmLoading={loading}
                footer={[
                    <Button type="primary"
                        onClick={() => {
                            this.props.onSave(this.state.data);
                            this.props.onCancel();
                        }}
                    >保存</Button>,
                    <Button onClick={() => this.onCancel()}>取消</Button>
                ]}
                onCancel={() => this.onCancel()}
            >
                <RootSpin>
                    {!header || !header.length ? '' :
                        <div>
                            <h4>
                                <Checkbox
                                    checked={header.length && header.filter(item => item.checked).length === header.length}
                                    indeterminate={header.filter(item => item.checked).length && header.filter(item => item.checked).length !== header.length}
                                    onChange={(e) => {
                                        this.checkboxItem('header', e.target.checked);
                                    }}
                                >表头字段选择</Checkbox>
                            </h4>
                            <div style={{ marginTop: 10 }}>
                                <CheckboxGroup
                                    options={header.map(item => {
                                        let _item = JSON.parse(JSON.stringify(item));
                                        // 这里做下补齐处理
                                        _item.label = this.fillSpace(_item.label);
                                        return _item;
                                    })}
                                    value={header.filter(item => item.checked).map(item => item.value)}
                                    onChange={(value) => {
                                        this.checkboxItem('header', value);
                                    }}
                                />
                            </div>
                        </div>
                    }
                    {!list || !list.length ? '' :
                        <div style={{ marginTop: 10 }}>
                            <h4><Checkbox
                                checked={list.length && list.filter(item => item.checked).length === list.length}
                                indeterminate={list.filter(item => item.checked).length && list.filter(item => item.checked).length !== list.length}
                                onChange={(e) => {
                                    this.checkboxItem('list', e.target.checked);
                                }}
                            >列表字段选择</Checkbox></h4>
                            <div style={{ marginTop: 10 }}>
                                <CheckboxGroup
                                    options={list.map(item => {
                                        let _item = JSON.parse(JSON.stringify(item));
                                        // 这里做下补齐处理
                                        _item.label = this.fillSpace(_item.label);
                                        return _item;
                                    })}
                                    value={list.filter(item => item.checked).map(item => item.value)}
                                    onChange={(value) => {
                                        this.checkboxItem('list', value);
                                    }}
                                />
                            </div>
                        </div>
                    }
                </RootSpin>
            </Modal>
        );
    }
    get data() {
        let { data } = this.state;
        return {
            header: (data && data.templateContent && data.templateContent.header) || [],
            list: (data && data.templateContent && data.templateContent.list) || []
        }
    }
    // 取最多的字数
    get maxTextLength() {
        let { header, list } = this.data;
        let headerMax = Math.max(...(header || [{}]).map(item => item.label.length));
        let listMax = Math.max(...(list || [{}]).map(item => item.label.length));
        return headerMax > listMax ? headerMax : listMax;
    }
    // 返回填充空格的值，用全角补齐label值
    fillSpace(text) {
        text = text || '';
        return text + [...Array(this.maxTextLength - text.length).keys()].map(item => "　").join("");
    }
    // 改变复选框的值
    checkboxItem(filed, value) {
        let { data } = this.state;
        data.templateContent[filed] = data.templateContent[filed].map(item => {
            item.checked = typeof value === 'boolean' ? value : value.includes(item.value);
            return item;
        })
        this.setState({ data })
    }
    onCancel() {
        if (!this.loadingInstance.loading) {
            this.props.onCancel();
        } else {
            // 先关闭加载效果
            this.loadingInstance.setLoading(false)
        }
    }
}