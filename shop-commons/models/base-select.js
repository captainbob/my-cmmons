import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox, Select } from 'antd';
export class BaseSelectVM {
    // 有一个使用规范，外部的数据要用初始化转化，里面的又要id字段，
    selectedIdsSet = new Set();
    // 已选内容
    @observable selectedIds = [];
    // 全选本页标志
    @observable selectThisPageFlag = false;
    // 全选全部标志
    @observable selectAllPageFlag = false;
    // datas 本页数据
    @observable datas = [];

    constructor(datas = []) {
        this.datas = datas
    }
    // format raw data to has id
    formatRawData = (datas) => {

    }
    // 全选本页操作
    @action
    toggleSelectCurrentPage = (flag) => {
        this.selectAllPageFlag = false;
        const selected = this.selectThisPageFlag = flag;
        if (selected) {
            this.datas.forEach(v => this.selectedIdsSet.add(v.id));
        } else {
            this.datas.forEach(v => this.selectedIdsSet.delete(v.id));
        }
        this.selectedIds = Array.from(this.selectedIdsSet)
    }
    // 全选全部操作
    @action
    toggleSelectAllPage = (flag) => {
        this.selectAllPageFlag = flag;
        this.selectThisPageFlag = false;
        this.selectedIdsSet.clear();
        this.selectedIds = [];
    }
    // 单选操作
    @action
    toggleSelectItem = (id) => {
        if (this.selectedIdsSet.has(id)) {
            this.selectedIdsSet.delete(id);
        } else {
            this.selectedIdsSet.add(id)
        }
        this.selectedIds = Array.from(this.selectedIdsSet)
        this.monitorSelectThisPageStatus();
    }

    // 监控单选造成的全选
    @action
    monitorSelectThisPageStatus = () => {
        if (this.datas.length == 0) {
            this.selectThisPageFlag = false;
            return;
        }
        const notSelectedData = this.datas.find((v) => {
            return !this.selectedIds.includes(v.id)
        });

        if (notSelectedData) {
            this.selectThisPageFlag = false
        } else {
            this.selectThisPageFlag = true
        }
    }

    // 初始化数据
    @action
    initData = () => {
        this.selectedIds = [];
        this.selectedIdsSet.clear();
        this.selectThisPageFlag = false;
        this.selectAllPageFlag = false;
    }
}
@observer
export class BaseSelectView extends Component {
    state = {
        selectFlag: "1", // 1 选择本页，2 选择全部
    }

    render() {
        const { selectVM } = this.props;
        // 因为mobx-react的机制，所以有下面的这段
        const { selectThisPageFlag, selectAllPageFlag } = selectVM;
        let style = Object.assign({
            display: 'inline-block'
        }, this.props.style)
        return (
            <div style={style}>
                <Checkbox
                    checked={this.state.selectFlag == '1' ? selectThisPageFlag : selectAllPageFlag}
                    onChange={(e) => this.onChangeCheckboxPageFlag(e.target.checked)}
                ></Checkbox>
                <Select
                    value={this.state.selectFlag}
                    onChange={this.onChangeSelectFlag}
                    style={{
                        marginRight: 15
                    }}
                >
                    <Select.Option value='1'>本页</Select.Option>
                    <Select.Option value='2'>全部</Select.Option>
                </Select>
            </div>
        );
    }
    onChangeSelectFlag = (value) => {
        const { selectVM } = this.props;
        const { selectThisPageFlag, selectAllPageFlag, initData, toggleSelectCurrentPage, toggleSelectAllPage } = selectVM

        this.setState({
            selectFlag: value
        }, () => {
            var checked = selectAllPageFlag || selectThisPageFlag;
            if (checked && value == '1') {
                toggleSelectCurrentPage(true)
            }
            if (checked && value == '2') {
                toggleSelectAllPage(true)
            }
            if (!checked) {
                initData()
            }
        });
    }
    onChangeCheckboxPageFlag = (checked) => {
        const { selectVM } = this.props;
        const { toggleSelectCurrentPage, toggleSelectAllPage } = selectVM;

        if (this.state.selectFlag == '1') {
            toggleSelectCurrentPage(checked)
        } else {
            toggleSelectAllPage(checked)
        }
    }
}

BaseSelectView.propTypes = {
    selectVM: PropTypes.object
};
