import React, { Component } from 'react';
import { Table } from 'antd';
import TableHeaderColItem from './table-header-col-item';
import css from './custom-table.less';
import classnames from 'classnames/bind';

const cx = classnames.bind(css);

export default class CustomTable extends Component {
    static defaultProps = {
        prefixCls: 'shop-custom-table'
    }

    state = {
        width: -1
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        this.onResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    onResize = () => {
        this.setState({ width: this.refs.tableContainer.clientWidth });
    }

    render() {
        const { prefixCls, dataSource, columns, className, ...otherProps } = this.props;
        let newColumns = (this.props.columns || []).map(c => {
            if (typeof c.title.header != 'undefined' && typeof c.title.body != 'undefined') {
                return Object.assign({}, c, {
                    title: <TableHeaderColItem checked={c.title.checked} header={c.title.header} body={c.title.body} textAlign={c.title.textAlign} onChange={c.title.onChange}></TableHeaderColItem>
                });
            } else {
                return Object.assign({}, c, {
                    title: <div style={{ padding: '5px 8px 5px 8px' }}>{c.title}</div>
                });
            }
        });


        if (this.props.scroll && this.props.scroll.x) {
            if (this.state.width > this.props.scroll.x) {
                newColumns = newColumns.map(c => {
                    return Object.assign({}, c, { fixed: '' });
                });
            }
        }

        return <div ref='tableContainer'>
            <Table columns={newColumns} dataSource={this.props.dataSource} className={cx(`${prefixCls}`)} {...otherProps}></Table>
        </div>
    }
}