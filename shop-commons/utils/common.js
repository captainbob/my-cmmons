import moment from 'moment';

export function getTimeId() {
  return +(new Date())
}

export function getUuid() {
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
export function getRouteUrlParam(name, search, type) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象  
  var r = search.substr(1).match(reg);  //匹配目标参数  
  if (r != null) {
    if (type === 'decode') {
      return decodeURI(r[2]);
    }
    return unescape(r[2]);  //返回参数值 
  } else {
    return null;
  }
}
export const formatPagination = (pagination = {}, onChange, onShowSizeChange) => {
  return {
    total: pagination.totalResult || 0,
    current: pagination.currentPage,
    pageSize: pagination.showCount,
    onChange,
    size: 'middle',
    onShowSizeChange,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total, range) => { return `共${total}条` },
    showSizeChanger: true
  }
}

export const thousands = (num) => {
  const sign = Math.sign(num) >= 0 ? '' : '-';
  num = Math.abs(num);
  const decimal = Number.isInteger(num) ? '.00' : `.${num.toFixed(2).split('.')[1]}`;
  const integer = Number.isInteger(num) ? num.toString() : num.toFixed(2).split('.')[0];
  const reg = /\d{1,3}(?=(\d{3})+$)/g;
  let n1 = integer.replace(/^(\d+)((\.\d+)?)$/, (s, s1, s2) => (`${s1.replace(reg, "$&,")}${s2}`));
  return `${sign}${n1}${decimal}`;
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