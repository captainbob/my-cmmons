import React, { Component } from 'react';
import { Select, InputNumber, Icon, Popover } from 'antd';
import getLodop from './lodop';
const Option = Select.Option;
window.LODOP = null;
class Options extends Component {
    constructor(props) {
        super(props);
        this.state = {
            printerIndex: -1,
            paper: this.strPageSizeList(-1)[0],
            direction: 0,
            num: 1,
            columnsNum: 3,
        }
    }
    componentDidMount() {
        this.updateState({ paper: this.state.paper });
    }
    render() {
        let { printerIndex, paper, direction } = this.state;
        window.LODOP = getLodop();
        if (!LODOP){
            return false;
        }
        let iPrinterCount = LODOP.GET_PRINTER_COUNT();
        // 读取默认打印机的序号
        if (printerIndex === -1) {
            ([...Array(iPrinterCount).keys()] || []).forEach((item, i) => {
                if (LODOP.GET_PRINTER_NAME(-1) == LODOP.GET_PRINTER_NAME(i)) {
                    printerIndex = i;
                }
            })
        }
        return <div style={{ marginBottom: 10 }}>
            打印机：
            <Select
                value={printerIndex}
                style={{ width: 190 }}
                dropdownMatchSelectWidth={false}
                onChange={(text) => {
                    let paper = this.strPageSizeList(text).includes('A4') ? 'A4' : this.strPageSizeList(text)[0]
                    this.updateState({ printerIndex: text, paper });
                }}
            >
                {([...Array(iPrinterCount).keys()] || []).map((item, i) =>
                    <Option value={i}>{LODOP.GET_PRINTER_NAME(i)}</Option>
                )}
                <Option value={-99}>预览时选择(需自定表头列数)</Option>
            </Select>

            <div style={{ display: printerIndex !== -99 ? 'inline-block' : 'none' }}>
                &nbsp;&nbsp;纸张：
                    <Select
                    value={paper || (this.strPageSizeList(printerIndex) || [])[0]}
                    style={{ width: 120 }}
                    onChange={(text) => {
                        this.updateState({ paper: text });
                    }}
                >
                    {(this.strPageSizeList(printerIndex) || []).map((item, i) => <Option value={item}>{item}</Option>)}
                </Select>
                &nbsp;&nbsp;方向：
                    <Select
                    value={direction || 0}
                    style={{ width: 80 }}
                    onChange={(text) => {
                        this.updateState({ direction: text });
                    }}
                >
                    <Option value={0}>纵向</Option>
                    <Option value={1}>横向</Option>
                </Select>
                &nbsp;&nbsp;份数：
                    <InputNumber
                    style={{ width: 60 }}
                    placeholder="1"
                    min={1}
                    max={1000}
                    onBlur={(e) => {
                        this.updateState({ num: Number(e.target.value) || 1 });
                    }}
                />
            </div>
            <div style={{ display: printerIndex !== -99 ? 'none' : 'inline-block' }}>
                &nbsp;&nbsp;
                    表头列数：
                    <Select
                    style={{ width: '6em' }}
                    value={this.state.columnsNum}
                    onChange={(text) => {
                        this.updateState({ columnsNum: text });
                    }}
                >
                    {[...Array(12).keys()].map(item => <Option value={item + 1}>{(item + 1) + '列'}</Option>)}
                </Select>
                <Popover placement="right" content={<div style={{ fontSize: '11px' }}>无论纸张大小，都会以 {this.state.columnsNum}列 表头打印</div>} title={null}>
                    <Icon type="question-circle" style={{ marginLeft: 5, color: '#108ee9' }} />
                </Popover>
            </div>
        </div>
    }
    updateState(obj) {
        this.setState(obj, () => {
            if (this.props.onChange) {
                let obj = Object.assign({}, this.state);
                if (obj.printerIndex != -99) {
                    obj.columnsNum = Number(paper.filter(item => item.name == obj.paper).map(item => item.columnsNum).join("").split("|")[obj.direction]);
                    obj.paperWidth = Number(paper.filter(item => item.name == obj.paper).map(item => item.size).join("").split("*")[obj.direction]);
                    obj.paperHeight = Number(paper.filter(item => item.name == obj.paper).map(item => item.size).join("").split("*")[obj.direction ? 0 : 1]);
                } else {
                    obj = {
                        printerIndex: obj.printerIndex,
                        columnsNum: obj.columnsNum
                    }
                }
                this.props.onChange(obj);
            }
        });
    }
    // 获取纸张
    strPageSizeList(printerIndex) {
        if (!LODOP || !LODOP.GET_PAGESIZES_LIST) {
            return false;
        }
        let paperlist = LODOP.GET_PAGESIZES_LIST(printerIndex, "\n").split("\n")
        return paper.map(item => item.name).filter(item => paperlist.map(item => item).includes(item));
    }
}

module.exports = Options;

const paper = [
    { name: 'A0', size: '841*1189', columnsNum: '10|12' },
    { name: 'A1', size: '594*841', columnsNum: '8|10' },
    { name: 'A2', size: '420*594', columnsNum: '7|8' },
    { name: 'A3', size: '297*420', columnsNum: '5|7' },
    { name: 'A4', size: '210*297', columnsNum: '3|5' },
    { name: 'A5', size: '148*210', columnsNum: '3|3' },
    { name: 'A6', size: '105*148', columnsNum: '2|3' },
    { name: 'A7', size: '74*105', columnsNum: '1|2' },
    { name: 'A8', size: '52*74', columnsNum: '1|1' },
    { name: 'A9', size: '37*52', columnsNum: '1|1' },
    { name: 'A10 ', size: '26*37', columnsNum: '1|1' }
]