import React, { Component } from 'react';
import { Input, Icon } from 'antd';
import { ModalSelect } from 'djmodules';
import PropTypes from 'prop-types';
const { ChannelSelect, WarehouseSelect } = ModalSelect;

export default class extends Component {
    static propTypes = {
        mode: PropTypes.oneOf(['radio', 'checkbox'])
    }
    static defaultProps = {
        mode: 'radio'
    }
    render() {
        return <ChannelSelect
            dataType={this.props.dataType}
            veidoo={this.props.veidoo}
            rowSelectType={this.props.mode}
            style={this.props.style}
            modalTitle='请选择渠道'
            veidoo="channelData"
            ref={type => this.channelSelect = type}
            handleSelect={this.handleSelect}
            veidoo='channelData'>
            <Input
                suffix={<Icon onClick={() => { if (!this.props.disabled) this.channelSelect.showModal() }} type="share-alt" />}
                style={{ width: "100%" }}
                placeholder="请选择渠道"
                onChange={this.onChange}
                onClick={!this.props.allowInput ? () => { this.channelSelect.showModal() } : () => { }}
                value={this.getDisplayLabel()}
                disabled={this.props.disabled} />
        </ChannelSelect>
    }

    getDisplayLabel() {
        if (Array.isArray(this.props.value)) {
            return `已选择${this.props.value.length}项`
        }
        if (typeof this.props.value == 'object') {
            return (this.props.value || {}).name;
        }

        return this.props.value;
    }

    onChange = (event) => {
        if (this.props.allowInput) {
            this.props.onChange(event.target.value);
        }
    }

    handleSelect = (value) => {
        if (this.props.onChange) {
            if (this.props.mode == 'radio') {
                this.props.onChange({
                    name: (((value || {})[0] || {}).brandChannelAtom || {}).channelName,
                    id: (((value || {})[0] || {}).brandChannelAtom || {}).channelId,
                    code: (((value || {})[0] || {}).brandChannelAtom || {}).channelCode,
                });
            } else {
                value = (value || []).map(item => {
                    return {
                        name: (((item || {}) || {}).brandChannelAtom || {}).channelName,
                        id: (((item || {}) || {}).brandChannelAtom || {}).channelId,
                        code: (((item || {}) || {}).brandChannelAtom || {}).channelCode,
                    }
                });
                this.props.onChange(value);
            }
        }
    }
}