import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HttpUtil } from 'djmodules-utils';
import classnames from 'classnames/bind';
import { message } from 'antd';

import styles from './brand-select.less';

const cx = classnames.bind(styles);
let cache;
function getChildBrandList() {
    return new Promise((resolve, reject) => {
        if (cache) {
            resolve(cache);
        } else {
            HttpUtil.ajax("brand/child/get_child_list", {
                method: "get",
                data: {
                    brandId: window.currentBrandId,
                }
            }).then(res => {
                if (res.status == "success") {
                    cache = res.resultObject;
                    resolve(res.resultObject);
                } else {
                    message.error(res.exceptionMessage || res.message || '请求错误')
                    reject(res)
                }
            }).catch(err => {
                reject('请求错误')
            })

        }
    })
}

class BrandSelect extends Component {
    state = {
        childBrandList: [],
        selectedList: this.props.value || []
    }

    componentDidMount() {
        getChildBrandList().then(res => {
            this.setState({
                childBrandList: res
            });
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            this.setState({
                selectedList: nextProps.value
            });
        }
    }

    render() {
        const descFunc = (len) => <span>已选择了<span style={{ color: '#4990e2' }}>{len}</span>个品牌</span>;
        const { selectedList, childBrandList } = this.state;
        return (
            <div className={cx('container')}>
                <div className={cx('select-desc')}>{selectedList.length > 0 ? descFunc(selectedList.length) : undefined}</div>
                {childBrandList.map(v => {
                    return <div className={cx({
                        "moren": true,
                        "selected": selectedList.includes(v.childBrandId),
                    })} onClick={() => this.onChange(v.childBrandId)}>{v.childBrandCname}</div>
                })}
            </div>
        );
    }

    onChange = (id) => {
        let { selectedList, childBrandList } = this.state;
        let index = selectedList.indexOf(id);
        let newSelectedList = [];
        if (index > -1) {
            newSelectedList = [
                ...selectedList.slice(0, index),
                ...selectedList.slice(index + 1)
            ];
            this.setState({
                selectedList: newSelectedList
            });
        } else {
            newSelectedList = [
                ...selectedList,
                id
            ];
            this.setState({
                selectedList: newSelectedList
            });
        }
        //return newSelectedList
        let newChildBrandList = newSelectedList.map(v => {
            return childBrandList.find(ele => ele.childBrandId == v)
        })
        try {
            this.props.onChange({
                target: {
                    value: newSelectedList
                }
            }, newChildBrandList)
        } catch (err) {
            console.warn('最好是传入onChange事件')
        }
    }
}

BrandSelect.propTypes = {

};

export default BrandSelect;