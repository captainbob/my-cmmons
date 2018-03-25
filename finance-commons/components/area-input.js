import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'antd';
import { AsyncLikeSelect } from 'djmodules';
import { roleControllDisplay } from '../utils/common';
import HttpUtil from '../utils/http'
const InputGroup = Input.Group;
const Option = Select.Option;
const RANGE_ENUM = {
    "company": "0", // 公司
    "channal": "1", // 渠道
    "bigArea": "6", // 大区
    "smallArea": "7", // 小区
    "store": "2", // 店铺
}
function getBrandChineseName() {
    return HttpUtil.ajax('brand/base/cnd_query', {
        method: 'get',
        data: {
            brandId: window.currentBrandId,
            queryType: 1
        }
    }).then(res => {
        window.brandChineseName = res.resultObject.brandChineseName;
    })
}
const { roleId, storageId } = window.userInfo || {};

class MultiAreaFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            range: RANGE_ENUM['company'],
            value: window.currentBrandId,
            brandName: window.brandChineseName || '公司名称'
        }
        if (!window.brandChineseName) {
            getBrandChineseName().then(() => {
                this.setState({
                    brandName: window.brandChineseName || '公司名称'
                });
            })
        }
    }

    get customInput() {
        let range = this.state.range;
        switch (range) {
            case RANGE_ENUM['company']:
                return <Input value={this.state.brandName} onChange={
                    (e) => this.onChange(e.target.value)
                } disabled />
            case RANGE_ENUM['channal']:
                return <AsyncLikeSelect.Channel
                    showCount={10}
                    placeholder='请输入渠道'
                    style={{ width: '100%' }}
                    onChange={this.onChange}
                />
            case RANGE_ENUM['bigArea']:
                return <AsyncLikeSelect.BigArea
                    showCount={10}
                    placeholder='请输入大区'
                    style={{ width: '100%' }}
                    onChange={this.onChange}
                />
            case RANGE_ENUM['smallArea']:
                return <AsyncLikeSelect.SmallArea
                    showCount={10}
                    placeholder='请输入小区'
                    style={{ width: '100%' }}
                    onChange={this.onChange}
                />
            case RANGE_ENUM['store']:
                return <AsyncLikeSelect.Store
                    showCount={10}
                    placeholder='请输入店铺'
                    style={{ width: '100%' }}
                    onChange={this.onChange}
                />
            default:
                break;
        }
    }
    onChange = (value) => {
        this.setState({ value: value });
    }

    componentWillMount() {
        this.roleOptions = this.getRoleOptions();
        // 当角色是店长,导购时
        if (roleId == 6 || roleId == 7) {
            this.setState({
                range: RANGE_ENUM['store'],
                value: storageId,
            });
        } else {
            this.setState({
                range: this.roleOptions[0].props.value,
                value: this.roleOptions[0].props.value == RANGE_ENUM['company'] ? window.currentBrandId : undefined
            });
        }

    }

    getRoleOptions = () => {
        let ret = [];

        ret.push(roleControllDisplay((<Option value={RANGE_ENUM['company']}>公司</Option>), [4]))
        ret.push(roleControllDisplay((<Option value={RANGE_ENUM['channal']}>渠道</Option>), [4], true))
        // 屏蔽大区小区
        // ret.push(roleControllDisplay((<Option value={RANGE_ENUM['bigArea']}>大区</Option>), [4], true))
        // ret.push(roleControllDisplay((<Option value={RANGE_ENUM['smallArea']}>小区</Option>), [4], true))
        ret.push(<Option value={RANGE_ENUM['store']}>店铺</Option>)

        ret = ret.filter(v => !!v)
        return ret
    }
    render() {
        const style = Object.assign({ display: 'inline-block', verticalAlign: 'middle' }, this.props.style);
        if (roleId == 6) {
            return <span></span>
        }
        return (
            <div style={style}>
                <InputGroup>
                    <Select value={this.state.range} onChange={(value) => {
                        this.setState({
                            value: value == RANGE_ENUM['company'] ? window.currentBrandId : undefined,
                            range: value
                        });
                    }} style={{ width: '30%', verticalAlign: 'middle' }}>
                        {this.roleOptions}
                    </Select>
                    <div style={{
                        width: '70%',
                        display: 'inline-block',
                        paddingLeft: 10,
                        verticalAlign: 'middle',
                    }}>{this.customInput}</div>
                </InputGroup>
            </div>
        );
    }
}

MultiAreaFilter.propTypes = {

};

export default MultiAreaFilter;