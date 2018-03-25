import ReactDOM from 'react-dom';
import { Menu } from 'djmodules';
import { HttpUtil } from 'djmodules-utils';
import { observer } from 'mobx-react';
import { Spin } from 'antd';
import QueryString from 'query-string';
import 'moment/locale/zh-cn';

const systemMenus = window.menus;
const thirdMenus = window.thirdmenus;
const brandId = window.userInfo.brandId;
const roleId = window.currentRoleId;
const user = window.userInfo;
const sideMenusIcon = {
    "80": "fa fa-home",	//商家
    "10": "fa fa-th-large",	//商品
    "20": "fa fa-user",	//会员
    "30": "fa fa-pie-chart",	//订单
    "40": "fa fa-tags",	//营销
    "50": "fa fa-cubes",//库存
    "60": "fa fa-heart",//评价
    "70": "fa fa-weixin",	//微信
    "71": "fa fa-shopping-cart",	//商城
    "81": "fa fa-graduation-cap",	//业绩
    "110": "fa fa-sitemap",	//分销
    "160": "fa fa-dollar",	//财务
    "170": "fa fa-gear",//设置
    "180": "fa fa-clock-o",//待办
    "98": "fa fa-plug",	//API
    "13": "fa fa-cny",	// 收银台
    "14": "fa fa-cny",	// 收银台
    /**pos***********************************/
    "15": "fa fa-th-large",	//商品
    "21": "fa fa-user",	//会员
    "31": "fa fa-pie-chart",	//订单
    "41": "fa fa-tags",	//营销
    "82": "fa fa-home",	//商家
    "83": "fa fa-graduation-cap",	//业绩
    /** ******** dianzhang ************************** */
    "11": "fa fa-th-large",  //商品
}
let pageContent;

const logoElement = (
    <p>
        <div style={{
            float: "left",
            fontSize: "21px",
            padding: "0px 12px",
            borderRight: "1px solid rgb(0, 0, 0)"
        }}>店+</div>
        <a href='/'
            style={{ display: 'block', color: '#f4424e' }}>服务平台</a>
    </p>
)

function getParamVal(paramName) {
    const url = location.search;
    if (url) {
        let paramArr = [];
        url.substr(1).split('&').map(item => {
            paramArr[item.split('=')[0]] = item.split('=')[1];
        })
        return paramArr[paramName];
    } else {
        return '';
    }
}

function handleThirdMenus(thirdMenus) {
    let result = [];
    (thirdMenus && thirdMenus.menuModules || []).map((menu) => {
        menu['children'] = (thirdMenus.menuMenus || []).filter((item => {
            return item.moduleId.toString() === menu.moduleId.toString();
        }));
        result.push(menu);
    });
    return result;
}

String.prototype.startWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substr(0, s.length) == s)
        return true;
    else
        return false;
    return true;
}

function getChangeUrl(url) {

    const searchString = (url.split('?') || {})[1];

    const module = QueryString.parse(searchString).module;
    const routeName = window.webRouteName;
    const moduleHostMap = (window.routeTables || []).reduce((total, next) => {
        total[next.module] = next.root;
        return total;
    }, {});


    if (!url.startWith("http") && !url.startWith("/")) {
        url = "/" + url;
    }
    let route = routeName ? ("&route=" + routeName) : "";

    let rpath = moduleHostMap[module] || moduleHostMap['default'] || _path;
    if (url.startWith("http")) {
        rpath = "";
    }
    if (url.startWith("/views/modules/common/")) {
        return rpath + url + route;
    }
    if (url.startWith("/views/modules/4.0/")) {
        return rpath + url + route;
    }
    let urls = url.split("?");

    if (urls.length == 1) {
        return rpath + "/views/modules/common/menu.html?menupath=" + encodeURIComponent(urls[0]) + route;
    }

    return rpath + "/views/modules/common/menu.html?menupath=" + encodeURIComponent(urls[0]) + "&" + urls[1] + route;
}

function getPageFrame(systemMenus, thirdMenus, currentSystem, menuProps) {
    let menuObject = {
        topMenus: [],
        sideMenus: []
    };

    menuObject.topMenus = systemMenus.filter((item) => {
        return item.leafNode === true && item.contextPath && item.name !== currentSystem;
    });

    menuObject.sideMenus = systemMenus.filter((item) => {
        return item.leafNode !== true && !item.contextPath;
    });

    /***
     * 过滤菜单，只展示附和条件的
     * @type {Array.<*>}
     */
    menuObject.sideMenus = menuObject.sideMenus.filter((item) => {
        return !(/^(6\d{2})$/.test(item.menuId));
    });

    let resultThirdMenus = handleThirdMenus(thirdMenus);

    resultThirdMenus = resultThirdMenus.filter((menu) => {
        return menu.roleId.toString() === roleId.toString();
    });

    resultThirdMenus.map((thirdMenu) => {
        menuObject.sideMenus.unshift(thirdMenu);
    });

    ReactDOM.render(
        <Menu
            collapsible
            topMenus={menuObject.topMenus}
            sideMenus={menuObject.sideMenus}
            user={user}
            sideMenusIcon={sideMenusIcon}
            logoElement={logoElement}
            getChangeUrl={getChangeUrl}
            {...menuProps}>
            {pageContent}
        </Menu>,
        document.getElementById("root"));
}

export function RootPageRender(content, menuProps = {}) {
    const queryStrings = QueryString.parse(window.location.search);
    if (queryStrings.nomenu == 'true') {
        ReactDOM.render(content, document.getElementById("root"));
    } else {
        pageContent = (content);
        getPageFrame(systemMenus, thirdMenus, 'shop', menuProps);
    }
}

RootPageRender.getChangeUrl = getChangeUrl;

export function PageRender(content, menuProps = {}) {
    // const queryStrings = QueryString.parse(window.location.search);
    // if (queryStrings.nomenu == 'true') {
    //     ReactDOM.render(content, document.getElementById("root"));
    // } else {
    //     ReactDOM.render(content, document.getElementsByClassName('dj-menu-content')[0] || document.getElementById('root'))
    // }
    return RootPageRender(content)
}

PageRender.getChangeUrl = getChangeUrl;
