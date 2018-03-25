import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

class TrackingManager {
    cache = new Map();

    add(scope, row, col, input) {
        this.getScope(scope)[this.key(row, col)] = input;
    }

    remove(scope, row, col, input) {
        this.getScope(scope)[this.key(row, col)] = undefined;
    }

    get(scope, row, col) {
        return this.getScope(scope)[this.key(row, col)];
    }

    getScope(scope) {
        if (!this.cache.has(scope)) {
            this.cache.set(scope, {});
        }
        return this.cache.get(scope);
    }

    key(row, col) {
        return `row-${row}-col-${col}`;
    }

    up(currentInput, scope, row, col, maxRow, maxCol) {
        this.move('up', currentInput, scope, row, col, maxRow, maxCol);
    }

    down(currentInput, scope, row, col, maxRow, maxCol) {
        this.move('down', currentInput, scope, row, col, maxRow, maxCol);
    }

    left(currentInput, scope, row, col, maxRow, maxCol) {
        this.move('left', currentInput, scope, row, col, maxRow, maxCol);
    }

    right(currentInput, scope, row, col, maxRow, maxCol) {
        this.move('right', currentInput, scope, row, col, maxRow, maxCol);
    }

    move(direction, currentInput, scope, row, col, maxRow, maxCol) {
        let nextRow = this.nextRow(direction, row, maxRow);
        let nextCol = this.nextCol(direction, col, maxCol);
        let index = 0;
        while(true) {
            const nextInput = this.get(scope, nextRow, nextCol);
            if (nextInput) {
                if (nextInput === currentInput) {
                    break;
                } else {
                    nextInput.doFocus();
                    break;
                }
            }
            nextRow = this.nextRow(direction, nextRow, maxRow);
            nextCol = this.nextCol(direction, nextCol, maxCol);
            index = index + 1;
            if (index > Math.max(maxRow, maxCol)) {
                throw new Error('Invalid row and col');
            }
        }
    }

    nextRow(direction, row, maxRow) {
        if (direction == 'up') {
            return (row - 1 + maxRow) % maxRow;
        }
        if (direction == 'down') {
            return (row + 1) % maxRow;
        }
        return row;
    }

    nextCol(direction, col, maxCol) {
        if (direction == 'left') {
            return (col - 1 + maxCol) % maxCol;
        }
        if (direction == 'right') {
            return (col + 1) % maxCol;
        }
        return col;
    }
}

const TRACKING_MANAGER = new TrackingManager();

const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;

const MAX_COL_ROW = 10000;

export default class InputNumber extends Component {
    static propTypes = {
        row: PropTypes.number,
        col: PropTypes.number,
        maxRow: PropTypes.number,
        maxCol: PropTypes.number
    }

    static defaultProps = {
        maxCol: MAX_COL_ROW,
        maxRow: MAX_COL_ROW,
        scope: 'default',
        col: 0,
        row: 0,
        autoFocus: false,
        loading: false
    }

    preNumber = '';

    doFocus() {
        try{
            this.refs.input.focus();
            this.refs.input.select();
        } catch (e) {
        }
    }

    componentDidMount() {
        if (this.isNumber(this.props.value)) {
            this.preNumber = this.props.value;
        }
        TRACKING_MANAGER.add(this.props.scope, this.props.row, this.props.col, this);

        if (this.props.autoFocus) {
            this.doFocus();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value != nextProps.value) {
            if (this.isNumber(nextProps.value)) {
                this.preNumber = nextProps.value;
            }
        }

        if (nextProps.row != this.props.row || nextProps.col != this.props.col) {
            TRACKING_MANAGER.remove(this.props.scope, this.props.row, this.props.col, this);
            TRACKING_MANAGER.add(this.props.scope, nextProps.row, nextProps.col, this);
        }

        if (nextProps.autoFocus != this.props.autoFocus && nextProps.autoFocus) {
            this.doFocus();
        }
    }

    componentWillUnmount() {
        TRACKING_MANAGER.remove(this.props.scope, this.props.row, this.props.col, this);
    }

    render() {
        const defaultStyle = {
            borderRadius: 4,
            padding: 5,
            border: '1px solid #d9d9d9',
            width: '100%',
            height: '100%',
            width: 100,
            height: 30
        }

        if (this.props.disabled) {
            Object.assign(defaultStyle, {
                opacity: '0.72',
                cursor: 'not-allowed',
                backgroundColor: '#f7f7f7'
            });
        }

        const { style, value, onChange, className, disabled, onBlur, onFocus, ...otherProps } = this.props;

        const newStyle = Object.assign({}, defaultStyle, style || {});

        return <div className={className} style={{position:'relative', width: newStyle.width, display:'inline-block'}}>
            <input  value={value} 
                    disabled={disabled || false}  
                    onChange={this.onChange}
                    onFocus={this.onFocus} 
                    onBlur={this.onBlur} 
                    ref='input' 
                    onKeyUp={this.onKeyUp} 
                    style={newStyle} {...otherProps}></input>
            {
                this.props.loading ? <div style={{background:'#f3f3f3', opacity: 0.7, position: 'absolute', top:0, left: 0, right: 0, bottom: 0, lineHeight: `${newStyle.height}px`, textAlign:'center'}}>
                    <Icon type="loading" style={{color: '#108ee9'}} />
                </div> : null
            }
        </div>
    }

    onFocus = (event) => {
        if (this.refs.input) {
            try {
                this.refs.input.select();
            } catch(e) {}
        }
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
        
    }

    isNumber = (value) => {
        return /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/.test(value);
    }

    onBlur = (event) => {
        if (!this.isNumber(this.refs.input.value)) {
            if (this.props.onChange) {
                this.props.onChange(this.preNumber);
            }
        }
        if (this.props.onBlur) {
            if(!this.isNumber(this.refs.input.value)) {
                event.target.value = this.preNumber;
            }
            this.props.onBlur(event);
        }
    }

    onChange = (event) => {
        if (this.props.onChange) {
            this.props.onChange(event.target.value);
        }

        if (this.isNumber(event.target.value) || event.target.value =='') {
            this.preNumber = event.target.value;
        }
    }

    onKeyUp = (event) => {
        switch(event.keyCode) {
            case UP:
                return this.up();
            case DOWN:
                return this.down();
            case LEFT:
                return this.left();
            case RIGHT:
                return this.right();
        }
    }

    up = ()  => {
        TRACKING_MANAGER.up(this, this.props.scope, this.props.row, this.props.col, this.props.maxRow, this.props.maxCol);
    }

    down = ()  => {
        TRACKING_MANAGER.down(this, this.props.scope, this.props.row, this.props.col, this.props.maxRow, this.props.maxCol);
    }

    left = ()  => {
        TRACKING_MANAGER.left(this, this.props.scope, this.props.row, this.props.col, this.props.maxRow, this.props.maxCol);
    }

    right = ()  => {
        TRACKING_MANAGER.right(this, this.props.scope, this.props.row, this.props.col, this.props.maxRow, this.props.maxCol);
    }
}