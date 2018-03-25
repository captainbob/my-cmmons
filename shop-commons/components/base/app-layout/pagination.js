import React from 'react';

export default class Pagination extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}