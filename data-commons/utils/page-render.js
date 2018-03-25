import ReactDOM from 'react-dom';
// import { Menu } from 'djmodules';
import Menu from '../menu/main.js';
//import 'djmodules/lib/components/dj-menu/style'
import { HttpUtil } from 'djmodules-utils/lib'
import { observer } from 'mobx-react';
import { Spin } from 'antd';
import QueryString from 'query-string';
import logo from './logo.png'

const systemMenus = window.menus;
const thirdMenus = window.thirdmenus;
const brandId = window.userInfo.brandId;
const roleId = window.currentRoleId;
const user = window.userInfo;
const icons = {
    "800": "fa fa-jpy",
    "801": "fa fa-credit-card-alt",
    "802": "fa fa-cog",
    "804": "fa fa-user-o",
}
// ["&#xe61c;", "&#xe63e;", "&#xe604;", "&#xe63f;", "&#xe640;", "&#xe647;"],
// ["&#xe648;", "&#xe6d3;", "&#xe64b;", "&#xe630;", "&#xe64c;", "&#xe64d;", "&#xe64e;"],
//     ["&#xe627;"],
//     ["&#xe68b;","&#xe84a;"],
// ["&#xe603;"],
//     ["&#xe603;"]
let pageContent;
const subMenusIcon = {
    // 销售分析
    "5210": "&#xe61c;",
    "5211": "&#xe63e;",
    "5212": "&#xe604;",
    "5213": "&#xe63f;",
    "5214": "&#xe640;",
    "5215": "&#xe647;",
    // 会员
    "5301": "&#xe648;",
    "5302": "&#xe6d3;",
    "5303": "&#xe64b;",
    "5304": "&#xe630;",
    "5305": "&#xe64c;",
    "5306": "&#xe64d;",
    "5307": "&#xe64e;",
    //商品分析
    "5401": "&#xe627;",
    //报表取数
    "5701": "&#xe68b;",
    // 帮助中心
    "5501": "&#xe603;",

}
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

function handleCustomMenus(systemMenus) {
    return new Promise(function (resolve) {
        resolve(systemMenus);
    })
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

const style = {
    logo: {
        height: '50px',
        width: '100%',
        backgroundPosition: '47px',
        float: 'left',
        cursor: 'pointer',
        color: 'white',
        fontSize: '16px',
        verticalAlign: 'middle',
        textAlign: 'center',
        lineHeight: '50px',
        borderBottom: "1px solid #e4e4e4",

    },
    a: {
        color: 'white'
    }
}

const logoElement = (

    <div style={style.logo}>
        <a >
            <img src={logo} style={{ marginTop: '10px' }}></img>
        </a>
        {/* <div style={{ verticalAlign: 'top', display: 'inline-block', marginLeft: 10, fontSize: 23, color: '#108ee9' }}>数据中心</div> */}
    </div>
)

function getPageFrame(systemMenus, thirdMenus, currentSystem, domId, handlerResize) {
    let menuObject = {
        topMenus: [],
        sideMenus: [],
        frontMenus: []
    };
    handleCustomMenus(systemMenus).then((resultMenus) => {
        menuObject.frontMenus = resultMenus.filter((item) => {
            return item.name == '首页';
            //return item.leafNode === true && item.contextPath && item.name !== currentSystem && item.name !== '商家后台';
        });

        menuObject.topMenus = resultMenus.filter((item) => {

            return (item.leafNode === true && item.contextPath && item.name !== currentSystem);
        });

        menuObject.sideMenus = resultMenus.filter((item) => {
            return item.name != '首页' && (item.leafNode !== true && !item.contextPath);
        });

        menuObject.sideMenus = menuObject.sideMenus.sort(function (a, b) {
            return a.sort - b.sort
        })

        return menuObject
    }).then((menuObject) => {
        let resultThirdMenus = handleThirdMenus(thirdMenus);
        resultThirdMenus = resultThirdMenus.filter((menu) => {
            return menu.roleId.toString() === roleId.toString();
        })
        resultThirdMenus.map((thirdMenu) => {
            menuObject.sideMenus.unshift(thirdMenu);
        })
        return menuObject;
    }).then((menuObject) => {
        let root = document.getElementById('root')
        if (domId) {
            root = document.getElementById(domId)
        }
        ReactDOM.render(
            <Menu
                collapsible
                topMenus={menuObject.topMenus}
                sideMenus={menuObject.sideMenus}
                user={user}
                sideMenusIcon={icons}
                subMenusIcon={subMenusIcon}
                logoElement={logoElement}
                // getChangeUrl={getChangeUrl}
                handlerResize={handlerResize}
                frontMenus={menuObject.frontMenus}
            >
                {pageContent}
            </Menu>, root)
    });
}
function getChangeUrl(url) {

    if (!url.startsWith("http") && !url.startsWith("/")) {
        url = "/" + url;
    }
    let rpath = _path;
    if (url.startsWith("http")) {
        rpath = "";
    }
    if (url.startsWith("/views/modules/common/")) {
        return rpath + url;
    }
    if (url.startsWith("/views/modules/")) {
        return rpath + url;
    }
    let urls = url.split("?");

    if (urls.length == 1) {
        return rpath + "/views/modules/common/menu.html?menupath=" + encodeURIComponent(urls[0]);
    }

    return rpath + "/views/modules/common/menu.html?menupath=" + encodeURIComponent(urls[0]) + "&" + urls[1];
}
export function RootPageRender(content, domId, handlerResize) {
    const queryStrings = QueryString.parse(window.location.search);
    if (queryStrings.nomenu == 'true') {
        ReactDOM.render(content, document.getElementById("root"));
    } else {
        pageContent = (content);
        getPageFrame(systemMenus, thirdMenus, 'data', domId, handlerResize);
    }
}


export function PageRender(content, domId, handlerResize) {
    return RootPageRender(content, domId, handlerResize);
    const queryStrings = QueryString.parse(window.location.search);
    if (queryStrings.nomenu == 'true') {
        ReactDOM.render(content, document.getElementById("root"));
    } else {
        ReactDOM.render(content, document.getElementsByClassName('dj-data-menu-content')[0] || document.getElementById('root'))
    }
}
