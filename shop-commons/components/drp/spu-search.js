import React, { Component } from 'react';
import { Input } from 'antd';
import { HttpQueue } from 'djmodules-utils/lib/http-queue';
import css from './spu-search.less';
import classnames from 'classnames/bind';
import { Modal } from 'antd';

const cx = classnames.bind(css);

const delayQueue = HttpQueue.delay(50);

export default class SpuSearch extends Component {

    static defaultProps = {
        prefixCls: 'shop-spu-search',
        in: {
            spuIds:undefined
        }
    }

    state = {
        value: undefined,
        dataSource: [],
        value: undefined,
        currentIndex: -1,
    }

    render() {
        const { prefixCls } = this.props;

        const defaultStyle = {
            width: '100%', 
            height: '100%', 
            borderRadius: 4, 
            border: '1px solid #d9d9d9', 
            paddingLeft: 8, 
            paddingRight: 8
        }

        if (this.props.disabled) {
            Object.assign(defaultStyle, {
                opacity: '0.72',
                cursor: 'not-allowed',
                backgroundColor: '#f7f7f7'
            });
        }

        return <div style={Object.assign({}, { display: 'inline-block', position: 'relative', width: 300, height: 40 }, this.props.style || {})}>
            <input ref='input' disabled={this.props.disabled}
                value={this.state.value}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onKeyUp={this.onPressEnter}
                placeholder='输入商品货号录入商品'
                style={defaultStyle}
                onChange={this.onChange}></input>
            <div style={{
                minWidth: 250,
                position: 'absolute',
                background: 'white',
                zIndex: 100000,
                borderRadius: 4,
                border: '1px solid #f3f3f3',
                boxShadow: '1px 1px 5px #f3f3f3',
                top: -this.state.dataSource.length * 30 - 5,
                display: this.state.dataSource.length == 0 ? 'none' : 'block',
                cursor: 'pointer'
            }}>
                {
                    this.state.dataSource.map((data, index) => {
                        return <div className={cx(`${prefixCls}-item`)}
                            key={data.merchantCode}
                            onClick={() => { this.onOk(data) }}
                            style={{ paddingLeft: 5, paddingRight: 5, height: 30, lineHeight: "30px", background: this.state.currentIndex == index ? 'rgba(16, 143, 233, 0.5)' : '' }}>
                            {
                                data.merchantCode
                            }
                        </div>
                    })
                }
            </div>
        </div>
    }

    onFocus = () => {
        this.hasProcess = false;
        if ((this.state.value || '').length > 0) {
            this.onChange({
                target: {
                    value: this.state.value
                }
            })
        }
    }

    onBlur = () => {
        setTimeout(() => {
            if (this.hasProcess) {
                return this.hasProcess = false;
            }
            //if (this.state.value && this.state.value.length > 0)
            //    return this.onOk(this.state.value);
            this.setState({ value: undefined, dataSource: [] });
        }, 150);
    }

    onPressEnter = (event) => {
        if (event.keyCode == 13) {
            this.refs.input.blur();
            if (this.state.currentIndex != -1) {
                const value = this.state.dataSource[this.state.currentIndex];
                return this.onOk(value);
            } else {
                const value = event.target.value || '';
                if (this.state.dataSource.length > 0) {
                    for (let i = 0; i < this.state.dataSource.length; i++) {
                        if (this.state.dataSource[i].merchantCode == value) {
                            return this.onOk(this.state.dataSource[i]);
                        }
                    }
                }
                Modal.info({
                    title: '提示框',
                    content: '商品不存在，请检查商品货号是否正确！',
                    onOk: () => { }
                });
            }
        }
        if (event.keyCode == 38 && this.state.dataSource.length > 0) {
            return this.setState((state) => {
                return {
                    currentIndex: state.currentIndex != -1 ? (state.currentIndex - 1 + this.state.dataSource.length) % this.state.dataSource.length : this.state.dataSource.length - 1
                }
            });
        }

        if (event.keyCode == 40 && this.state.dataSource.length > 0) {
            return this.setState((state) => {
                return {
                    currentIndex: state.currentIndex != -1 ? (state.currentIndex + 1) % this.state.dataSource.length : 0
                }
            });
        }
    }

    onOk = (value) => {
        let realValue = value;
        let displayValue = value
        if (typeof value == 'object') {
            realValue = value.brandSpuId;
            displayValue = value.merchantCode;
        }
        if (realValue.length == 0) {
            return this.setState({ value: undefined, dataSource: [], currentIndex: -1 });
        }
        this.hasProcess = true;
        if (this.props.onOk) {
            this.props.onOk(realValue);
        }
        this.setState({ value: displayValue, dataSource: [], currentIndex: -1 })
    }

    onChange = (event) => {
        this.setState({ value: event.target.value })
        delayQueue.enqueue('/rs/goodsx/sspu/search_merchant_code', {
            method: 'GET',
            data: {
                value: event.target.value,
                merchantCode: event.target.value,
                brandId: window.currentBrandId,
                showCount: 10,
                runCount: false,
                brandSpuIds:this.props.in.spuIds ? JSON.stringify(this.props.in.spuIds) : undefined
            }
        }).then(response => {
            if (response.status == 'success') {
                this.setState({ dataSource: response.resultObject || [], currentIndex: -1 });
            }
        })
    }
}