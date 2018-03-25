
import moment from 'moment';

export function getTimeId() {
  return (+(new Date())).toString(36);
}

export function getUuid(params) {
  var s = [];
  var userId = "";
  if (window.userInfo) {
    userId = userInfo.userId;
  }
  var hexDigits = "0123456789abcdef";

  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");

  return userId + "-" + uuid + "-" + new Date().getTime();
}

export function isEmptyObject(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

export const formatPagination = (pagination = {}, onChange, onShowSizeChange) => {
  return {
    total: pagination.totalResult || 0,
    current: pagination.currentPage,
    pageSize: pagination.showCount,
    onChange,
    onShowSizeChange,
    pageSizeOptions: ['10', '20', '50'],
    showQuickJumper: false,
    showTotal: (total, range) => { return `共${total}条` },
    showSizeChanger: true
  }
}

/**************** antd 日期控件警用日期专用  start*****************************************/
// 日期选择器 禁用当前时间以后  current 是 Moment格式
export function disableAfterToday(current) {
  return current && current.valueOf() > Date.now();
}
// 日期选择器 禁用当前时间以前
export function disableBeforeToday(current) {
  return current && current.valueOf() < Date.now();
}
// 日期选择器 禁用之前时间（不含当天）
export function disableBefore(current) {
  return current && current.valueOf() < moment().subtract(1, 'd').valueOf();
}

/**************** antd 日期控件警用日期专用  end******************************************/

// 判断是不是 array
export function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

export function getRouteUrlParam(name, search) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象  
  var r = search.substr(1).match(reg);  //匹配目标参数  
  if (r != null) {
    return unescape(r[2]);  //返回参数值 
  } else {
    return null;
  }
}
/******************* 获取动态滞销的描述  动态滞销	****************************************************/
// 0 爆款，1旺款，2平销款，3滞销款，4超滞销款,-1 其他
export function getSaleTypeDesc(type) {
  switch (Number(type)) {
    case 0:
      return '爆款';
    case 1:
      return '旺款';
    case 2:
      return '平销款';
    case 3:
      return '滞销款';
    case 4:
      return '超滞销款';
    case -1:
      return '其他'
    default:
      return ''
  }
}

// 获取滚动条的宽度
export function getScrollbarWidth() {
  let oP = document.createElement('p'),
    styles = {
      width: '100px',
      height: '100px',
      overflowY: 'scroll'
    }, i, scrollbarWidth;
  for (i in styles) oP.style[i] = styles[i];
  document.body.appendChild(oP);
  scrollbarWidth = oP.offsetWidth - oP.clientWidth;
  oP.remove();
  return scrollbarWidth;
}
// 权限控制展示 roleId 请看 role-enum.md
export function roleControllDisplay(component, showRoleIds = [], hasCustomRoleId = false) {
  let curRoleIds = Number(window.userInfo.roleId)
  if (hasCustomRoleId && curRoleIds >= 100000) {
    return component
  }
  if (showRoleIds.includes(curRoleIds)) {
    return component
  } else {
    return undefined
  }
}

// 如果小于0，展示红色
export function returnAmountStyle(text) {
  if (text < 0) {
    return <span style={{ color: '#F44F5A' }}>{text}</span>
  }
  return text
}
// 判断是不是店长或导购
// 店长6，导购7
export function isManagerOrGuide(params) {
  const userInfo = window.userInfo || {};
  if (userInfo.roleId == 6 || userInfo.roleId == 7) {
    return true;
  }
  return false;
}