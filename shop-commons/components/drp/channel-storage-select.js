import React, { Component } from 'react';
import { Form } from 'antd';
import ChannelSelect from './channel-select';
import WarehouseSelect from './warehouse-select';

const Layout2Cols = function (props) {
    return <div style={Object.assign({}, { display: 'inline-block', width: 180 }, props.style)}>
        <div style={{ width: 60, float: 'left', paddingRight: 5, textAlign: 'left', height: 28, lineHeight: '28px' }}>{props.left}</div>
        <div style={{ marginLeft: 60 }}>{props.right}&nbsp;</div>
        <div style={{ clear: 'both' }}></div>
    </div>
}

const formItemStyle = {
    width: 120
}

export default class extends Component {
    static defaultProps = {
        type: 'return'
    }
    state = {
        channel: (this.props.value || {}).channel,
        storage: (this.props.value || {}).storage
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            this.setState({
                channel: (nextProps.value || {}).channel,
                storage: (nextProps.value || {}).storage
            });
        } else {
            this.setState({
                channel: undefined,
                storage: undefined
            })
        }
    }
    render() {
        return !this.props.readonly ? <div style={{ padding: 0 }}>
            <Layout2Cols style={{ marginRight: 8 }} left={<span>{`${this.props.type == 'return' ? '退货' : '订单'}渠道:`}</span>} right={
                <ChannelSelect dataType={this.props.dataType}
                    veidoo={this.props.veidoo} style={formItemStyle} placeholder={`请选择${this.props.type == 'return' ? '退货' : '订单'}渠道`} onChange={(value) => {
                        this.setState({ channel: value, storage: undefined });
                        if (this.props.onChange) {
                            this.props.onChange({ channel: value, storage: undefined })
                        }
                    }} value={this.state.channel}></ChannelSelect>
            }></Layout2Cols>
            <Layout2Cols left={`${this.props.type == 'return' ? '退货' : '订单'}店仓:`} right={
                <WarehouseSelect dataType={this.props.dataType}
                    veidoo={this.props.veidoo} value={this.state.storage}
                    onChange={(value) => {
                        this.setState({ storage: value });
                        if (this.props.onChange) {
                            this.props.onChange({ channel: this.state.channel, storage: value })
                        }
                    }}
                    style={formItemStyle}
                    placeholder={`请选择${this.props.type == 'return' ? '退货' : '订单'}店仓`}
                    disabled={typeof this.state.channel == 'undefined'}
                    channel={this.state.channel}></WarehouseSelect>
            }></Layout2Cols>
        </div> : <div style={{ padding: 0 }}>
                <Layout2Cols style={{ marginRight: 8 }} left={<span>{`${this.props.type == 'return' ? '退货' : '订单'}渠道:`}</span>} right={
                    (this.state.channel || {}).name
                }></Layout2Cols>
                <Layout2Cols left={`${this.props.type == 'return' ? '退货' : '订单'}店仓:`} right={
                    (this.state.storage || {}).name
                }></Layout2Cols>
            </div>
    }
}