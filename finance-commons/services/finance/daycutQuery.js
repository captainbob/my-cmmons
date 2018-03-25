import { createWebService } from '../base';

// /rs/finance / daycutQuery
const baseService = createWebService('finance/daycutQuery');
// POST / getDaycutCollectWithStorage
export const fetchGetDaycutCollectWithStorage = baseService.getDaycutCollectWithStorage('post');
// POST / getDaycutRecords
export const fetchGetDaycutRecords = baseService.getDaycutRecords('post');

// POST / getDaycutDetails
export const fetchGetDaycutDetails = baseService.getDaycutDetails('post');

// POST / hasDaycut
export const fetchHasDaycut = baseService.hasDaycut('post');
// POST / getCashierInfo
export const fetchGetCashierInfo = baseService.getCashierInfo('post');
export const fetchExportCashierInfo = baseService.exportCashierInfo('post');


// POST / getExceptions
export const fetchGetExceptions = baseService.getExceptions('post');