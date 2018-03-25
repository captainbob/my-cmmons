import React, { Component } from 'react';
import { SpuSelectOfDrp } from 'djmodules';

export default class extends Component {
    state = {
        visible: false,
        key: 0
    }

    componentDidMount() {
        if (this.props.visible) {
            this.spuSelectOfDrp.showModal();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible != this.props.visible) {
            if (nextProps.visible) {
                this.spuSelectOfDrp.showModal();
            }
        }
    }

    render() {
        return <SpuSelectOfDrp
            key={this.state.key}
            filterObj={{
                keyword: this.props.keyword
            }}
            onClose={() => { this.props.onClose ? this.props.onClose() : null; this.setState({ key: this.state.key + 1 }) }}
            onHandleSure={(value) => { this.onOk(value) }}
            style={{ display: 'inline-block', marginRight: '15px' }}
            ref={(c) => { this.spuSelectOfDrp = c }}
            excludeIds={this.props.excludeIds}>
            <div></div>
        </SpuSelectOfDrp>
    }

    onOk = (value) => {
        if (this.props.onOk) {
            this.props.onOk(value || []);
        }
    }
}