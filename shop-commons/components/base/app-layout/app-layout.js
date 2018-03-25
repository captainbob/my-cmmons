import * as React from 'react';
import {any, filter} from 'ramda';
import { Spin, Pagination as AntPagination, Row, Col, Modal } from 'antd';
import Header from './header';
import Filter from './filter';
import Operations from './operations';
import Content from './content';
import BottomBar from './bottom-bar';
import Pagination from './pagination';
import CustomTable from '../../drp/custom-table';
import PropTypes from 'prop-types';
const AppLayoutElementTypes = [Header, Filter, Operations, Content, BottomBar, Pagination];

const MARGIN = 5;

const AppLayoutElementsWithOutContentContainerId = '@@__app_layout_without_content_container__@@';
const AppLayoutBottomBarContainerId = '@@__app_layout_bottom_bar_container__@@';

const BOTTOM_BAR_HEIGHT = 70;

class DefaultAppLayout extends React.Component{
    state = {
        height: -1
    }

    static defaultProps = {
        __isWrap: false
    }

    componentDidMount() {
        if (!this.props.__isWrap) {
            window.addEventListener('resize', this.onResize);
            document.addEventListener('collapsechange', this.onResize);
            document.addEventListener('togglefullscreen', this.onResize);
            document.addEventListener('autoadjustformcollapse', this.onResize);
            this.onResize();
        } 
    }

    componentWillUnmount() {
        if (!this.props.__isWrap) {
            window.removeEventListener('resize', this.onResize);
            document.removeEventListener('collapsechange', this.onResize);
            document.removeEventListener('togglefullscreen', this.onResize);
            document.removeEventListener('autoadjustformcollapse', this.onResize);
        }
    }

    onResize = () => {
        this.setState({height:this.height});
    }

    get height() {
        const container = this.props.container || document.getElementsByClassName('dj-menu-content')[0] || document.body;
        const height = container.clientHeight;
        return height;
    }

    render() {
        const children = React.Children.toArray(this.props.children);
        const appLayoutElements = getAppLayoutElements(children, [BottomBar, Content, Pagination]);
        const otherElements = getOtherElements(children);
        const content = getContent(children);
        const pagination = getPagination(children);
        const bottomBar = getBottomBar(children);
        let height = this.height;
        if (!this.props.__isWrap) {
            height = this.state.height;
        }
        return bottomBar ? <div style={{height:height, position: 'relative'}}>
                    <div style={{position:'absolute', top: 0, left: 0, right: 0, bottom: BOTTOM_BAR_HEIGHT, paddingLeft: MARGIN, paddingRight: MARGIN, overflow: 'auto'}}>
                        {
                            this.elementsWithoutBottomBar(appLayoutElements, content, pagination,  otherElements, bottomBar)
                        }
                    </div>
                    {
                        <div id={AppLayoutBottomBarContainerId} style={{position:'absolute', left: 0, right: 0, bottom: 0, height: BOTTOM_BAR_HEIGHT, background: 'white'}}>
                            {bottomBar}
                        </div>
                    }
                </div> : <div style={{paddingLeft: MARGIN, paddingRight: MARGIN}}>
                    {
                        this.elementsWithoutBottomBar(appLayoutElements, content, pagination, otherElements, bottomBar)
                    }
        </div>
    }

    elementsWithoutBottomBar = (appLayoutElements, content, pagination, otherElements, bottomBar) => {
        return  <div style={{minWidth: bottomBar ? 1024 : ''}}>
            <Spin spinning={this.props.loading || false}>
                <div id={AppLayoutElementsWithOutContentContainerId}>
                    {
                        appLayoutElements.map((item, index)=> { 
                            const style = {};
                            if (index != 0) {
                                Object.assign(style, { marginTop: MARGIN });
                            }
                            return <div style={style}>
                                {
                                    item
                                }
                            </div>
                        })
                    }
                </div>
                {
                    appLayoutElements.length > 0 ? (content ? <div style={{marginTop: MARGIN}}>{content}</div>:content): content
                }
                {
                    pagination ? <div style={{marginTop: MARGIN}}>{pagination}</div> : null
                }
            </Spin>
            {
                otherElements
            }
        </div>
    }
}

@wrap
class ListAppLayout extends React.Component {
    render() {
        const { loading, children, table, pagination, operations } = this.props;
        const scroll = {x: 0, y: this.props.maxContentHeightInClient - ((table || {}).headerHeight || 30)};

        if (table && table.columns && Array.isArray(table.columns)) {
            for(let i=0; i<table.columns.length;i++) {
                const c = table.columns[i];
                scroll.x = scroll.x + c.width;
                if (c.title && (typeof c.title.header != 'undefined' && typeof c.title.body != 'undefined')) {
                    scroll.y = this.props.maxContentHeightInClient - (table.headerHeight || BOTTOM_BAR_HEIGHT);
                }
            }
        }

        return <DefaultAppLayout __isWrap={true} loading={loading}>
            {
                table ? <Content>
                    <CustomTable pagination={false} columns={table.columns} dataSource={table.dataSource} scroll={scroll}></CustomTable>
                </Content> : null
            }
            {
                pagination || operations ? <Operations>
                    <Row>
                        <Col span={12}>
                            {
                                operations
                            }
                        </Col>
                        <Col span={12}>
                            <AntPagination {...pagination}></AntPagination>
                        </Col>
                    </Row>
                </Operations> : null
            }
            {
                children
            }
        </DefaultAppLayout>
    }
}

export default class AppLayout extends React.Component {
    static Header = Header;
    static Content = Content;
    static BottomBar = BottomBar;
    static Filter = Filter;
    static Operations = Operations;
    static Pagination = Pagination;
    static wrap = wrap;

    static propTypes = {
        mode: PropTypes.oneOf(['list', 'default', 'detail'])
    }

    static defaultProps = {
        mode: 'default'
    }

    render() {
        const { mode, ...otherProps } = this.props;
        switch(mode) {
            case 'default': return <DefaultAppLayout {...otherProps}></DefaultAppLayout>;
            case 'list': return <ListAppLayout {...otherProps}></ListAppLayout>;
        }
        return null;
    }
}

function wrap (target) {
    return class extends React.Component {

        state = {
            maxContentHeightInClient: -1
        }

        componentDidMount() {
            window.addEventListener('resize', this.onResize);
            document.addEventListener('collapsechange', this.onResize);
            document.addEventListener('togglefullscreen', this.onResize);
            document.addEventListener('autoadjustformcollapse', this.onResize);
            this.onResize()
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.onResize);
            document.removeEventListener('collapsechange', this.onResize);
            document.removeEventListener('togglefullscreen', this.onResize);
            document.removeEventListener('autoadjustformcollapse', this.onResize);
        }

        onResize = () => {
            let content = document.getElementsByClassName('dj-menu-content')[0];
            if (typeof content == 'undefined') {
                content = document.body;
            }
            let element = document.getElementById(AppLayoutElementsWithOutContentContainerId);
            this.setState({
                maxContentHeightInClient: content.clientHeight - element.clientHeight - 20 - (document.getElementById(AppLayoutBottomBarContainerId) ? BOTTOM_BAR_HEIGHT : 0)
            });
        }

        render() {
            return React.createElement(target, Object.assign({}, this.props, {
                maxContentHeightInClient: this.state.maxContentHeightInClient,
                appLayoutResize: () => {
                    this.onResize();
                }
            }));
        }
    }
}

function getBottomBar(children) {
    for(let i=0;i<children.length;i++) {
        if (children[i].type == BottomBar) {
            return children[i];
        }
    }
    return null;
}

function getContent(children) {
    for(let i=0;i<children.length;i++) {
        if (children[i].type == Content) {
            return children[i];
        }
    }
    return null;
}

function getPagination(children) {
    for(let i=0;i<children.length;i++) {
        if (children[i].type == Pagination) {
            return children[i];
        }
    }
    return null;
}

function getAppLayoutElements(children, excludeTypes) {
    const results = [];
    (children || []).forEach(child => {
        for(let i=0; i<AppLayoutElementTypes.length; i++) {
            if (child.type == AppLayoutElementTypes[i]) {
                let flag = true;
                for(let j=0;j<excludeTypes.length; j++) {
                    if (child.type == excludeTypes[j]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    results.push(child);
                }
                break;
            }
        }
    });
    results.sort((a, b)=>{
        return getWeight(a) - getWeight(b);
    });
    return results;
}

function getOtherElements(children) {
    const results = [];
    (children || []).forEach(child => {
        let flag = true;
        for(let i=0;i<AppLayoutElementTypes.length;i++) {
            if (AppLayoutElementTypes[i] == child.type) {
                flag = false;
                break;
            }
        }
        if (flag) results.push(child);
    })
    return results;
}

function getWeight(appLayoutElement) {
    switch(appLayoutElement.type) {
        case Header: return 1;
        case Filter: return 2;
        case Operations: return 3;
        case Content: return 4;
        case BottomBar: return 5;
    }
    return 1000;
}