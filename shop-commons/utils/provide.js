import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';

function mapStateToProps(state) {
    return state;
}

export function provide(actions, reducer) {
    return function (target) {
        const controller = connect(mapStateToProps, actions)(target);
        const store = applyMiddleware(promiseMiddleware())(createStore)(reducer);
        return class extends Component {
            render() {
                return <Provider store={store}>
                    {
                        React.createElement(controller)
                    }
                </Provider>
            }
        }
    }
}