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
        mode: 'radio',
        hasWareHouse: true
    }
    render() {
        return <WarehouseSelect
            dataType={this.props.dataType}
            veidoo={this.props.veidoo}
            rowSelectType={this.props.mode}
            style={this.props.style}
            hasWareHouse={this.props.hasWareHouse}
            modalTitle={this.props.title || '请选择店仓'}
            ref={type => this.wareSelect = type}
            channelName={this.props.channel ? { label: this.props.channel.name, key: this.props.channel.id } : {}}
            handleSelect={this.handleSelect}>
            <Input
                suffix={<Icon onClick={() => { if (!this.props.disabled) this.wareSelect.showModal() }} type="home" />}
                style={{ width: "100%" }}
                placeholder={this.props.title || '请选择店仓'}
                onChange={this.onChange}
                onClick={!this.props.allowInput ? () => { this.wareSelect.showModal() } : () => { }}
                value={this.getDisplayLabel()}
                disabled={this.props.disabled} />
        </WarehouseSelect>
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
                    name: ((value || {})[0] || {}).name,
                    id: ((value || {})[0] || {}).storageId,
                    code: ((value || {})[0] || {}).storageCode,
                });
            } else {
                value = (value || []).map(item => {
                    return {
                        name: ((item || {}) || {}).name,
                        id: ((item || {}) || {}).storageId,
                        code: ((item || {}) || {}).storageCode,
                    }
                })
                this.props.onChange(value);
            }
        }
    }
}