import React, { Component } from 'react'

const defaultSize = 300

export default class Image extends Component {
    constructor(props) {
        super(props)
        this.state = {
            src: this.props.src
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (this.state.src != nextProps.src) {
            this.setState({ src: nextProps.src })
        }
    }

    onError = (event) => {
        const size = this.props.width || this.props.height || defaultSize
        if (size <= 200) {
            this.setState({ src: 'http://img.dianjia.io/moren.png@!a422w' })
        } else {
            this.setState({ src: 'http://img.dianjia.io/moren.png' })
        }
    }

    render() {
        const imgProps = Object.assign({}, this.props)
        const width = imgProps.width || 'auto'
        const height = imgProps.height || 'auto'
        if (imgProps.src) {
            delete imgProps.src
        }

        if (imgProps.width && imgProps.height) {
            delete imgProps.height
        }

        return (
            <div style={{ display: 'inline-block', width: width, height: height, overflow: 'hidden', verticalAlign: 'middle' }}>
                <img {...imgProps} src={this.state.src} onError={this.onError}></img>
            </div>
        )
    }
}