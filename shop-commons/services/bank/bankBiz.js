import { createWebService } from '../base';

//account/bank
const baseService = createWebService('bank/bankBiz');

/**
 * 获取商户银行卡列表
 * brandId:
 * accountNo
 */
export const getBankList = baseService.get_bank_list('post');

///rs/account/bank/set_default_bank
// 1.1.1	设置默认银行卡（新增接口）
export const setDefault = baseService.set_default_bank('post');

// 1.1.1	删除银行卡(新增接口)
// /rs/account/bank/POST /delete_bank
export const deleteBankCard = baseService.delete_bank('post');
// POST / get_bank_account_by_id 根据银行账户信息id获取银行账户信息
export const getBankAccountById = baseService.get_bank_account_by_id('post');
export default {
    getBankList,
    setDefault,
    deleteBankCard,
    getBankAccountById
}