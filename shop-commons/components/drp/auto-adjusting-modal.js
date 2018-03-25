import React, { Component } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

const FACTOR = 0.95;

class AutoAdjustingModal extends Component {
    static propTypes = {
        minWidth: PropTypes.number,
        maxWidth: PropTypes.number,
        minHeight: PropTypes.number,
        maxHeight: PropTypes.number
    }

    constructor(props) {
        super(props);
        this.state = this.getSize(window.innerWidth * FACTOR, window.innerHeight * FACTOR);
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        this.onResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    onResize = () => {
        this.setSize(window.innerWidth * FACTOR, window.innerHeight * FACTOR);
    }

    setSize = (width, height) => {
        this.setState(this.getSize(width, height), () => {

        });
    }

    getSize = (width, height) => {
        const { minWidth = 0, maxWidth = 0, minHeight = 0, maxHeight = 0, style, ...otherProps } = this.props;
        if (minWidth > 0 && width < minWidth) {
            width = minWidth;
        }
        if (maxWidth > 0 && width > maxWidth) {
            width = maxWidth;
        }
        if (minHeight > 0 && height < minHeight) {
            height = minHeight;
        }
        if (maxHeight > 0 && height > maxHeight) {
            height = maxHeight;
        }
        return { height, width };
    }

    render() {
        const { minWidth = 0, maxWidth = 0, minHeight = 0, maxHeight = 0, style, ...otherProps } = this.props;
        const bodyStyle = { height: this.state.height - 100, overflowY: 'auto' };
        const newStyle = Object.assign({ top: window.innerHeight * (1 - FACTOR) * 0.5 }, style);
        return <Modal {...otherProps} width={this.state.width} style={newStyle} bodyStyle={bodyStyle}>
            {
                this.props.children
            }
        </Modal>
    }
}

module.exports = AutoAdjustingModal;