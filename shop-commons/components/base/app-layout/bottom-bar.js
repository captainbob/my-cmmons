import React from 'react';

export default class Filter extends React.Component {
    render() {
        return <div style={{ width:'100%', height:'100%', position:'relative', boxShadow: '0px -1px 5px #f3f3f3' }}>
            {this.props.children}
        </div>
    }
}