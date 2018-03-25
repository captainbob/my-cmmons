import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Modal, Table, Row, Col, Input, Checkbox, Radio, message, Popconfirm, Select } from 'antd';
import moment from 'moment';
import { Helper } from 'djmodules-utils';
// import { Loading, Ajax, RootSpin } from 'djexports-commons';

import Loading from '../../../../view-models/load';
import RootSpin from '../../../base/root-spin';
import Ajax from '../../../../utils/ajax';
import PrintFiledV from './print-field-v';
import { Options } from '../index';
import Template1V from './template/template1-v';
const RadioGroup = Radio.Group;
const Option = Select.Option;

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            printData: this.props.data || {}
        }
    }
    loadingInstance = Loading.getInstance();
    // 读取配制文件
    get config() {
        let templateType = this.props.templateType || this.props.printConfig.templateType;  //模板业务类型
        return {
            templateType
        }
    }
    componentDidMount() {
        this.requestList();
        this.printError();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            this.requestList();
        }
    }
    render() {
        let { loading } = this.loadingInstance;
        let title = this.props.title || (this.props.printConfig && this.props.printConfig.title);
        return (
            <Modal
                maskClosable={false}
                title={title || "打印配置"}
                visible={this.props.visible}
                width={this.props.width || "90%"}
                style={this.props.style || { maxWidth: 660 }}
                confirmLoading={loading}
                footer={null}
                onCancel={() => this.onCancel()}
            >
                <RootSpin>
                    <Options
                        onChange={(printConfig) => {
                            this.setState({ printConfig });
                        }}
                    />
                    {!window._printError ? "" : <div id="_printError" style={{ color: '#C00', paddingBottom: 10 }}></div>}
                    <div style={{ minHeight: 90 }}>
                        <Table size="middle"
                            dataSource={this.state.dataSource || []}
                            columns={this.columns}
                            pagination={false}
                        />
                    </div>
                    <Row type="flex" align="middle" style={{ marginTop: 10 }}>
                        <Col span={2}>
                            <a
                                ref="javascript:;"
                                onClick={() => {
                                    this.addTemplate(() => {
                                        this.requestList();
                                    })
                                }}
                            >新增</a>
                        </Col>
                        <Col span={22} style={{ textAlign: 'right' }}>
                            {this.tmpType != '20--暂时不显示使用' ? '' :
                                <Checkbox onChange={() => {
                                    this.setState({ allPrint: true });
                                }}>单表头打印</Checkbox>
                            }
                            {window._printError || !this.state.dataSource || !this.state.dataSource.length ? '' :
                                <Template1V
                                    text={"打印"}
                                    isTable={!(['20'].includes(this.tmpType) && this.state.allPrint)}
                                    title={this.props.printTitle || (this.props.printConfig && this.props.printConfig.printTitle)}
                                    size={this.props.buttonSize || (this.props.printConfig && this.props.printConfig.buttonSize)}
                                    data={this.state.printData}
                                    config={this.currentConfig}
                                />
                            }
                            &nbsp;&nbsp;
                            <Button onClick={() => this.onCancel()}
                            >关闭</Button>
                        </Col>
                    </Row>
                </RootSpin>

                <PrintFiledV
                    visible={this.state.filedVisible}
                    data={JSON.parse(JSON.stringify(this.state.currentData || {}))}
                    onSave={(item) => {
                        this.modifyTemplate({
                            templateId: item.templateId,
                            templateName: item.templateName,
                            templateContent: JSON.stringify(item.templateContent || {}),
                        }, () => {
                            message.destroy();
                            message.success("保存成功");
                            this.requestList();
                        });
                    }}
                    onCancel={() => {
                        this.setState({ filedVisible: false });
                    }}
                />
            </Modal>
        );
    }
    get tmpType() {
        return String(this.state.currentFormat || '').split("-")[1];
    }
    columns = [{
        title: '模板名称',
        dataIndex: 'templateName',
        key: 'templateName',
        render: (text, item, index) => <div>
            <Input
                placeholder="请输入模板名称"
                maxLength={15}
                value={text}
                onChange={(e) => {
                    let { dataSource } = this.state;
                    dataSource[index].templateName = e.target.value;
                    this.setState({ dataSource });
                }}
                onBlur={(e) => {
                    if (item.templateName != item._templateName) {
                        let templateContent = {};
                        if (item.templateContent && Object.keys(item.templateContent || {}).length) {
                            templateContent = item.templateContent;
                        } else {
                            templateContent = this.printConfig.defaultFiled || {};
                        }
                        this.modifyTemplate({
                            templateId: item.templateId,
                            templateName: e.target.value,
                            templateContent: JSON.stringify(templateContent),
                        }, () => {
                            message.destroy();
                            message.success("保存成功");
                            this.requestList();
                        });
                    }
                }}
            />
        </div>
    }, {
        title: '格式选择',
        dataIndex: 'format',
        width: 270,
        key: 'format',
        render: (value, item) => <div>
            <RadioGroup
                value={this.state.currentFormat}
                onChange={(e) => {
                    let { checked, value } = e.target;
                    this.modifyFormat({
                        templateId: item.templateId,
                        formatOption: value,
                    }, () => {
                        this.requestList();
                    })
                }}
            >
                {(this.plainOptions || []).map(itm => {
                    return <Radio value={`${item.templateId}-${itm.value}`}>{itm.label}</Radio>
                })}
            </RadioGroup>
        </div>
    }, {
        title: '操作',
        dataIndex: 'templateId',
        width: 140,
        key: 'templateId',
        render: (text, item) => <div style={{ textAlign: 'center' }}>
            <Button size="small"
                onClick={() => {
                    this.setState({ filedVisible: true, currentData: item });
                }}
            >编辑字段</Button>
            &nbsp;&nbsp;
            <Popconfirm title="确定要删除吗？" onConfirm={() => {
                this.deleteFormat({ templateId: text }, () => {
                    this.requestList();
                })
            }} okText="确定" cancelText="取消">
                <Button size="small">删除</Button>
            </Popconfirm>
        </div>
    }]
    // 获取打印配制及数据信息
    get currentConfig() {
        let { currentFormat, dataSource, printConfig } = this.state;
        currentFormat = currentFormat.split("-");
        dataSource = dataSource.filter(item => item.templateId == currentFormat[0]);
        return {
            printFormat: Number(currentFormat[1]) || 10,
            printConfig,
            header: dataSource[0].templateContent.header.filter(item => item.checked),
            columns: dataSource[0].templateContent.list.filter(item => item.checked),
        };
    }
    // 获取打印初始配制和接口数据
    get printConfig() {
        let printConfig = this.props.printConfig || {};
        return {
            ...printConfig
        }
    }
    // 查询模板列表
    requestList() {
        Ajax('/rs/print/template/get_template_list', {
            loading: true,
            data: {
                templateType: this.config.templateType,
            }
        }).then(res => {
            let { currentFormat } = this.state;
            let dataSource = (res || []).map((item, i) => {
                let formatOption = item.formatAtom && item.formatAtom.formatOption;
                let data = Object.assign({ formatOption }, item.templateAtom || {});
                data.key = i;
                data._templateName = data.templateName;
                data.templateContent = JSON.parse(data.templateContent || '{}');
                data = JSON.parse(JSON.stringify(data));
                // 如果都未设置，选择么一项的第一个
                if (i === 0 || formatOption) {
                    currentFormat = formatOption || data.templateId + '-10';
                }
                return data;
            });
            this.setState({
                dataSource,
                currentFormat
            }, () => {
                // 获取并设置打印数据
                let params = this.printConfig.api && this.printConfig.api.params;
                let { printData } = this.state;
                if (params && (!printData || JSON.stringify(printData || []) === '{}')) {
                    console.log("11111")
                    this.printData(params, (printData) => {
                        this.setState({ printData });
                    });
                }
            })
        })
    }
    // 添加模板
    addTemplate(callback) {
        if (this.loadingInstance.loading) {
            return false;
        }
        Ajax('/rs/print/template/add_template', {
            method: 'POST',
            loading: true,
            data: {
                templateType: this.config.templateType,
                templateContent: JSON.stringify(this.printConfig.defaultFiled || {})
            }
        }).then(res => {
            return callback ? callback() : null
        })
    }
    // 修改模板
    modifyTemplate(data, callback) {
        if (this.loadingInstance.loading) {
            return false;
        }
        data = Object.assign({ templateType: this.config.templateType }, data);
        Ajax('/rs/print/template/modify_template', {
            method: 'POST',
            loading: true,
            data
        }).then(res => {
            return callback ? callback() : null
        })
    }
    // 选择格式
    modifyFormat(data, callback) {
        Ajax('/rs/print/template/do_format', {
            method: 'POST',
            loading: true,
            data
        }).then(res => {
            return callback ? callback() : null
        })
    }
    // 删除模板
    deleteFormat(data, callback) {
        Ajax('/rs/print/template/remove_print', {
            method: 'POST',
            loading: true,
            data
        }).then(res => {
            return callback ? callback() : null
        })
    }
    // 请求打印数据
    printData(data, callback) {
        let url = this.printConfig.api && this.printConfig.api.url;
        if (url) {
            Ajax(url, {
                method: 'GET',
                loading: true,
                data
            }).then(res => {
                return callback ? callback(res) : null
            });
        }
    }
    onCancel() {
        if (!this.loadingInstance.loading) {
            this.props.onCancel();
        } else {
            // 先关闭加载效果
            this.loadingInstance.setLoading(false)
        }
    }
    // 显示打印错误信息
    printError() {
        setTimeout(() => {
            let perr = document.getElementById("_printError");
            if (perr) {
                perr.innerHTML = window._printError;
            }
        }, 300)
    }

    plainOptions = [{
        label: '格式一',
        value: '10'
    }, {
        label: '格式二',
        value: '20'
        // }, {
        //         label: 'SKC',
        //         value: '21',
    }, {
        label: '格式三',
        value: '30'
    }]
}
