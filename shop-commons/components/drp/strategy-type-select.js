import React, { Component } from 'react';
import { fjs } from 'djmodules-utils';
import Select from './select';

export default class extends Component {
    state = {
        dataSource: []
    }
    componentDidMount() {
        fjs.http.post('/rs/finance/tacticsType/get_tactics_type_list', { brandId: window.currentBrandId }).then(response => {
            this.setState({ dataSource: response.resultObject || [] });
        })
    }
    render() {
        let label = '';
        this.state.dataSource.forEach(data => {
            if (data.id == this.props.value) {
                label = data.name;
            }
        });
        const dataSource = this.state.dataSource.map(item => {
            return {
                value: item.id,
                label: item.name
            }
        });
        return !this.props.readonly ? <Select enableAll={this.props.enableAll === false ? false : true} allowClear {...this.props} dataSource={dataSource}>
        </Select> : <div>{label}</div>
    }
}