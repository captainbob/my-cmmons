import React, { Component } from 'react';
import { Button } from 'antd';
import InputNumber from './input-number'
import css from './spu-edit.less';
import classnames from 'classnames/bind';
import formatMoney from '../../utils/format-money';

const cx = classnames.bind(css);

const SCOPE = '@@__drp_spu_edit__@@';

const style = {
    container: {
        border: '1px solid #f3f3f3',
        minHeight: 50
    },
    header: {
        height: 60,
        width: '100%'
    },
    img: {
        width: 70,
        verticalAlign: 'top',
        textAlign: 'center'
    },
    imgSrc: {
        border: '1px solid #f3f3f3'
    },
    info: {
        width: 150,
        verticalAlign: 'top'
    },
    info1: {
        width: 150,
        verticalAlign: 'top'
    },
    ops: {
        textAlign: 'right',
        verticalAlign: 'top'
    },
    btn: {
        border: '0px solid white'
    },
    item: {
        width: 90,
        height: 35,
        borderRight: '1px solid rgb(238, 238, 238)',
        borderBottom: '1px solid rgb(238, 238, 238)',
        lineHeight: '35px',
        paddingLeft: 8,
        paddingRight: 8
    },
    gray: {
        backgroundColor: 'rgb(245, 245, 245)'
    },
    lightGray: {
        backgroundColor: 'rgb(245, 245, 245)'
    },
    llGray: {
        backgroundColor: 'rgb(245, 245, 245)'
    },
    panelContainer: {
        position: 'relative',
        border: '1px solid rgb(238, 238, 238)',
    },
    leftPanel: {
        width: 90,
        float: 'left'
    },
    rightPanel: {
        marginLeft: 90,
        position: 'relative'
    },
    totalPanel: {
        width: 90,
        float: 'right'
    },
    textCenter: {
        textAlign: 'center'
    },
    editArea: {
        position: 'absolute',
        left: 0,
        right: 90,
        bottom: 0,
        top: 0
    },
    editAreaRow: {
        height: 35,
        borderBottom: '1px solid rgb(238, 238, 238)'
    },
    editAreaCol: {
        borderRight: '1px solid rgb(238, 238, 238)',
        float: 'left',
        width: 90,
        height: '100%',
        textAlign: 'center',
        lineHeight: '35px'
    },
    borderLeft: {
        borderLeft: '1px solid rgb(238, 238, 238)'
    }
}

export default class extends Component {
    static defaultProps = {
        prefixCls: 'shop-spu-edit',
        allowDelete: true,
        startRow: 0,
    }
    render() {
        const { spu, agentJoin } = this.props;

        const colors = this.colors(spu.skus);
        const colorIdNameMap = this.colorIdNameMap(spu.skus);

        const sizes = this.sizes(spu.skus);
        const sizeIdNameMap = this.sizeIdNameMap(spu.skus);

        const skuNums = this.skuNums(spu.skus);

        const skuIdMap = this.skuIdMap(spu.skus);

        const colorTotalMap = this.colorTotalMap(spu.skus);

        const sizeTotalMap = this.sizeTotalMap(spu.skus);

        const { prefixCls } = this.props;

        let startRow = this.props.startRow - 1;

        return <div className={cx(`${prefixCls}`)} style={Object.assign({}, style.container, this.props.style || {})}>
            <table style={style.header}>
                <tbody>
                    <tr>
                        <td style={style.img}>
                            <img style={style.imgSrc}
                                src={spu.img}
                                width={60}
                                height={60} />
                        </td>
                        <td style={style.info}>
                            <div>货号：{spu.code}</div>
                            <div>吊牌价：{formatMoney(spu.suggestPrice)}</div>
                        </td>
                        <td style={style.info1}>
                            <div>商品名称：{spu.name}</div>
                            <div>结算价：{agentJoin === false ? '--' : formatMoney(spu.settlePrice)}</div>
                        </td>
                        <td style={style.info1}>
                            <div>结算折扣：{agentJoin === false ? '--' : `${spu.settleDiscount}%`}</div>
                        </td>
                        <td style={style.ops}>
                            {this.props.allowDelete ? <Button type='primary'
                                style={style.btn}
                                ghost
                                onClick={() => { this.onDelete(spu.id) }}>删除</Button> : null}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                <div style={style.panelContainer}>
                    <ul style={style.leftPanel}>
                        <li style={Object.assign({}, style.item, style.gray)}>颜色</li>
                        {
                            colors.map(color => {
                                return <li key={colorIdNameMap[color]} style={Object.assign({}, style.item, style.lightGray)}>{colorIdNameMap[color]}</li>
                            })
                        }
                        <li style={Object.assign({}, style.item, style.lightGray)}>合计</li>
                    </ul>
                    <div style={style.rightPanel}>
                        <div style={style.editArea}>
                            <div style={Object.assign({}, style.editAreaRow, style.gray)}>
                                {
                                    sizes.map(size => {
                                        return <div style={style.editAreaCol} key={sizeIdNameMap[size]}>{sizeIdNameMap[size]}</div>
                                    })
                                }
                            </div>
                            {
                                colors.map(color => {
                                    startRow++;
                                    return <div key={color} style={Object.assign({}, style.editAreaRow, style.llGray)}>
                                        {
                                            sizes.map((size, index) => {
                                                const key = `${color}-${size}`;
                                                return <div style={style.editAreaCol} key={skuIdMap[size]}>
                                                    {skuIdMap[key] ? <InputNumber scope={this.props.scope || SCOPE} row={startRow} col={index} key={skuIdMap[key]}
                                                        min={0}
                                                        max={100000}
                                                        className={cx(`${prefixCls}-inputnumber`)}
                                                        onChange={(value) => { this.onChange(skuIdMap[key], value) }}
                                                        style={{ width: '100%', height: 34, lineHeight: '34px', border: '0px solid white', textAlign: 'center', borderRadius: 0 }}
                                                        value={skuNums[key] === 0 ? '' : skuNums[key]}></InputNumber> : null}
                                                </div>
                                            })
                                        }
                                    </div>
                                })
                            }
                            <div style={Object.assign({}, style.editAreaRow, style.lightGray)}>
                                {
                                    sizes.map(size => {
                                        return <div style={style.editAreaCol}>{sizeTotalMap[size]}</div>
                                    })
                                }
                            </div>
                        </div>
                        <ul style={style.totalPanel}>
                            <li style={Object.assign({}, style.item, style.gray, style.textCenter, style.borderLeft)}>合计数量</li>
                            {
                                colors.map(color => {
                                    return <li key={color} style={Object.assign({}, style.item, style.lightGray, style.textCenter, style.borderLeft)}>{
                                        colorTotalMap[color]
                                    }</li>
                                })
                            }
                            <li style={Object.assign({}, style.item, style.lightGray, style.textCenter, style.borderLeft)}>
                                {
                                    colors.reduce((total, next) => {
                                        return total + colorTotalMap[next];
                                    }, 0)
                                }
                            </li>
                        </ul>
                        <div style={{ clear: 'both' }}></div>
                    </div>
                    <div style={{ clear: 'both' }}></div>
                </div>
            </div>
        </div>
    }

    onDelete = (spuId) => {
        if (this.props.onDelete) {
            this.props.onDelete(spuId);
        }
    }

    onChange = (skuId, value) => {
        if (this.props.onChange) {
            if (value == '') {
                value = '0';
            }
            if (/^[0-9]+$/.test(value)) {
                this.props.onChange(skuId, parseInt(value));
            }
        }
    }

    colorIdNameMap = (skus) => {
        return (skus || []).reduce((total, next) => {
            total[next.colorId] = next.colorName;
            return total;
        }, {});
    }

    colors = (skus) => {
        const colors = (skus || []).reduce((total, next) => {
            total[next.colorId] = true;
            return total;
        }, {});
        return Object.keys(colors);
    }

    sizeIdNameMap = (skus) => {
        return (skus || []).reduce((total, next) => {
            total[next.sizeId] = next.sizeName;
            return total;
        }, {});
    }

    sizes = (skus) => {
        const sizes = (skus || []).reduce((total, next) => {
            total[next.sizeId] = true;
            return total;
        }, {});
        return Object.keys(sizes);
    }

    skuNums = (skus) => {
        return (skus || []).reduce((total, next) => {
            const key = `${next.colorId}-${next.sizeId}`;
            if (typeof total[key] == 'undefined') {
                total[key] = 0;
            }
            total[key] = total[key] + next.num;
            return total;
        }, {});
    }

    skuIdMap = (skus) => {
        return (skus || []).reduce((total, next) => {
            const key = `${next.colorId}-${next.sizeId}`;
            total[key] = next.skuId;
            return total;
        }, {});
    }

    colorTotalMap = (skus) => {
        return (skus || []).reduce((total, next) => {
            const key = next.colorId;
            if (typeof total[key] == 'undefined') {
                total[key] = 0;
            }
            total[key] = total[key] + next.num;
            return total;
        }, {});
    }

    sizeTotalMap = (skus) => {
        return (skus || []).reduce((total, next) => {
            const key = next.sizeId;
            if (typeof total[key] == 'undefined') {
                total[key] = 0;
            }
            total[key] = total[key] + next.num;
            return total;
        }, {});
    }
}