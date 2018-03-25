import { Component } from 'react';
import { Table } from 'antd';
import { HTML } from '../../../printer/index';
import _ from 'lodash';

const FONTSIZE = 10;
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        let { config, data } = this.props;
        let { columnsNum, paperWidth, paperHeight } = config.printConfig;
        var rowHeight = 16;
        let headerHeight = 0;
        let wholeRowLength = ((config && config.header) || []).filter(item => item.wholeRow).length;
        let length = ((config && config.header) || []).length - wholeRowLength;
        if (length) {
            headerHeight = parseInt(length / columnsNum) * rowHeight;
            if (length % columnsNum) {
                headerHeight += rowHeight;
            }
        }
        if (wholeRowLength) {
            headerHeight += wholeRowLength * rowHeight;
        }
        headerHeight += rowHeight + 10;
        let { isTable } = this.props;
        let marginBottom = FONTSIZE > 10 ? 50 : 30;
        if (config.printFormat == '20') {
            marginBottom += this.maxSkuLength(data) * (FONTSIZE > 10 ? 50 : 40);
        }
        return (
            <HTML
                isTable={typeof isTable === 'boolean' ? isTable : true}
                printConfig={Object.assign(
                    {
                        printFormat: config.printFormat
                    }, config.printConfig)}
                columnsLength={this.columns.length}
                marginBottom={marginBottom}
                buttonOptions={{
                    disabled: !this.toData || !this.toData.length,
                    title: !this.toData || !this.toData.length ? '无数据，不能打印' : '',
                    children: this.props.text || '打印',
                    type: this.props.type || 'primary',
                    size: this.props.size || 'default',
                    onClick: (event, html) => {
                        // document.getElementsByTagName('html')[0].style = '';
                        // document.getElementsByTagName('html')[0].innerHTML = html;
                    }
                }}
                headCount={`<div>
                    <h3 style="text-align:center;padding:0;margin:0;padding-bottom:6px">${this.props.title || ''}</h3>
                    <div style="overflow:hidden;line-height:${FONTSIZE + 4}px">
                    ${((config && config.header) || []).map((item, i) => {
                        let style = `float:left;overflow:hidden;font-size:${`${FONTSIZE}px`};min-height:${rowHeight}px;height:${item.wholeRow ? "auto" : (rowHeight + 'px')};width:${(item.wholeRow) ? 100 : (100 / columnsNum)}%;`;
                        return `<div style="${style}">${item.label}：${(data && data[item.value]) || ''}</div>`
                    }).join("")}
                    </div>
                </div>`
                }
                top={headerHeight}
                paperWidth={paperWidth}
                paperHeight={paperHeight}
            >
                <Table size="middle"
                    columns={this.columns}
                    dataSource={this.toData}
                    bordered={true}
                    showHeader={![30].includes(config.printFormat)}
                    pagination={false}
                />
            </HTML>
        );
    }
    get columns() {
        let { config, data } = this.props;
        let columns = (config && config.columns) || [];
        let maxSkuLength = this.maxSkuLength(data);
        // console.log('maxSku:', maxSkuLength)
        // 有合并成首行的格式时，取消首行显示的列和当前格式值不打印的列（如格值30时，不打印spu维度的结算单价）
        columns = columns.filter(item => config.printFormat <= 20 ? true : !item.megerRow)
            // 排除在当前模板下不显示的字段
            .filter(item => !item.level || (item.level && item.level[config.printFormat] !== false))
            .map(item => {
                return (item.value == 'sizeName' && [30].includes(config.printFormat) ? [] : [{
                    title: item.label,
                    dataIndex: item.value,
                    key: item.value,
                    megerCol: item.megerCol,
                    prefix: item.prefix,
                    suffix: item.suffix,
                    style: item.style,
                    render: (value, row, index) => {
                        return this.tableRender(item.value, value, row, index);
                    }
                }]).concat(item.count && [20].includes(config.printFormat) ? [{   //格式值20时，展示合计字段
                    title: (item.count && item.count.title) || '合计',
                    dataIndex: 'count_' + ((item.count && item.count.value) || item.value),
                    key: 'count_' + ((item.count && item.count.value) || item.value),
                    megerCol: (item.count && (item.count.megerCol || item.count.level)) || item.megerCol || item.level,
                    prefix: item.prefix,
                    suffix: item.suffix,
                    style: item.style,
                    render: (value, row, index) => {
                        return this.tableRender('count_' + ((item.count && item.count.value) || item.value), value, row, index);
                    }
                    // 将sku组合成列
                }] : []).concat(item.value == 'sizeName' && [30].includes(config.printFormat) ? (maxSkuLength > 0 ? [...Array(maxSkuLength).keys()] : [0]).map(im => {
                    // 组合最大sku数列 
                    return {
                        title: '',  // 'sku' + (im + 0),
                        dataIndex: 'sku' + im,
                        key: 'sku' + im,
                        render: (value, row, index) => {
                            return this.tableRender('sku' + im, value, row, index);
                        },
                    }
                }) : []);
            });
        // console.log(444, _([]).concat(...columns).value())
        return _([]).concat(...columns).value();    //将子数组合并到一起
    }
    get toData() {
        let { data, config } = this.props;
        let printFormat = String(config.printFormat);
        let columns = (config && config.columns) || [];
        let list = [], count = {};
        ((data && data.spuList) || []).forEach((item, i) => {
            //格式值21，30时，单独拆分指定值为一行
            if ([21, 30].includes(config.printFormat)) {
                let colKeyName = this.columns.filter((tem, t) => t < 1).map(tem => tem.dataIndex);
                let _value = <div style={{ textAlign: 'center', padding: 5, fontWeight: 'bold' }}>{columns.filter(tem => tem.megerRow).map(tem => item[tem.value]).join("/")}</div>;
                // 获取在当前模板下不显示的字段列数
                let noCol = columns.filter(item => !item.level || (item.level && item.level[config.printFormat] !== false)).length;
                list.push({ [colKeyName]: _value, ['colSpan_' + colKeyName]: this.columns.length + noCol });
                if ([30].includes(config.printFormat)) {
                    // 去重提取sku名称
                    let sku = [];
                    (item.skcList || []).forEach(it => {
                        (it.skuList || []).forEach(ie => {
                            sku.push(ie);
                        });
                    });
                    var skuname = Object.keys(_.groupBy(sku, 'sizeName'));
                    // 将sku名称写入成行数据，便于展现
                    var skuTitle = { skuname };
                    skuname.forEach((it, j) => {
                        skuTitle['sku' + j] = <div style={{ textAlign: 'center' }}><b style={this.nowrap(it)}>{it}</b></div>;
                    });
                    // 复制表头，将sku名称合并进去成一条数据
                    var columnsValue = this.columns.map(it => {
                        return {
                            [it.dataIndex]: <b style={Object.assign({ padding: 2, textAlign: 'center' }, this.nowrap(it.title))}>{it.title}</b>
                        }
                    })
                    list.push(Object.assign(...columnsValue, skuTitle));
                }
            }
            ((item && item.skcList) || []).forEach((itm, j) => {
                if ([30].includes(config.printFormat)) {
                    let record = {};
                    // console.log("skuname:", skuname);
                    // 获取要读取的sku字段，有时候会有多个，如：入库数、差异数等
                    let skuFiled = columns.filter(it => it[printFormat]).map(it => it[printFormat]);
                    // 组成数组形式便于读取数据时遍历
                    skuFiled = skuFiled.map(it => {
                        if (typeof it === 'string') {
                            return [['', it]]
                        }
                        return Object.keys(it).map((im, l) => [im, Object.values(it)[l]])
                    })
                    // 除去列头没有的字段
                    skuFiled = (skuFiled[0] || []).filter(it => {
                        return this.columns.map(im => im.dataIndex).includes(it[1])
                    });
                    // 将sku值组合起来
                    [...Array(this.maxSkuLength(data)).keys()].forEach(it => {
                        // 写入到sku序列字段中去
                        let sizename = itm.skuList.filter(im => im.sizeName == skuname[it]);    // 读取sku名称相等的记录
                        if (skuFiled.length == 1) {
                            record['sku' + it] = <div style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                                {sizename.map(im => im[skuFiled[0][1]]).join("")}
                            </div>
                            // } else if (skuFiled.length > 1 && sizename.length) {
                        } else if (skuFiled.length > 1) {
                            record['sku' + it] = <table style={{ width: '100%' }}>
                                <tr>{skuFiled.map(ie => {
                                    return <td style={{
                                        width: (100 / skuFiled.length) + '%',
                                        whiteSpace: 'nowrap',
                                        textAlign: 'center',
                                    }}><span style={{ display: 'block', padding: 2 }}>{!sizename || !sizename.length ? '　' : ie[0]}</span></td>
                                })}</tr>
                                <tr>{skuFiled.map(ie => {
                                    let val = sizename.map(im => im[ie[1]]).join("");
                                    return <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                                        <div style={{ minWidth: '2em', padding: 2 }}>{!sizename || !sizename.length ? '　' : val}</div>
                                    </td>
                                })}</tr>
                            </table>
                        }
                    });
                    //写入其它的列值
                    columns.forEach(im => {
                        record[im.value] = this.domValue(this.amount(itm[im.value]), im.prefix, im.suffix, im.style);
                    })
                    list.push(record);
                } else {
                    let rowspan = (item.skcList || []).map(it => (it.skuList || []).length).reduce(function (a, b) {
                        return a + b;
                    });
                    ((itm && itm.skuList) || []).forEach((iem, k) => {
                        let record = {};
                        columns.forEach(im => {
                            // if (im.level && im.level == "spuList")  {
                            if (im.level && (im.level == "spuList" || im.level[printFormat] == "spuList")) {
                                record[im.value] = this.domValue(this.amount(item[im.value]), im.prefix, im.suffix, im.style);
                                // } else if (im.level && im.level == 'skcList') {
                            } else if (im.level && (im.level == 'skcList' || im.level[printFormat] == "skcList")) {
                                record[im.value] = this.domValue(this.amount(itm[im.value]), im.prefix, im.suffix, im.style);
                            } else {
                                record[im.value] = this.domValue(this.amount(iem[im.value]), im.prefix, im.suffix, im.style);
                            }
                            if (im.count && (im.count.level == 'skcList' || im.level == 'skcList' || im.level[printFormat] == 'skcList')) {
                                record['count_' + im.value] = this.domValue(this.amount(itm[im.value]), im.prefix, im.suffix, im.style);
                            } else if (im.count && (im.count.level == 'skuList' || im.level == 'skuList' || im.level[printFormat] == "skuList")) {
                                record['count_' + im.value] = this.domValue(this.amount(iem[im.value]), im.prefix, im.suffix, im.style);
                            } else if (im.count) {
                                record['count_' + im.value] = this.domValue(this.amount(item[im.value]), im.prefix, im.suffix, im.style);
                            }
                        });
                        list.push(Object.assign(record,
                            // spu的合并行
                            j === 0 && k === 0 ? this.mergeCol('spuList', rowspan) : {},
                            j > 0 || k > 0 ? this.mergeCol("spuList", 0) : {},
                            // skc的合并行
                            k === 0 ? this.mergeCol("skcList", (itm.skuList && itm.skuList.length)) : {},
                            k > 0 ? this.mergeCol("skcList", 0) : {}
                        ));
                    });
                }
            });
        });
        // console.log('list:', list);
        return this.insertCount(list);
    }
    // 不同的模板下在前后插入统计项
    insertCount(list) {
        let { data, config } = this.props;
        let columns = (config && config.columns) || [];
        if ([10, 20, 21].includes(config.printFormat) && this.countItem() && this.countItem().length) {
            let obj = {};
            this.countItem().map(item => item.value).map(item => {
                let keyName = item;
                if ([20, 21].includes(config.printFormat)) {
                    keyName = 'count_' + item;
                }
                obj[keyName] = this.domValue(this.amount(data[item]));//, prefix, suffix, style
            });
            // list.push(obj);
        } else {
            let colKeyName = this.columns.filter((tem, t) => t < 1).map(tem => tem.dataIndex);
            let _value = <div style={{ padding: '10px 5px', overflow: 'hidden' }}>
                {this.countItem().map(item => {
                    let style = (item.count && item.count[String(config.printFormat)] && item.count[String(config.printFormat)].style);
                    style = style || (item.count && item.count.style) || {};
                    return [null, undefined, ''].includes(this.amount(data[item.value])) ? '' : <span style={Object.assign({ float: 'left', marginRight: '2em' }, style)}>
                        {item.label}：{this.amount(data[item.value])}
                    </span>
                })}
            </div>;
            // 获取在当前模板下不显示的字段列数
            let noCol = columns.filter(item => !item.level || (item.level && item.level[config.printFormat] !== false)).length;
            // list.unshift({ [colKeyName]: _value, ['colSpan_' + colKeyName]: this.columns.length + noCol });
        }
        return list.map((item, i) => {
            item.key = i;
            return item;
        });
    }
    // 读取对象价格
    amount(obj) {
        let val = obj && typeof obj === 'object' ? (obj.amount !== null ? obj.amount : '') : (obj !== null ? obj : '');
        return val;
    }
    // 将值进行dom组合
    domValue(val, prefix, suffix, style) {
        style = typeof suffix === 'object' ? suffix : style;
        style = typeof prefix === 'object' ? prefix : style;
        return ['', null, undefined].includes(val) ? '' : <div style={Object.assign({ padding: 2 }, this.nowrap(val), style || {})}>
            <span style={{ display: 'inline-block', textAlign: 'left' }}>{prefix || ''}{val}{suffix || ''}</span>
        </div>;
    }
    // 获取要统计的列
    countItem() {
        let { config } = this.props;
        let columns = ((config && config.columns) || []).filter(item => item.count);
        return columns;
    }
    //合并成列（占几行）
    mergeCol(level, value) {
        let { config } = this.props;
        // 格式值10时，不作合并操作
        if (config.printFormat < 20) {
            return {};
        }
        let columns = this.columns.filter(item => item.megerCol == level);
        let obj = {};
        columns.forEach(item => {
            obj['rowSpan_' + item.dataIndex] = value;
        });
        return obj
    }
    // 跨行跨列处理
    tableRender(dataIndex, value, row, index) {
        const obj = {
            children: <div style={{ lineHeight: '1.3em' }}>{value}</div>,
            props: {},
        };
        let { data, config } = this.props;
        let columns = (config && config.columns) || [];
        let printFormat = config.printFormat;
        let maxSkuLength = this.maxSkuLength(data);
        obj.props.rowSpan = typeof row['rowSpan_' + dataIndex] === 'number' ? row['rowSpan_' + dataIndex] : 1;
        // 跨行
        obj.props.colSpan = typeof row['colSpan_' + dataIndex] === 'number' ? row['colSpan_' + dataIndex] : 1;
        let _keyName = (columns || []).filter(item => !item.megerRow).map(item => {
            //格式值20时，合并处理一下有合计项的（如10项中有1项合计，一共就是11项）
            //格式值30时，清掉总尺码列，下面直接返回具体尺码列
            return (item.value == 'sizeName' && [30].includes(printFormat) ? [] : [item.value])
                .concat(item.count && [20].includes(printFormat) ? ['count_' + (item.count.value || item.value)] : [])
                //格式值30时，计算合并sku最大数列
                .concat(item.value == 'sizeName' && [30].includes(printFormat) ? (maxSkuLength > 0 ? [...Array(maxSkuLength).keys()] : [0]).map(im => {
                    return 'sku' + im
                }) : []);
        });
        _keyName = _([]).concat(..._keyName).value();
        let _index = _keyName.indexOf(dataIndex);
        _keyName.filter((item, i) => i < _index).forEach((item, i) => {
            if (row['colSpan_' + item] > (_index - i)) {
                obj.props.colSpan = 0;
            }
        });
        return obj;
    }
    //统计最大sku数量
    maxSkuLength(data) {
        return Math.max.apply(null, ((data && data.spuList) || []).map(item => {
            let sku = [];
            (item.skcList || []).map(itm => {
                (itm.skuList || []).forEach(iem => {
                    sku.push(iem);
                });
            });
            return Object.keys(_.groupBy(sku, 'sizeName')).length;
        }));
    }
    // 判断是否有中文
    unicode(text) {
        var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        return reg.test(text);
    }
    // 非中文保持一行
    nowrap(text) {
        text = String(text || "");
        let style = { display: 'block', textAlign: 'center' };
        if (this.unicode(text)) {
            style = Object.assign({ minWidth: `2.5em` }, style);
        }
        if ((this.unicode(text) && text.length <= 3) || (!this.unicode(text) && text.length <= 10)) {
            return Object.assign({ whiteSpace: 'nowrap', fontSize: `${FONTSIZE}px`, paddingLeft: 5 }, style);
        } else {
            return Object.assign({ paddingLeft: 2, fontSize: `${FONTSIZE}px` }, style, text.length > 5 ? '' : { textAlign: 'center' });
        }
    }
}
