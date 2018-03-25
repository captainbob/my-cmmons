import React from 'react';

export default class Operations extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}