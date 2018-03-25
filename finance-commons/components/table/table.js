import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import CommonsStyle from './commons.less';
import { Icon } from 'antd';
const cls = classnames.bind(CommonsStyle);

const Table = (props) => {
    const style = Object.assign({}, { 'tableLayout': 'fixed', width: '100%', fontSize: '0.12rem', margin: '20px 0 ' }, props.style || {})
    return (
        <div className='dj-table' style={{ minHeight: '80px' }}>
            <table className='dj-table' style={style} cellSpacing={0} cellPadding={0}>
                {props.children}
            </table>
        </div>

    )
}

Table.Header = (props) => {
    return <thead style={{ background: '#f3f3f3' }}>
        {props.children}
    </thead>
}

Table.Body = (props) => {
    const style = Object.assign({}, { background: 'white' }, props.style || {})
    return <tbody style={style}>
        {
            (React.Children.count(props.children) == 0) ? <tr style={{ position: 'relative' }}>
                <div style={{ margin: '0 auto', position: 'absolute', left: 0, right: 0, textAlign: 'center', borderBottom: '1px solid #f3f3f3', height: 40, lineHeight: '40px', verticalAlign: 'middle' }}>
                    <Icon type="frown-o" />&nbsp;&nbsp;暂无数据
                </div>
            </tr> : props.children
        }
    </tbody>
}

Table.Tr = (props) => {
    let { style, ...otherProps } = props;
    style = Object.assign({}, { border: '0rem solid #f3f3f3', borderBottomWidth: '0.01rem', marginTop: '0.08rem', marginBottom: '0.08rem' }, props.style || {})
    return <tr style={style} {...otherProps}>
        {props.children}
    </tr>
}

Table.Td = (props) => {
    const style = Object.assign({}, { width: props.ratio * 100 + '%', padding: '0.12rem 0.05rem', borderBottom: '1px solid #e3e3e3', verticalAlign: 'top' }, props.style || {})
    const colsSpan = props.colsSpan || 1
    return <td colSpan={colsSpan} style={style} className={cls(`text-${props.textAlign}`, `color-${props.textColor}`)}>
        {props.children}
    </td>
}
Table.Th = (props) => {
    const style = Object.assign({}, { width: props.ratio * 100 + '%', padding: '0.12rem  0.05rem', borderBottom: '1px solid #e3e3e3', verticalAlign: 'top' }, props.style || {})
    const colsSpan = props.colsSpan || 1
    return <th colSpan={colsSpan} style={style} className={cls(`text-${props.textAlign}`, `color-${props.textColor}`)}>
        {props.children}
    </th>
}
Table.Td.propTypes = {
    ratio: PropTypes.number,
    textAlign: PropTypes.oneOf(['left', 'right', 'center']),
    textColor: PropTypes.oneOf(['red', 'blue', 'green', 'light-blue', 'orange', 'gray'])
}

Table.Td.defaultProps = {
    textColor: 'gray',
    textAlign: 'center'
}
Table.Th.defaultProps = {
    textColor: 'gray',
    textAlign: 'center'
}


module.exports = Table