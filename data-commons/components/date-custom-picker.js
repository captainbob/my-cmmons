import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Select, DatePicker } from 'antd';
import moment from 'moment';
import * as utilsCommon from '../utils/common';
import { WeekPicker } from 'djmodules';
// 需要在入口文件加 , 在这个文件加 没有生效；
// moment.locale('zh-cn', { week: { dow: 0 } })

const DateMap = {
    "today": 1,
    "yesterday": 2,
    "last7Day": 3,
    "last30Day": 4,
    "customDay": 5,
    "customWeek": 6,
    "customMonth": 7,
    "custom": 8,
}
const DateDisalbeList = [DateMap["today"], DateMap["yesterday"], DateMap["last7Day"], DateMap["last30Day"]];
const { RangePicker, MonthPicker } = DatePicker;

class DateCustomPicker extends Component {
    static defaultProps = {
        showToday: true,
    }
    static propTypes = {
        defaultValue: PropTypes.array,
        handleChange: PropTypes.func,
        showToday: PropTypes.boolean,
    }

    constructor(props, context) {
        super(props, context);
        const { defaultValue } = this.props;
        const startDay = defaultValue ? defaultValue[0] : moment();
        const endDay = defaultValue ? defaultValue[1] : moment();
        this.state = {
            dateType: DateMap["custom"],
            startDay,
            endDay,
        }
    }

    render() {
        const { showToday } = this.props;
        let style = this.props.style || {};
        Object.assign(style, { zIndex: 999999 });
        return (
            <div style={style}>
                <Select defaultValue={DateMap["custom"]} onChange={this.onChangeSelect}
                    style={{ width: 84 }}
                >
                    {showToday ? <Option value={DateMap["today"]}>今日</Option> : undefined}
                    <Option value={DateMap["yesterday"]}>昨日</Option>
                    <Option value={DateMap["last7Day"]}>最近7天</Option>
                    <Option value={DateMap["last30Day"]}>最近30天</Option>
                    <Option value={DateMap["customDay"]}>自然日</Option>
                    {/* <Option value={DateMap["customWeek"]}>自然周</Option> */}
                    <Option value={DateMap["customMonth"]}>自然月</Option>
                    <Option value={DateMap["custom"]}>自定义</Option>
                </Select>
                &nbsp;&nbsp;
                {this.DateTypePicker}
                &nbsp;&nbsp;
            </div>
        );
    }

    get DateTypePicker() {
        let dateTypeComponent
        switch (this.state.dateType) {
            case DateMap["customDay"]:
                dateTypeComponent = <DatePicker
                    placeHolder='请选择自然日'
                    value={this.state.startDay}
                    format='YYYY年MM月DD日'
                    style={{ width: 267 }}
                    allowClear={false}
                    disabledDate={utilsCommon.disableAfter}
                    onChange={(date) => { this.changeDateOfState([date, date]) }}
                />
                break;
            case DateMap["customWeek"]:
                dateTypeComponent = <div style={{ display: "inline-block", verticalAlign: "top" }}>
                    <WeekPicker
                        placeHolder='请选择自然周'
                        allowClear={false}
                        format='YYYY年MM月DD日'
                        width={267}
                        onChange={(startDate, endDate) => {
                            if (!startDate) {
                                startDate = moment();
                                endDate = moment();
                            }
                            this.changeDateOfState([startDate, endDate])
                        }}>
                    </WeekPicker>
                </div>
                break;
            case DateMap["customMonth"]:
                dateTypeComponent = <MonthPicker
                    allowClear={false}
                    style={{ width: 267 }}
                    disabledDate={utilsCommon.disableAfterMonth}
                    value={this.state.startDay}
                    disable={DateDisalbeList.includes(this.state.dateType)}
                    format='YYYY年MM月'
                    onChange={(value) => {
                        // let startDay = value.startOf("month");
                        // let endDay = value.endOf("")
                        this.changeDateOfState([value.clone().startOf("month"), value.endOf("month")])
                    }}
                />
                break;
            case DateMap["custom"]:
                dateTypeComponent = <RangePicker
                    allowClear={false}
                    format='YYYY年MM月DD日'
                    value={[this.state.startDay, this.state.endDay]}
                    disabledDate={this.props.showToday ? utilsCommon.disableAfterToday : utilsCommon.disableAfter}
                    disable={DateDisalbeList.includes(this.state.dateType)}
                    onChange={this.changeDateOfState}
                />
                break;
            case DateMap["today"]:
            case DateMap["yesterday"]:
            case DateMap["last7Day"]:
            case DateMap["last30Day"]:
            default:
                dateTypeComponent = <RangePicker
                    format='YYYY年MM月DD日'
                    allowClear={false}
                    value={[this.state.startDay, this.state.endDay]}
                    disabledDate={this.props.showToday ? utilsCommon.disableAfterToday : utilsCommon.disableAfter}
                    disable={DateDisalbeList.includes(this.state.dateType)}
                />
                break;
        }
        return dateTypeComponent
    }

    onChangeSelect = (value) => {
        let showToday = this.props.showToday;
        let startDay = moment();
        let endDay = moment();
        switch (value) {
            case DateMap["today"]:
                break;
            case DateMap["yesterday"]:
                startDay.subtract(1, 'd');
                endDay.subtract(1, 'd');
                break;
            case DateMap["last7Day"]:
                startDay.subtract(7, 'd');
                if (!showToday) {
                    startDay.subtract(8, 'd');
                    endDay.subtract(1, 'd');
                }
                break;
            case DateMap["last30Day"]:
                startDay.subtract(30, 'd');
                if (!showToday) {
                    startDay.subtract(31, 'd');
                    endDay.subtract(1, 'd');
                }
                break;
            case DateMap["customDay"]:
                startDay = startDay.startOf('day');;
                endDay = endDay.endOf("day");
                // 选择的是昨日
                startDay.subtract(1, 'd');
                endDay.subtract(1, 'd');
                break;
            case DateMap["customWeek"]:
                // 特殊    
                startDay = moment();
                endDay = moment();
                break;
            case DateMap["customMonth"]:
                startDay = startDay.subtract(1, 'months').startOf('month');
                endDay = endDay.subtract(1, 'months').endOf("month");
                break;
            case DateMap["custom"]:
                if (!showToday) {
                    startDay.subtract(1, 'd');
                    endDay.subtract(1, 'd');
                }
                break;
            default:
                break;
        }

        this.setState({
            dateType: value
        }, () => {
            this.changeDateOfState([startDay, endDay])
        });
    }

    changeDateOfState = (dates) => {
        const { handleChange } = this.props
        this.setState({
            startDay: dates[0],
            endDay: dates[1],
        }, () => {
            handleChange(dates)
        });
    }
}

export default DateCustomPicker;