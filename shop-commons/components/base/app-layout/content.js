import React from 'react';
import CustomTable from '../../drp/custom-table';

export default class Content extends React.Component {
    static defaultProps = {
        columns: undefined,
        dataSource: undefined,
    }

    render() {
        return (
            <div>
                {
                    this.props.columns ? <CustomTable columns={this.props.columns} dataSource={this.props.dataSource}></CustomTable> : this.props.children
                }
            </div>
        )
    }
}