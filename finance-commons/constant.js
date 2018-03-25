// 供应商
export const SupplierBizType = {
    STORAGE: "1",            // 采购入库结算
    OUTGOING: "2",           // 采购退货结算
    KEEP_ACCOUNTS: "3",      // 付款记账
    OTHER: "4",              // 其他费用
    STORAGE_REVERSE: "6",    // 采购入库冲销
    OUTGOING_REVERSE: "7",   // 采购退货冲销
}
// 供应商描述
export const SupplierBizTypeDesc = {
    "1": "采购入库结算",
    "2": "采购退货结算",
    "3": "付款记账",
    "4": "其他费用",
    "6": "采购入库冲销",
    "7": "采购退货冲销",
}

// 核销状态
export const VERIFICATION_STATUS = {
    "unVerificate": "0",        // 未核销
    "partVerificate": "1",      // 部分核销
    "verificated": "2",         // 已核销
}

// 账户类型
export const ACCOUNT_TYPE = {
    "SETTLEMENT": "SETTLEMENT",     // 结算账户
    "BOND": "BOND",                 // 保证金账户
    "DEPOSIT": "DEPOSIT",           // 定金账户
}

// 收款类型
export const COLLECTION_ACCOUNT_TYPE = {
    "SETTLEMENT": "1",              // 结算账户收款
    "DEPOSIT_TO_SETTLEMENT": "2",   // 定金账户转结算账户
    "BOND_TO_SETTLEMENT": "3",      // 保证金账户转结算账户
    "DEPOSIT": "4",                 // 定金账户收款
    "BOND": "5",                    // 保证金账户收款
    "SETTLEMENT_TO_DEPOSIT": "6",   // 结算账户转定金账户
    "SETTLEMENT_TO_BOND": "7",      // 结算账户转保证金账户
    "DISTRIBUTION": "8",            // 配货出库
    "REFUNDS": "9",                 // 退货入库
    "OTHER": "10",                  // 其他
    "ALLOCATE_REVERSE": "11",       // 配货出库冲销
    "REFUNDS_REVERSE": "12",        // 退货入库冲销
}
// 收款类型描述
export const COLLECTION_ACCOUNT_TYPE_DESC = {
    [COLLECTION_ACCOUNT_TYPE["SETTLEMENT"]]: "结算账户收款",                  // 结算账户收款
    [COLLECTION_ACCOUNT_TYPE["DEPOSIT_TO_SETTLEMENT"]]: "定金账户转结算账户",  // 定金账户转结算账户
    [COLLECTION_ACCOUNT_TYPE["BOND_TO_SETTLEMENT"]]: "保证金账户转结算账户",   // 保证金账户转结算账户
    [COLLECTION_ACCOUNT_TYPE["DEPOSIT"]]: "定金账户收款",                     // 定金账户收款
    [COLLECTION_ACCOUNT_TYPE["BOND"]]: "保证金账户收款",                      // 保证金账户收款
    [COLLECTION_ACCOUNT_TYPE["SETTLEMENT_TO_DEPOSIT"]]: "结算账户转定金账户",  // 结算账户转定金账户
    [COLLECTION_ACCOUNT_TYPE["SETTLEMENT_TO_BOND"]]: "结算账户转保证金账户",   // 结算账户转保证金账户
    [COLLECTION_ACCOUNT_TYPE["DISTRIBUTION"]]: "配货出库",                   // 配货出库
    [COLLECTION_ACCOUNT_TYPE["REFUNDS"]]: "退货入库",                        // 退货入库
    [COLLECTION_ACCOUNT_TYPE["OTHER"]]: "其他费用",                          // 其他
    [COLLECTION_ACCOUNT_TYPE["ALLOCATE_REVERSE"]]: "配货出库冲销",
    [COLLECTION_ACCOUNT_TYPE["REFUNDS_REVERSE"]]: "退货入库冲销",

}
// 收款类型是 结算账户收款、定金账户收款、保证金账户收款
export function isCollectionDirect(key) {
    key = String(key);
    switch (key) {
        case COLLECTION_ACCOUNT_TYPE['SETTLEMENT']:
            return true;
        case COLLECTION_ACCOUNT_TYPE['DEPOSIT']:
            return true;
        case COLLECTION_ACCOUNT_TYPE['BOND']:
            return true;
        default:
            return false;
    }
}
// 收款类型其他情况时
export function isCollectionTransfer(key) {
    switch (key) {
        case COLLECTION_ACCOUNT_TYPE['DEPOSIT_TO_SETTLEMENT']:
            return true;
        case COLLECTION_ACCOUNT_TYPE['BOND_TO_SETTLEMENT']:
            return true;
        case COLLECTION_ACCOUNT_TYPE['SETTLEMENT_TO_DEPOSIT']:
            return true;
        case COLLECTION_ACCOUNT_TYPE['SETTLEMENT_TO_BOND']:
            return true;
        default:
            return false;
    }
}



// 核销记录-收款类型
export const VERIFICATION_RECORDS = {
    "SETTLEMENT": "1",                // 结算账户收款
    "BOND_TO_SETTLEMENT": "2",        // 保证金账户转结算账户
    "DEPOSIT_TO_SETTLEMENT": "3",     // 定金账户转结算账户
}
// 核销记录-收款类型-描述
export const VERIFICATION_RECORDS_DESC = {
    [VERIFICATION_RECORDS["SETTLEMENT"]]: '结算账户收款',
    [VERIFICATION_RECORDS["BOND_TO_SETTLEMENT"]]: '保证金账户转结算账户',
    [VERIFICATION_RECORDS["DEPOSIT_TO_SETTLEMENT"]]: '定金账户转结算账户',
}
// 收支明细-收支
export const EXPENSES = {
    "INCOME": "0",      // 收入
    "EXPEND": "1",      // 支出
}
// 结算账期
export const SETTLEMENT_PERIOD_TYPE = {
    "warehouse": "1",  // 出库日期
    "month": "2",      // 当月月末
}
// 结算账期描述
export const SETTLEMENT_PERIOD_TYPE_DESC = {
    [SETTLEMENT_PERIOD_TYPE["warehouse"]]: "出库日期",
    [SETTLEMENT_PERIOD_TYPE["month"]]: "当月月末"
}