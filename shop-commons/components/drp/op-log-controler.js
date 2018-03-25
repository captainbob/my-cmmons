import React, { Component } from 'react';
import { fjs } from 'djmodules-utils';
import AppLayout from '../base/app-layout/app-layout';
import { AutoAdjustForm } from 'djmodules';
import CustomTable from './custom-table';
import { Input } from 'antd';
import { compose, map } from 'ramda';

function getPage(page) {
    return {
        total: page.pagination.totalResult || 0,
        currentPage: page.pagination.currentPage,
        dataSource: page.results || []
    }
}

export default class extends Component {
    state = {
        currentPage: 0,
        total: 0,
        showCount: 20,
        query: {},
        dataSource: []
    }

    componentDidMount() {
        this.getPage(1, this.state.showCount, {});
    }

    getPage = (page, showCount, query) => {
        const params = {
            billId: this.props.billId,
            currentPage: page,
            showCount: showCount,
            posData: this.props.dataType,
            ...(query || {})
        };

        compose(map(getPage), map(fjs.http.resultObject({ results: [], pagination: {} })), fjs.http.post('/rs/wms/bill_record/get_bill_oper_log'))(params).then(response => {
            this.setState(response)
        });
    }

    render() {
        return <AppLayout>
            <AppLayout.Filter style={{ padding: 0 }}>
                <AutoAdjustForm nocollapse onSearch={this.onSearch} onClear={this.onClear}>
                    <AutoAdjustForm.Item contentWidth={180} label='商品编码'>
                        <Input style={{ width: 180 }}
                            placeholder='请输入商品编码'
                            onChange={this.onChangeSpuCode}
                            value={this.state.query.spuCode}></Input>
                    </AutoAdjustForm.Item>
                    <AutoAdjustForm.Item contentWidth={180} label='操作人'>
                        <Input style={{ width: 180 }}
                            placeholder='请输入操作人'
                            onChange={this.onChangeOperationName}
                            value={this.state.query.opUser}></Input>
                    </AutoAdjustForm.Item>
                </AutoAdjustForm>
            </AppLayout.Filter>
            <AppLayout.Content>
                <CustomTable pagination={
                    {
                        current: this.state.currentPage,
                        pageSize: this.state.showCount,
                        total: this.state.total,
                        onChange: (page) => {
                            this.getPage(page, this.state.showCount, this.state.query);
                        },
                        showTotal: (total) => {
                            return `总共${total}条`
                        }
                    }
                } columns={this.props.columns || this.columns}
                    dataSource={this.state.dataSource}></CustomTable>
            </AppLayout.Content>
        </AppLayout>
    }

    onSearch = () => {
        this.getPage(1, this.state.showCount, this.state.query);
    }

    onClear = () => {
        this.setState({ query: {} });
        this.getPage(1, this.state.showCount, {});
    }

    onChangeSpuCode = (event) => {
        const query = Object.assign({}, this.state.query, { spuCode: event.target.value });
        this.setState({ query });
    }

    onChangeOperationName = (event) => {
        const query = Object.assign({}, this.state.query, { opUser: event.target.value });
        this.setState({ query });
    }

    columns = [
        {
            title: '操作人',
            key: 'operationName',
            render: (data) => {
                return data.opUser || data.operationName;
            }
        },
        {
            title: '操作时间',
            key: 'operationDate',
            render: (data) => {
                return data.opTime || data.operationDate;
            }
        },
        {
            title: '操作类型',
            key: 'operationTypeName',
            render: (data) => {
                return data.opType || data.operationTypeName;
            }
        },
        {
            title: '货号',
            dataIndex: 'spuCode',
            key: 'spuCode',
        },
        {
            title: '商品名称',
            dataIndex: 'spuName',
            key: 'spuName',
        },
        {
            title: '变更折扣',
            dataIndex: 'settleDiscount',
            key: 'settleDiscount',
        },
        {
            title: 'SKU编码',
            dataIndex: 'skuCode',
            key: 'skuCode',
        },
        {
            title: '变更数量',
            key: 'changeNum',
            render: (data) => {
                return data.skuNum || data.changeNum;
            }

        }
    ]
}