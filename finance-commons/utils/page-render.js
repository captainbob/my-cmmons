import ReactDOM from 'react-dom';
import { Menu,DjIcon} from 'djmodules';
//import 'djmodules/lib/components/dj-menu/style'
import { HttpUtil } from 'djmodules-utils/lib'
import { observer } from 'mobx-react';
import { Spin } from 'antd';
import './style/dj-icon.less';
import QueryString from 'query-string';

import logo from './logo-active.gif'

const systemMenus = window.menus;
const thirdMenus = window.thirdmenus;
const brandId = window.userInfo.brandId;
const roleId = window.currentRoleId;
const user = window.userInfo;
const icons = {
    "800": <DjIcon type={'fin-retail'}></DjIcon>,//"fa fa-jpy"
    "801": <DjIcon type={'fin-pool'}></DjIcon>, //"fa fa-credit-card-alt"
    "802": <DjIcon type={'fin-setting'}></DjIcon>,//"fa fa-cog"
    "803": <DjIcon type={'fin-Distributor'}></DjIcon>,//"fa fa-cog"
    "804": <DjIcon type={'fin-supply'}></DjIcon>,//"fa fa-user-o"
    "805": <DjIcon type={'fin-profit'}></DjIcon>//"fa fa-user-o"
}
let pageContent;

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
        background: '#262b35',
        height: '50px',
        width: '100%',
        backgroundPosition: '47px',
        float: 'left',
        cursor: 'pointer',
        color: 'white',
        fontSize: '16px',
        verticalAlign: 'middle',
        textAlign: 'center',
        lineHeight: '50px'
    },
    a: {
        color: 'white'
    }
}

const logoElement = (

    <div style={style.logo}>
        <a href='/'>
            <img src={logo} width='18%' style={{ marginTop: '10px' }}></img>
        </a>
        <div style={{ verticalAlign: 'top', display: 'inline-block', marginLeft: 10, fontSize: 23, color: '#108ee9' }}>智慧财务</div>
    </div>
)

function getPageFrame(systemMenus, thirdMenus, currentSystem, domId) {
    let menuObject = {
        topMenus: [],
        sideMenus: []
    };
    handleCustomMenus(systemMenus).then((resultMenus) => {
        menuObject.topMenus = resultMenus.filter((item) => {
            return item.leafNode === true && item.contextPath && item.name !== currentSystem;
        });

        menuObject.sideMenus = resultMenus.filter((item) => {
            return item.leafNode !== true && !item.contextPath;
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
            <Menu collapsible topMenus={menuObject.topMenus}
                sideMenus={menuObject.sideMenus}
                sideMenusIcon={icons}
                logoElement={logoElement}
                user={user}>
                {pageContent}
            </Menu>, root)
    });
}

// export function PageRender(content, domId) {
//     pageContent = (content);
//     getPageFrame(systemMenus, thirdMenus, 'finance', domId);
// }

export function RootPageRender(content, domId, handlerResize) {
    const queryStrings = QueryString.parse(window.location.search);
    console.log("object");
    if (queryStrings.nomenu == 'true') {
        ReactDOM.render(content, document.getElementById("root"));
    } else {
        pageContent = (content);
        getPageFrame(systemMenus, thirdMenus, 'finance', domId, handlerResize);
    }
}


export function PageRender(content, domId, handlerResize) {
    const queryStrings = QueryString.parse(window.location.search);
    if (queryStrings.nomenu == 'true') {
        ReactDOM.render(content, document.getElementById("root"));
    } else {
        ReactDOM.render(content, document.getElementsByClassName('dj-menu-content')[0] || document.getElementById('root'))
    }
}
