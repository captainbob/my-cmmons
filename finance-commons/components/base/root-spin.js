import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Spin } from 'antd';
import Load from '../../models/load'

@observer
class RootSpin extends Component {
    loadingInstance = Load.getInstance();
    render() {
        return (
            <Spin size='large' spinning={this.loadingInstance.loading}>
                {this.props.children}
            </Spin>
        );
    }
}

export default RootSpin;

