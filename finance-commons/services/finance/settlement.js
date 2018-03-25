import { createWebService } from '../base';

// /rs/finance/agreement
const baseService = createWebService('finance/settlement');

// POST / get_query_list 查询联营商结算信息
export const fetchGetQueryList = baseService.get_query_list('post');

// GET / do_timer_report 月底出联营商结算报表
export const fetchDoTimerReport = baseService.do_timer_report('get');

// POST / report_export 联营商结算导出excel导出, 任务编码：16002
export const fetchReportExport = baseService.report_export('post');