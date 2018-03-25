import { createWebService } from '../base';

// /rs/finance/agreement
const baseService = createWebService('finance/agreement');
//agreementId	number
export const fetchGetAgreementById = baseService.get_by_id('get');
// agreementId 联营协议Id	form	integer
// brandId  品牌id	form	integer
// channelId 渠道id【联营商id】	form	integer
// channelName 渠道名称【联营商名称】	form	string
// storageId  店仓Id	form	integer
// storageName  店仓名称	form	string
// startAgreementEndDate 协议终止日期起	form	string
// endAgreementEndDate 协议终止日期止	form	string
export const fetchGetAgreementList = baseService.get_query_list('post');
// brandId (required) 品牌id	form	integer
// agreementStartDate (required) 协议起始日	form	string
// agreementEndDate (required)协议终止日	form	string
// storageAndChannel (required)联营商店铺，格式为[{ "channelId": "212342", "channelName": "XXX", "storageId": "212342", "storageName": "XXX" }]	form	string
// discountRateRange 折扣率区间，格式为[{ "startDiscountRate": "30.12", "endDiscountRate": "30.12", "dividedIntoRate": "30.12" }]	form	string
// operateId 操作人Id	form	integer
export const fetchAddAgreement = baseService.add('post');
// agreementId 联营协议Id	form	integer
// brandId 品牌id	form	integer
// channelId 渠道id【联营商id】	form	integer
// channelName 渠道名称【联营商名称】	form	string
// storageId 店仓Id	form	integer
// storageName 店仓名称	form	string
// discountRateRange 折扣率区间	form	string
// agreementStartDate 协议起始日期	form	string
// agreementEndDate 协议终止日期	form	string
// operateId 操作人Id	form	integer
// operateDate 操作时间	form	string
export const fetchModAgreement = baseService.mod('post');
//agreementId
export const fetchDelAgreement = baseService.del('post');
// POST / agreement_export
// pageNum 当前页	query	number
// pageSize 每页条数	query	number
// agreementId 联营协议Id	form	integer
// brandId  品牌id	form	integer
// channelId 渠道id【联营商id】	form	integer
// channelName 渠道名称【联营商名称】	form	string
// storageId  店仓Id	form	integer
// storageName  店仓名称	form	string
// startAgreementEndDate 协议终止日期起	form	string
// endAgreementEndDate 协议终止日期止	form	string
export const fetchExportAgreement = baseService.agreement_export('post');
// POST / get_query_shop_list/
export const fetchGetQueryShopList = baseService.get_query_shop_list('post');


