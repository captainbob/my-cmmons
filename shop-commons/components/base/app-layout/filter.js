import React from 'react';

export default class Filter extends React.Component{
    render() {
        return (
            <div style={{background:'#f5f5f5'}}>
                {this.props.children}
            </div>
        )
    }
}