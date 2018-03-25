import { createWebService } from './base';

// /rs/brand/shop
const baseService = createWebService('brand/shop');
// GET / get_list_by_query
//queryContent:{"provinceCode":"","cityCode":"","channelType":"","storageGroup":"","keyWord":"","status":"1","currentPage":1,"showCount":10}
// wareHouse 是否包含仓库 2包含
export const fetchGetListByQuery = baseService.get_list_by_query('get');
