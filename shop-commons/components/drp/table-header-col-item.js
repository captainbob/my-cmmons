import React, { Component } from 'react';
import { Checkbox } from 'antd';
const style = {
    item: {
        height: '30px',
        lineHeight: '30px',
        fontWeight: 700,
        paddingLeft: 8,
        paddingRight: 8
    },
    header: {
        background: '#f3f3f3'
    },
    body: {
        background: '#e8e8e8',
        fontWeight: 'normal'
    }
}

const Layout2Cols = function (props) {
    return <div style={{ width: '100%', position: 'relative', height: '100%' }}>
        <div style={{ width: 22, top: 0, bottom: 0, left: 0, position: 'absolute' }}>{props.item1}</div>
        <div style={{ top: 0, bottom: 0, left: 22, right: 0, position: 'absolute' }}>{props.item2}</div>
    </div>
}

export default class TableHeaderColItem extends Component {
    render() {
        const checkbox = typeof this.props.onChange == 'function';
        return checkbox ? <div>
            <div style={Object.assign({ textAlign: this.props.textAlign }, style.item, style.header)}>
                <Checkbox checked={this.props.checked} onChange={this.props.onChange}>{this.props.header}</Checkbox>
            </div>
            <div style={Object.assign({ textAlign: this.props.textAlign }, style.item, style.body)}>
                <Layout2Cols item1={null} item2={this.props.body}></Layout2Cols>
            </div>
        </div> : <div>
                <div style={Object.assign({ textAlign: this.props.textAlign }, style.item, style.header)}>{this.props.header}</div>
                <div style={Object.assign({ textAlign: this.props.textAlign }, style.item, style.body)}>{this.props.body}</div>
            </div>
    }
}