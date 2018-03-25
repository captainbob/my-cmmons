import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';
import CustomTable from './custom-table'
import InputNumber from './input-number'
import _ from 'lodash';

export default class SpuEdit extends Component {

    state = {
    }

    componentWillMount() {
    }
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return <div>
            {(this.props.spu || []).map(item =>
                <div>
                    <Row type="flex" justify="space-between" align="middle">
                        <Col style={{ overflow: 'hidden', margin: '15px 0' }}>
                            <div style={{ float: 'left', width: 80, height: 80, overflow: 'hidden', background: '#f3f3f3' }}>
                                <img src="https://img.dianjia.io/test/10026/spu/11467105776757.jpg" style={{ width: '100%', height: '100%' }} />
                            </div>
                            <div style={{ marginLeft: 90, lineHeight: 2 }}>
                                <h4 style={{ fontSize: 1.2 }}>{item.spuName}</h4>
                                <div>类目：裙装 </div>
                                <div>货号：{item.spuCode}</div>
                            </div>
                        </Col>
                        <Col>
                            吊牌价：{item.suggestPrice && item.suggestPrice.amount}&nbsp;&nbsp;&nbsp;&nbsp;库存数量：{item.realNum}
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ background: '#f3f3f3', padding: 10 }}>整款数据</Col>
                        <Col>
                            <Table size="middle"
                                dataSource={this.convertSkc(item.skcList)}
                                columns={this.columns}
                                bordered
                                pagination={false}
                            />
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    }
    get columns() {
        let skus = this.skus;
        let editType = this.props.editType || '入库';
        return [].concat([{
            title: center('颜色/尺码'),
            dataIndex: 'colorName',
            key: 'colorsize',
            width: 16 * 5
        }]).concat((skus || []).map((item, i) => {
            if (this.props.refBillId) {
                return {
                    title: center(item),
                    children: [{
                        title: center('单据数'),
                        dataIndex: `billNum_${item}`,
                        key: `${i}-1`,
                        width: 80,
                        render: text => center(text)
                    }, {
                        title: center(`${editType}数`),
                        dataIndex: `paperNum_${item}`,
                        key: `${i}-2`,
                        width: 80,
                        render: (text, record, index) => <InputNumber scope={this} row={index} col={i} value={text}
                            style={{ width: '100%', textAlign: 'center' }}
                            onChange={(value) => {
                                this.onChange(record.skuList[i], value);
                            }} />
                    }, {
                        title: center('差异数'),
                        dataIndex: `diffNum_${item}`,
                        key: `${i}-3`,
                        width: 80,
                        render: text => center(text)
                    }]
                }
            } else {
                return {
                    title: center(item),
                    children: [{
                        title: center(`${editType}数`),
                        dataIndex: `paperNum_${item}`,
                        key: `${i}-2`,
                        width: 80,
                        render: (text, record, index) => <InputNumber scope={this} row={index} col={i} value={text}
                            style={{ width: '100%', textAlign: 'center' }}
                            onChange={(value) => {
                                this.onChange(record.skuList[i], value);
                            }} />
                    }]
                }
            }
        }))
    }
    onChange = (record, value) => {
        if (this.props.onChange) {
            this.props.onChange({
                spuId: record.spuId,
                colorId: record.colorId,
                skuId: record.skuId,
                value
            });
        }
    }
    convertSkc(data) {
        data = JSON.parse(JSON.stringify(data));
        return (data || []).map(itm => {
            (itm.skuList || []).forEach(iem => {
                itm[`billNum_${iem.sizeName}`] = iem.billNum;
                itm[`paperNum_${iem.sizeName}`] = iem.paperNum;
                itm[`diffNum_${iem.sizeName}`] = iem.diffNum;
            });
            return itm;
        });
    }
    get skus() {
        let skus = [];
        (this.props.spu || []).forEach(item => {
            (item.skcList || []).forEach(itm => {
                (itm.skuList || []).forEach(iem => {
                    skus.push(iem);
                });
            });
        });
        return Object.keys(_.groupBy(skus, "sizeName"));
    }
}
const center = (text) => <div style={{ textAlign: 'center' }}>{text}</div>
