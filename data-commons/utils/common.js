
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import * as R from 'ramda';

export function getTimeId() {
  return (+(new Date())).toString(36);
}

export function getUuid() {
  let s = [];
  let userId = "";
  if (window.userInfo) {
    userId = userInfo.userId;
  }
  let hexDigits = "0123456789abcdef";

  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  let uuid = s.join("");

  return userId + "-" + uuid + "-" + new Date().getTime();
}

export function isEmptyObject(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}


export const formatPagination = (pagination = {}, onChange, onShowSizeChange) => {
  return {
    // simple: true,
    total: pagination.totalResult || 0,
    current: pagination.currentPage,
    pageSize: pagination.showCount,
    onChange: onChange,
    // onShowSizeChange,
    // pageSizeOptions: ['10', '20', '50'],
    showQuickJumper: false,
    showTotal: (total, range) => { return `共${total}条` },
    showSizeChanger: false
  }
}

/**************** antd 日期控件警用日期专用  start*****************************************/
// 日期选择器 禁用当前时间以后  current 是 Moment格式
export function disableAfterToday(current) {
  return current && current.valueOf() > Date.now();
}
// 日期选择器 禁用当前时间和以后  current 是 Moment格式
export function disableAfter(current) {
  return current && current.valueOf() > moment().subtract(1, 'd').valueOf();
}
// 日期选择器 禁用当前时间以前
export function disableBeforeToday(current) {
  return current && current.valueOf() < Date.now();
}
// 日期选择器 禁用之前时间（不含当天）
export function disableBefore(current) {
  return current && current.valueOf() < moment().subtract(1, 'd').valueOf();
}
// 日期选择器 禁用当月之后的日期（含当月）
export function disableAfterMonth(current) {
  return current && current.valueOf() > moment().startOf('month').subtract(1, 'd').valueOf();

}

/**************** antd 日期控件警用日期专用  end******************************************/

// 判断是不是 array
export function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

export function getRouteUrlParam(name, search) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象  
  let r = search.substr(1).match(reg);  //匹配目标参数  
  if (r != null) {
    return unescape(r[2]);  //返回参数值 
  } else {
    return null;
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
  if (curRoleIds >= 100000 && hasCustomRoleId) {
    return component
  }
  if (showRoleIds.includes(curRoleIds)) {
    return component
  } else {
    return undefined
  }
}
// 权限控制展示 roleId 请看 role-enum.md
export function isRoleControllDisabled(showRoleIds = [], hasCustomRoleId = false) {
  let curRoleIds = Number(window.userInfo.roleId)
  if (curRoleIds >= 100000 && hasCustomRoleId) {
    return false
  }
  if (showRoleIds.includes(curRoleIds)) {
    return false
  } else {
    return true
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
//将1234567.00转换为1,234,567.00  
export function jiaDouHao(s) {
  let sign_position = "";//正负符号位
  let n, l, t, r, i;
  if (parseFloat(s) < 0) {
    sign_position = "-";
    s = Math.abs(parseFloat(s));
  }
  n = 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  l = s.split(".")[0].split("").reverse(),
    r = s.split(".")[1];
  t = "";
  for (i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return sign_position + t.split("").reverse().join("") + "." + r;
}
export function jiaDouHaoNoZero(s) {
  let sign_position = "";//正负符号位
  let n, l, t, r, i;
  if (parseFloat(s) < 0) {
    sign_position = "-";
    s = Math.abs(parseFloat(s));
  }
  n = 0;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(0) + "";
  l = s.split(".")[0].split("").reverse(),
    r = s.split(".")[1];
  t = "";
  for (i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }

  t = t.split("").reverse().join("");
  // let x = t.indexOf(',');
  // if(x[0]==1&&t.indexOf('-')==0){
  //   t = '-'+t.slice(2);
  // }
  return sign_position + t;
}
//将1,234,567.00转换为1234567.00 
export function jianDouHao(s) {
  let sign_position = "";//正负符号位
  let n, l, t, r, i;
  if (parseFloat(s) < 0) {
    sign_position = "-";
    s = Math.abs(parseFloat(s));
  }
  n = 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  l = s.split(".")[0].split("").reverse(),
    r = s.split(".")[1];
  t = "";
  for (i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "" : "");
  }
  t = t.split("").reverse().join("") + "." + r;
  // let x = t.indexOf(',');
  // if(x[0]==1&&t.indexOf('-')==0){
  //   t = '-'+t.slice(2);
  // }
  return sign_position + t;
}
/*有加减的百分数*/
export function baiFenshu(s) {
  let x, n, l, t, r, i;

  x = s * 100;
  t = x.toFixed(2);
  if (t.indexOf('-') >= 0) {
    t = t;
    if (t.length > 10) {
      t = '->1000000.00%'
    } else {
      t = t + '%';
    }
  } else {
    t = '+' + t;
    if (t.length > 10) {
      t = '+>1000000.00%'
    } else {
      t = t + '%';
    }
  }
  return t;
}
/*没有加减的百分数*/
export function baiFenshuNum(s) {
  let x, n, l, t, r, i;
  x = s * 100;
  t = x.toFixed(2);
  if (t.indexOf('-') >= 0) {
    t = t;
    if (t.length > 10) {
      t = '<-1000000.00%'
    } else {
      t = t + '%';
    }
  } else {
    t = t;
    if (t.length > 10) {
      t = '>+1000000.00%'
    } else {
      if (_.isNaN(t)) {
        t = '0.00%';
      } else {
        t = t + '%';
      }
    }
  }
  return t;
}

export const COLORS = [
  "#2ecbc9",
  "#b6a1de",
  "#5ab1f0",
  "#ffba7f",
  "#d87a7f",
  "#8c97b3",
]

/**
 * 校验手机号码
 * @param phone 手机号码
 * @returns {boolean} 是否手机号码
 */
export function checkPhone(phone) {
  // if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
  if (!(/^1\d{10}$/.test(phone))) {
    return false;
  }
  return true;
}

/**
 * 保留小数点后几位小数
 * @param numStr 数字
 * @param decimalInt 小数点位数
 */
export function getDecimalNum(numStr, decimalInt) {
  numStr = parseFloat(numStr);
  return numStr.toFixed(decimalInt);
}
/**
 * 取整
 * @param numStr 数字
 */
export function getIntNum(numStr) {
  if (!numStr) {
    return 0;
  }
  return parseInt(numStr);
}
/**
 * 获取金额格式 不保留小数进行千分位分割
 * @param moneyStr
 * @param decimal 保留小数位数
 * @returns {Number|*}
 */
export function getMoneyFormat(moneyStr, decimal) {
  if (!isNumeric(moneyStr)) {
    return '--';
  }
  moneyStr = parseFloat(moneyStr);
  moneyStr = getDecimalNum(moneyStr, decimal ? decimal : 0);
  moneyStr = formatNumberRgx(moneyStr);
  return moneyStr;
}
/**
 * 使用千分号隔开
 * @param num
 * @returns {string}
 */
export function formatNumberRgx(num) {
  var parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};
/**
 * 获取比例格式 默认保留1位小数 超过十万显示万
 * @param moneyStr
 * @param decimal 保留小数位数
 * @returns {Number|*}
 */
export function getRateFormat(moneyStr, decimal) {
  if (!isNumeric(moneyStr)) {
    return '--';
  }
  if (moneyStr > 0 && moneyStr < 0.001) {
    return '<0.1%';
  }
  moneyStr = parseFloat(moneyStr * 100);
  // if (moneyStr > 99999999) {
  //   moneyStr = getDecimalNum(moneyStr / 100000000, decimal ? decimal : 2) + '亿';
  // } else if (moneyStr > 99999) {
  //   moneyStr = getDecimalNum(moneyStr / 10000, decimal ? decimal : 1) + '万';
  // } else {
  moneyStr = getDecimalNum(moneyStr, decimal ? decimal : 1);
  // }
  return moneyStr + '%';
}
/**
 * 获取大规模数据格式 超过十万显示万
 * @param moneyStr 数字
 * @returns {Number|*}
 */
export function getBigFormat(NumStr) {
  if (!isNumeric(NumStr)) {
    return '--';
  }
  NumStr = parseInt(NumStr);
  if (NumStr > 99999) {
    NumStr = parseInt(NumStr / 10000) + '万';
  }
  return NumStr;
}

/**
 * 将小数转化成保留numInt位小数的数据
 * @param  data 小数
 */
export function getBaiFenBiFormat(data, numInt) {
  return (data * 100).toFixed(numInt);
}


/**
 * 获取排名格式  小于0返回--
 * @param ranking
 * @returns
 */
export function getRankingFormat(ranking) {
  if (!isNumeric(ranking) || ranking < 0) {
    return '--';
  }
  return ranking;
}
/**
 * 验证数字
 * @param n 输入数字
 */
export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);

}
/**
 * 验证数字
 * @param index 时间控件选中项 0,天 1，周  2，月  3，年 4，自由筛选 5,昨天往前90天
 */
export function getTimeTypeByIndex(index) {
  let timeType = 6;//0:天 1:周 2:月 3:年度 4:90 6:所有    自由筛选为空
  switch (index) {
    case 0:
    case 1:
    case 2:
    case 3:
      timeType = index;
      break;
    case 4:
      timeType = '';
      break;
    case 5:
      timeType = 4;
      break;
  }
  return timeType + '';

}
/**
 * 数组比较对象内某个属性，并进行排序
 * @param {* 对象的属性} attr 
 * @param {* } rev 第二个参数没有传递 默认升序排列
 */
export function compare(attr, rev) {

  if (rev == undefined) {
    rev = 1;
  } else {
    rev = (rev) ? 1 : -1;
  }

  return function (a, b) {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 0;
  }
}

/**
 * 判断数组中是否包含某元素
 * @param arr 数组
 * @param obj 元素
 * @returns {boolean}
 */
export function arrayContains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}

/**
 * 删除数组中指定元素
 * @param arr 素组
 * @param val 元素
 */
export function removeByValue(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}


/**
 * 以最大值为1 的标准化
 * @param {arr} list 
 */
export const normalizeData = (list) => {
  let max = R.reduce(R.maxBy(value => parseFloat(value)), 0)(list);
  if (max == 0) {
    return R.map(() => 0)(list)
  }
  return R.map(R.divide(R.__, max))(list)
}
