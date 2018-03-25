import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Popover, Checkbox, Icon, Button } from 'antd';

const CheckboxGroup = Checkbox.Group;
const ButtonGroup = Button.Group;

class CheckColumnsView extends Component {
    static defaultProps = {
        allColumns: [],
        style: { float: "right", lineHeight: "28px" },
    }
    static propTypes = {
        allColumns: PropTypes.array,   // 所有的列
        onChange: PropTypes.func,      // 修改后的方法
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            allColumns: props.allColumns, // 所有的列
            checkAllStatus: false,//全选
        }
    }
    componentDidMount() {
        let { onChange } = this.props;
        if (typeof onChange === 'function')
            onChange(this.columns)
    }

    render() {
        return (
            <div style={this.props.style}>
                <Popover content={this.showColumns} placement="bottomRight">
                    <a>显示字段<Icon type="down" /></a>
                </Popover>
            </div>
        );
    }
    // 选择框
    get showColumns() {
        let columns = this.state.allColumns;
        return (
            <div style={{ width: 300 }}>
                <div style={{ padding: "5px 10px" }}>
                    <Checkbox checked={this.state.checkAllStatus} onClick={this.onChangeAllCheckStatus}>全选</Checkbox>
                </div>
                {columns.map(v => {
                    return <Checkbox
                        style={{ width: 140 }}
                        checked={!v.unChecked}
                        disabled={v.disabled}
                        onChange={(e) => this.onChangeShowColumns(e.target.checked, v.key)}
                    >{v.title}</Checkbox>
                })}
            </div>
        )
    }
    // 显示的列
    get columns() {
        return this.state.allColumns.filter(v => !v.unChecked)
    }
    onChangeAllCheckStatus = (e) => {
        let value = e.target.checked;
        this.setState({
            checkAllStatus: value
        }, () => {
            value ? this.onChangeAllCheck(value) : this.onChangeAntiCheck(value);
        });
    }
    // 反选
    onChangeAntiCheck = (value) => {
        let { allColumns } = this.state;
        let { onChange } = this.props;
        allColumns.forEach((v) => {
            if (!v.disabled) {
                v.unChecked = !v.unChecked;
            }
        });

        this.setState({
            allColumns,
        }, () => {
            if (typeof onChange === 'function')
                onChange(this.columns)
        });
    }
    // 全选
    onChangeAllCheck = (value) => {
        let { allColumns } = this.state;
        let { onChange } = this.props;
        allColumns.forEach((v) => {
            v.unChecked = false;
        });

        this.setState({
            allColumns,
        }, () => {
            if (typeof onChange === 'function')
                onChange(this.columns)
        });
    }
    // 点击选择框中的事件
    onChangeShowColumns = (isChecked, key) => {
        let { allColumns } = this.state;
        let { onChange } = this.props;
        allColumns.forEach((v) => {
            if (v.key == key) {
                v.unChecked = !isChecked
            }
        });
        this.setState({
            allColumns
        }, () => {
            if (typeof onChange === 'function') {
                onChange(this.columns)
            }
            this.monitorCheckAllStatus();
        });
    }
    // 检测全选状态
    monitorCheckAllStatus = () => {
        let { allColumns, checkAllStatus } = this.state;
        let flag = true; // 判断是否要全选
        allColumns.every((v) => {
            if (v.unChecked == true) {
                flag = false
                return false
            }
            return true
        });
        if (flag != checkAllStatus) {
            this.setState({
                "checkAllStatus": flag
            });
        }
    }

}

export default CheckColumnsView;