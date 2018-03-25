import { createWebService } from '../base';

// /rs/data/finance
const baseService = createWebService('data/finance');
// GET / finance_pool_aggreement_settle_list
// brandId (required) 公司ID	query	number
// startDay (required) 开始时间 格式 yyyy- MM	query	string
// storageId 门店ID	query	number
// storageName 门店名称	query	string
// storagePoolId 联营商ID	query	number
// storagePoolName 联营商名称	query	string
// pageNum 页码数	query	string
// pageSize 每页显示数	query	string
// startRow 起始行，填写该字段会使pageNum字段失效	query	string
export const fetchList = baseService.finance_pool_aggreement_settle_list('get');
// GET /finance_pool_aggreement_settle_total
// brandId (required) 公司ID	query	number
// startDay (required) 开始时间 格式 yyyy- MM	query	string
// storageId 门店ID	query	number
// storageName 门店名称	query	string
// storagePoolId 联营商ID	query	number
// storagePoolName 联营商名称	query	string
export const fetchTotal = baseService.finance_pool_aggreement_settle_total('get');