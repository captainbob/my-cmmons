import React, { Component } from 'react';
import { Tooltip } from 'antd';

export default class Text extends Component {

    state = {
        tooltip: false
    }

    componentDidMount() {
        if (typeof this.props.style.width == 'number') {
            if (this.refs.text.getBoundingClientRect().width >= this.props.style.width) {
                this.setState({tooltip: true});
            } else {
                this.setState({tooltip: false});
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.text != nextProps.text) {
            //不好的实现方式
            setTimeout(() => {
                if (typeof this.props.style.width == 'number') {
                    if (this.refs.text.getBoundingClientRect().width >= this.props.style.width) {
                        this.setState({tooltip: true});
                    } else {
                        this.setState({tooltip: false});
                    }
                }
            }, 500);
        }
    }
    
    render() {
        return <div>
            <div style={{height: 0, width: this.props.style.width || 0, overflow:'hidden'}}>
                <div style={{width: 1000}}>
                    <span ref='text'>{this.getText(this.props.text)}</span>
                </div>
            </div>
            {
                this.state.tooltip ? <Tooltip title={this.props.text}>
                    <div style={Object.assign({
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        width: '100%'
                    }, this.props.style)}>{this.getText(this.props.text)}</div>
                </Tooltip> : <div style={Object.assign({
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        width: '100%'
                    }, this.props.style)}>{this.getText(this.props.text)}</div>
            }
        </div>
    }

    getText(text = '') {
        if (this.props.maxLength && this.props.maxLength < text.length) {
            return text.substr(0, this.props.maxLength) + '...';
        }
        return text;
    }
}