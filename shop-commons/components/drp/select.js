import React, { Component } from 'react';
import css from './select.less';
import classnames from 'classnames/bind';
import { Select, Icon } from 'antd';
import {StringUtils} from 'djmodules-utils';

const cx = classnames.bind(css);

const ALL_VALUE = '@sdfwertryrtcvcghfty###e56456ufgch'

export default class extends Component {
    static defaultProps = {
        prefixCls: 'shop-drp-select',
        enableAll: true
    }

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            text: '',
            isFocus:false
        }
    }

    componentDidMount() {
        this.setText(this.props.value);

        if (document.getElementById(this.props.id)) {
            document.getElementById(this.props.id).addEventListener('focus', this.onFocus);
            document.getElementById(this.props.id).addEventListener('blur', this.onBlur);
        }
    }

    componentWillUnmount() {
        if (document.getElementById(this.props.id)) {
            document.getElementById(this.props.id).removeEventListener('focus', this.onFocus);
            document.getElementById(this.props.id).removeEventListener('blur', this.onFocus);
        }
    }

    onFocus = () => {
        this.setState({isFocus:true})
    }

    onBlur = () => {
        this.setState({isFocus:false})
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value != nextProps.value) {
            this.setText(nextProps.value);
        }
    }

    render() {
        let { style, prefixCls, enableAll, dataSource = [], ...otherProps } = this.props;
        if (enableAll) {
            dataSource = [{ value: ALL_VALUE, label: '全部' }, ...dataSource];
        }
        return <div className={cx(`${prefixCls}`)} style={Object.assign({ display: 'inline-block', position: 'relative' }, style)}>
            <Select showSearch={false} 
                notFoundContent={<div style={{textAlign: 'center'}}><Icon type="frown-o" /> 没有对应的选项</div>}
                filterOption={this.onFilterOption} 
                {...otherProps} 
                style={style} 
                onChange={this.onChange}>
                {
                    dataSource.map(data => {
                        return <Select.Option key={data.value} 
                            value={data.value} 
                            label={data.label}>{data.label}</Select.Option>
                    })
                }
            </Select>
            {this.props.mode === 'multiple' ? <span style={{ position: 'absolute', left: 8, top: 0 }}>{this.state.text}</span> : null}
            {this.props.mode === 'multiple' ? <label htmlFor={this.props.id} style={{ position: 'absolute', right: 8, top: 0, top: 10 }}>
                <Icon type={this.state.isFocus ? "up" : "down"} />
            </label>:null}
        </div>
    }

    onFilterOption = (inputValue, option) => {
        return StringUtils.include(option.props.children, inputValue)
    }

    onChange = (value) => {
        this.props.onChange(this.setText(value));
    }

    setText = (value) => {
        if (this.props.mode == 'multiple') {
            if (value && value.length > 0) {
                if (this.props.enableAll) {
                    let containsAll = false;
                    for (let i = 0; i < value.length; i++) {
                        if (value[i] == ALL_VALUE) {
                            containsAll = true;
                            break;
                        }
                    }
                    if (containsAll) {
                        value = (this.props.dataSource || []).map(item => item.value);
                    }
                }
                if (value.length == this.props.dataSource.length) {
                    this.setInputStyle(`全部`, 5);
                    this.setState({
                        text: `全部`
                    });
                } else {
                    const text = `已选择${value.length}项`;
                    this.setInputStyle(text, 2);
                    this.setState({
                        text: text
                    });
                }
            } else {
                this.setInputStyle('');
                this.setState({
                    text: ''
                });
            }
        } else {
            this.props.dataSource.forEach(data => {
                if (data.value === value) {
                    this.setState({
                        text: data.label
                    })
                }
            });
            if (value === ALL_VALUE) {
                value = undefined;
            }
        }
        return value
    }

    setInputStyle = (string, delta = 0) => {
        if (document.getElementById(this.props.id)) {
            document.getElementById(this.props.id).style.marginLeft = `${string.length * 12 + delta}px`;
        }
    }
}