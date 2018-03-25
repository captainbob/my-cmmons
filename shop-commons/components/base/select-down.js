import React from 'react';
import { Select } from 'antd';
import './select-down.less';

class SelectDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        let { children, value } = this.props;
        if (children && children.length) {
            let values = (children || []).filter(item => {
                if (item.props.value === value) {
                    return true;
                }
                if (value && value instanceof Array && value.includes(item.props.value)) {
                    return true;
                }
                return false;
            }).map(item => {
                return item.props.value;
            });
            this.changeItem(values);
        }
    }
    render() {
        let { id, name } = this.props;
        return (
            <div>
                <Select
                    mode="multiple"
                    placeholder="请选择"
                    style={{ width: 100 }}
                    optionFilterProp="children"
                    className={`css-select-item-num css-select-item-num_${id || ''}${name || ''}`}
                    {...this.props}
                    onChange={(values) => {
                        this.changeItem(values);
                        if (this.props.onChange) {
                            this.props.onChange(values);
                        }
                        return values;
                    }}
                >
                    {this.props.children}
                </Select>
            </div>
        )
    }
    changeItem(values) {
        let { id, name } = this.props;
        let s = document.querySelectorAll(`.css-select-item-num_${id || ''}${name || ''}`);
        if (s && s.length) {
            for (let i = 0; i < s.length; i++) {
                let d = s[i].querySelectorAll("ul")[0];
                if (values.length) {
                    d.setAttribute("data-num", values.length);
                    d.removeAttribute("data-none");
                } else {
                    d.removeAttribute("data-num");
                    d.setAttribute("data-none", "");
                }
            }
        }
    }
}

export default SelectDown;
