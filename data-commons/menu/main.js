import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Layout, Icon, Popover, Badge } from 'antd'
import classnames from 'classnames'
import ChangePasswordModal from './change-password-modal'
import queryString from 'query-string'
import { HttpUtil } from 'djmodules-utils/lib'
import { Motion, spring } from 'react-motion';
import "./style/menu.less"
let modalKey = 0

class Menu extends Component {
    // #region init
    static propTypes = {
        prefixCls: PropTypes.string,
        sideMenus: PropTypes.array,
        topMenus: PropTypes.array,
        sideMenusIcon: PropTypes.object,
        user: PropTypes.object,
        logoElement: PropTypes.node,
        collapsible: PropTypes.bool
    }

    static defaultProps = {
        prefixCls: 'dj-data-menu',
        sideMenus: [],
        sideMenusIcon: {},
        topMenus: [],
        user: {
            displayName: '未知名称'
        },
        logoElement: '店+ 服务平台',
        collapsible: false
    }

    // #endregion

    //#region life cycle
    constructor(props) {
        super(props)
        const params = queryString.parse(document.location.search)

        this.state = {
            activeModule: params['module'],
            activeFunction: params['function'],
            collapse: params['module'] ? true : false,
            changePasswordModalVisible: false,
            unprocessedOrderNum: 0,
            unprocessedRefundNum: 0
        }
    }

    componentDidMount() {
        this.contentDiv.addEventListener('scroll', this.onContentScroll)

        //polling message from server per 5 miniutes
        this._pollingMessage()
    }

    _pollingMessage = () => {
        if (typeof window.userInfo == 'undefined') return

        if (typeof window.userInfo.brandId == 'undefined') return

        if (typeof window.userInfo.userId == 'undefined') return

        if (typeof window.userInfo.storageId == 'undefined') return

        HttpUtil.get('order/base/get_wait_manage_ordersummmary.do', {
            "brandId": window.userInfo.brandId,
            "staffId": window.userInfo.userId,
            "storageId": window.userInfo.storageId
        }).then((json) => {
            if (json['resultCode'] === 'success' && json['extPara']) {
                if (json['extPara']['waitManageOrderNum'] && json['extPara']['orderRefundApplayNum']) {
                    this.setState({
                        unprocessedOrderNum: json.extPara.waitManageOrderNum || 0,
                        unprocessedRefundNum: json.extPara.orderRefundApplayNum || 0
                    });
                }
            }
        }).then(() => {
            setTimeout(this._pollingMessage, 5 * 60 * 1000);
        })
    }

    componentWillUnmount() {
        this.contentDiv.removeEventListener('scroll', this.onContentScroll)
    }

    render() {
        const { prefixCls, children } = this.props
        const sider0Cls = classnames(`${prefixCls}-sider0`)
        const sider1Cls = classnames(`${prefixCls}-sider1`, { [`${prefixCls}-sider1-open`]: this.state.collapse }, { [`${prefixCls}-sider1-close`]: !this.state.collapse })
        const siderWapper1Cls = classnames(`${prefixCls}-sider1-wapper`)
        const headerCls = classnames(`${prefixCls}-header`)
        const bodyCls = classnames(`${prefixCls}-body`)
        const contentCls = classnames(`${prefixCls}-content`)
        const menuCls = classnames(`${prefixCls}`)
        const logoCls = classnames(`${prefixCls}-logo`)
        const headerMenuCls = classnames(`${prefixCls}-header-menu`)
        const separatorCls = classnames(`${prefixCls}-separator`)
        const topLeftCls = classnames(`${prefixCls}-top-left`)
        const topRightCls = classnames(`${prefixCls}-top-right`)

        return (
            <div className={menuCls + " dj-menu-content"}>
                <div className={headerCls}>
                    <div className={logoCls}>
                        {this.props.logoElement}
                    </div>
                    <div className={headerMenuCls}>
                        <div className={topLeftCls}>
                            {this.frontMenus}
                            {this.sider0Menus}
                            {this.topMenus}
                        </div>
                        <div className={topRightCls}>
                            {/* {this.rqCode} */}
                            {/* {this.help} */}
                            {/* {this.message} */}
                            {this.userInfo}
                        </div>
                    </div>
                </div>
                <div className={bodyCls}>
                    {/* <div className={sider0Cls}>
                        {this.collapseMenu}
                        {this.sider0Menus}
                    </div> */}
                    <div className={sider1Cls}>
                        <div className={siderWapper1Cls} >
                            {this.sider1Menus}
                        </div>
                    </div>
                    <div className={separatorCls}></div>
                    <div className={contentCls} ref={c => this.contentDiv = c}>
                        {children}
                    </div>
                </div>
                <ChangePasswordModal key={modalKey++}
                    defaultVisible={this.state.changePasswordModalVisible}
                    onOk={() => { this.setState({ changePasswordModalVisible: false }) }}
                    onCancel={() => { this.setState({ changePasswordModalVisible: false }) }}></ChangePasswordModal>
            </div>
        )
    }
    //#endregion

    //#region reponse    
    onSlider0MenuClick = (menu) => {
        if (!this.state.collapse)
            return this.setState({ activeModule: menu.menuId, collapse: true })
        this.setState({ activeModule: menu.menuId })
    }

    onSlider1MenuClick = (e, menu) => {
        this.setState({ activeFunction: menu.menuId })
        if (e.target.nodeName == "A") {
            return;
        }
        //third part menu
        if (menu.menuType) {
            HttpUtil.get('sys/thirdmenu/get_user_code.do', null).then((json) => {
                if (json['resultCode'] === 'success') {
                    this.contentDiv.innerHTML = '<iframe id="thirdContent" src="' + menu.url + '&code=' + json['resultObject'] + '" style="border:0;width:100%;height:100%;"></iframe>';
                }
            })
        } else {
            let href = "";
            if (menu.url.startsWith('#')) {
                href = `${menu.url.indexOf('?') > -1 ? '&' : '?'}module=${this.state.activeModule}&function=${menu.menuId}&wapper=menu${menu.url}`
            } else {
                href = `${menu.url}${menu.url.indexOf('?') > -1 ? '&' : '?'}module=${this.state.activeModule}&function=${menu.menuId}&wapper=menu`
            }
            if (this.props.getChangeUrl) {
                document.location.href = this.props.getChangeUrl(href);
            } else {
                document.location.href = `${window._path || '/'}${href}`
            }

        }
    }

    onCollapseMenuClick = () => {
        this.setState((preState, props) => {
            preState.collapse = !preState.collapse
            return preState
        })
    }

    onContentScroll = (event) => {
        const dispatchEvent = document.createEvent('HTMLEvents')
        dispatchEvent.initEvent('menucontentscroll', true, true)
        dispatchEvent.realScrollTarget = event.target
        document.dispatchEvent(dispatchEvent)
    }

    onChangePassword = () => {
        this.setState({ changePasswordModalVisible: true })
    }

    onLogout = () => {
        document.location.href = window._path + '/logout/cas'
    }

    onHandleMessage = (type) => {
        var shopUrl = this.props.topMenus.find((menu) => {
            return menu.menuId.toString() === '62';
        });

        switch (type) {
            case 0:
                this.setState({ unprocessedOrderNum: 0 })
                window.open((shopUrl && shopUrl['contextPath']) + '/order/order_refund_wechat_list.html?module=31&function=3190&wapper=menu');
                break
            case 1:
                this.setState({ unprocessedRefundNum: 0 })
                window.open((shopUrl && shopUrl['contextPath']) + '/order/order_callout_list.html?module=31&function=3125&wapper=menu');
                break
        }
    }
    //#endregion 

    //#region getter and setter    
    get sider0Menus() {
        const { sideMenusIcon } = this.props
        return this.props.sideMenus.map(item => {
            const { prefixCls } = this.props
            const sider0MenuCls = classnames(`${prefixCls}-sider0-menu`, { [`${prefixCls}-sider0-menu-selected`]: item.menuId == this.state.activeModule })
            return (
                <Motion style={{ x: item.menuId == this.state.activeModule ? spring(100) : 0 }}>
                    {({ x }) =>
                        <div
                            key={item.menuId}
                            className={sider0MenuCls}
                            onClick={() => { this.onSlider0MenuClick(item) }}
                        >
                            <div>{item.menuType ? item.moduleName : item.name}</div>
                            <div
                                style={{
                                    borderBottom: '4px solid rgba(55,140,241,1)',
                                    width: `${x}%`,
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                }}
                            ></div>
                        </div>
                    }
                </Motion>
            )
        })
    }

    get sider1Menus() {
        const { roleId } = window.userInfo || {};
        let i = 0;
        const selectSider0Menu = this.props.sideMenus.filter(item => {
            return item.menuId == this.state.activeModule
        })[0]

        const { prefixCls, subMenusIcon } = this.props

        if (selectSider0Menu && selectSider0Menu.children && selectSider0Menu.children.length > 0) {
            let groups = {};

            selectSider0Menu.children.forEach(function (item) {
                //10097、10091、10159 的店长做特殊处理:店长的门店销售排名给屏蔽掉
                let forbiddenList = ["10097", "10091", "10159"];
                if (forbiddenList.indexOf(window.currentBrandId) > -1) {
                    if (roleId == "6" || roleId == "7") {
                        if (item.menuId == "5214") {
                            return
                        }
                    }
                }
                if (groups[item.groupName]) {
                } else {
                    groups[item.groupName] = [];
                }
                groups[item.groupName].push(item)
            });
            let views = [];
            for (let groupName in groups) {
                if (groups.hasOwnProperty(groupName)) {
                    let menus = groups[groupName];

                    let subMenuView = menus.map(menu => {
                        const sider1MenuCls = classnames(`${prefixCls}-sider1-menu`, { [`${prefixCls}-sider1-menu-selected`]: menu.menuId == this.state.activeFunction })

                        if (menu.menuType) {
                            return (
                                <div key={menu.menuId} className={sider1MenuCls} onClick={(e) => { this.onSlider1MenuClick(e, menu) }}>
                                    {menu.name}
                                </div>
                            )
                        } else {
                            let href = "";
                            if (menu.url.startsWith('#')) {
                                href = `${menu.url.indexOf('?') > -1 ? '&' : '?'}module=${this.state.activeModule}&function=${menu.menuId}&wapper=menu${menu.url}`
                            } else {
                                href = `${menu.url}${menu.url.indexOf('?') > -1 ? '&' : '?'}module=${this.state.activeModule}&function=${menu.menuId}&wapper=menu`
                            }
                            if (this.props.getChangeUrl) {
                                href = this.props.getChangeUrl(href);
                            } else {
                                href = `${window._path || '/'}${href}`
                            }
                            return (
                                <div key={menu.menuId} className={sider1MenuCls} onClick={(e) => { this.onSlider1MenuClick(e, menu) }}>
                                    {
                                        // <i className="iconfont menu-icon" dangerouslySetInnerHTML={{
                                        //     __html: subMenusIcon[menu.menuId] || "&#xe63e;"
                                        // }}></i>
                                    }
                                    <a className={`${prefixCls}-sider1-menu-title`} href={href} >{menu.name}</a>
                                </div>
                            )
                        }
                    });

                    const sider1MenuGroupCls = `${prefixCls}-sider1-menu-group`;

                    if (groupName) {
                        views.push(
                            <h3 key={groupName + (i++)} className={sider1MenuGroupCls}>
                                {groupName}
                            </h3>)
                    } else {
                        views.push(
                            <div key={groupName + (i++)} style={{ marginTop: 10 }}>
                            </div>)
                    }
                    views.push(subMenuView);
                }
            }
            views.push(
                <div key={"g-" + (i++)} style={{ marginBottom: 10 }}>
                </div>)
            return views;
        }
    }
    //下拉
    get collapseMenu() {
        const { prefixCls, collapsible } = this.props
        const collapseCls = classnames(`${prefixCls}-collapse`)
        return collapsible ? <div className={collapseCls} onClick={this.onCollapseMenuClick}>
            {this.state.collapse ? <Icon type="menu-unfold" /> : <Icon type="menu-fold" />}
        </div> : undefined
    }
    //顶部菜单
    get topMenus() {
        const { topMenus, prefixCls } = this.props;
        const menuCls = classnames(`${prefixCls}-top-menu`, `${prefixCls}-top-menu-fixed-width`);

        return topMenus.map((item, index) => {

            return (
                <div className={classnames(`${prefixCls}-sider0-menu`)}>
                    <div
                    >
                        <a
                            key={item.menuId} href={item.contextPath + item.url} target="_blank" className={menuCls} style={{ height: 'auto', display: 'inline-block', verticalAlign: "top" }}>
                            <span style={{ color: '#393E44' }}>
                                {item.name}
                            </span>
                        </a>
                    </div>
                    <div
                        style={{
                            borderBottom: '4px solid rgba(55,140,241,1)',
                            position: "absolute",
                            width: 'auto',
                            bottom: 0,
                            left: 0,
                        }}
                    ></div>
                </div>
            )
        }
        )
    }
    //第一个菜单
    get frontMenus() {
        const { frontMenus, prefixCls } = this.props
        const menuCls = classnames(`${prefixCls}-top-menu`, `${prefixCls}-top-menu-fixed-width`);

        return frontMenus.map((item, index) => {
            return (
                <div className={classnames(`${prefixCls}-sider0-menu`)}>
                    <div >
                        <a key={item.menuId} href={window._path + "/" + item.contextPath} className={menuCls} style={{ height: 'auto', display: 'inline-block', verticalAlign: "top" }}>
                            <span style={{ color: '#393E44' }}>{item.name}</span>
                        </a>
                    </div>
                </div>
            )
        }
        )
    }
    get rqCode() {
        const { prefixCls } = this.props
        const topMenuCls = classnames(`${prefixCls}-top-menu`, `${prefixCls}-right-top-menu-padding`)
        const rqCodeCls = classnames(`${prefixCls}-rqcode`)
        const content = (
            <div className={rqCodeCls}>
                <img src="//file.dianjia.io/html/shop/img/erweima.png"
                    alt="二维码" />
                <div>导购端下载</div>
            </div>
        )
        return <Popover trigger="hover" content={content}>
            <div className={topMenuCls}>
                下载APP
            </div>
        </Popover>
    }

    get help() {
        const { prefixCls } = this.props
        const topMenuCls = classnames(`${prefixCls}-top-menu`, `${prefixCls}-right-top-menu-padding`)
        return (
            <a href="http://help.dianjia.io/" target="_blank" className={topMenuCls}>
                <span>帮助文档</span>
            </a>
        )
    }

    get message() {
        const { prefixCls } = this.props
        const topMenuCls = classnames(`${prefixCls}-top-menu`, `${prefixCls}-right-top-menu-padding`)
        const hasMessage = this.state.unprocessedOrderNum + this.state.unprocessedRefundNum > 0
        const messageItemCls = classnames(`${prefixCls}-message-item`)
        const content = (
            <ul>
                {
                    this.state.unprocessedOrderNum > 0 ? <li className={messageItemCls} onClick={() => { this.onHandleMessage(0) }}>
                        <i className="fa fa-bell-o"></i>&nbsp;您当前共有{this.state.unprocessedOrderNum}笔未处理订单
                    </li> : undefined
                }
                {
                    this.state.unprocessedRefundNum > 0 ? <li className={messageItemCls} onClick={() => { this.onHandleMessage(1) }}>
                        <i className="fa fa-bell-o"></i>您当前共有{this.state.unprocessedRefundNum}笔未处理退款
                    </li> : undefined
                }
            </ul>
        )

        return <Popover placement="bottomRight" content={content} trigger={hasMessage ? 'hover' : ''}>
            <div className={topMenuCls}>
                <Badge dot={hasMessage}>
                    <i className="fa fa-bell-o"></i>
                </Badge>
            </div>
        </Popover>
    }

    get userInfo() {
        const { prefixCls, user } = this.props
        const topMenuCls = classnames(`${prefixCls}-top-menu`, `${prefixCls}-right-top-menu-padding`)
        const userInfoImg = classnames(`${prefixCls}-userInfo-img`)
        const userInfoName = classnames(`${prefixCls}-userInfo-name`)
        const userInfoEdit = classnames(`${prefixCls}-userInfo-edit`)
        const content = (
            <ul>
                <li className={userInfoEdit} onClick={this.onChangePassword}><i className="fa fa-lock"></i>&nbsp;修改密码</li>
                <li className={userInfoEdit} onClick={this.onLogout}><i className="fa fa-sign-out"></i>&nbsp;注销</li>
                <li className={userInfoEdit}>版本:{window.version || '1.0.0'}</li>
            </ul>
        )
        return < Popover trigger="hover" content={content} >
            <div className={topMenuCls}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <span className={userInfoName}>{user.displayName}</span>&nbsp;
                            </td>
                            <td>
                                <img className={userInfoImg}
                                    src="https://file.dianjia.io/resources/product/images/brand.png" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Popover >
    }

    //#endregion
}

Menu.wrapperContainer = function (target) {
    return class extends Component {
        render() {
            const props = Object.assign({
                getCalendarContainer: this.getCalendarContainer,
                getPopupContainer: this.getPopupContainer,
                target: this.getPopupContainer
            }, this.props)
            return React.createElement(target, props)
        }

        getCalendarContainer = () => {
            return document.getElementsByClassName('dj-menu-content')[0]
        }

        getPopupContainer = () => {
            return document.getElementsByClassName('dj-menu-content')[0]
        }
    }
}

module.exports = Menu