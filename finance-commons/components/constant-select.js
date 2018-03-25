import { Select } from 'antd';
import * as Constant from '../constant';

const { SupplierBizTypeDesc, SupplierBizType } = Constant;

export function SupplierBizTypeView(props) {
    return (
        <Select
            defaultValue=""
            style={{ width: "150px" }}
            {...props}
        >
            <Select.Option value="">全部</Select.Option>
            <Select.Option value={SupplierBizType['STORAGE']}>{SupplierBizTypeDesc[SupplierBizType['STORAGE']]}</Select.Option>
            <Select.Option value={SupplierBizType['OUTGOING']}>{SupplierBizTypeDesc[SupplierBizType['OUTGOING']]}</Select.Option>
            <Select.Option value={SupplierBizType['STORAGE_REVERSE']}>{SupplierBizTypeDesc[SupplierBizType['STORAGE_REVERSE']]}</Select.Option>
            <Select.Option value={SupplierBizType['OUTGOING_REVERSE']}>{SupplierBizTypeDesc[SupplierBizType['OUTGOING_REVERSE']]}</Select.Option>
            <Select.Option value={SupplierBizType['OTHER']}>{SupplierBizTypeDesc[SupplierBizType['OTHER']]}</Select.Option>
        </Select>
    )
}
// 这个包含了付款记账
export function SupplierBizTypeViewWithKeepAccounts(props) {
    return (
        <Select
            defaultValue=""
            style={{ width: "150px" }}
            {...props}
        >
            <Select.Option value="">全部</Select.Option>
            <Select.Option value={SupplierBizType['STORAGE']}>{SupplierBizTypeDesc[SupplierBizType['STORAGE']]}</Select.Option>
            <Select.Option value={SupplierBizType['OUTGOING']}>{SupplierBizTypeDesc[SupplierBizType['OUTGOING']]}</Select.Option>
            <Select.Option value={SupplierBizType['KEEP_ACCOUNTS']}>{SupplierBizTypeDesc[SupplierBizType['KEEP_ACCOUNTS']]}</Select.Option>
            <Select.Option value={SupplierBizType['STORAGE_REVERSE']}>{SupplierBizTypeDesc[SupplierBizType['STORAGE_REVERSE']]}</Select.Option>
            <Select.Option value={SupplierBizType['OUTGOING_REVERSE']}>{SupplierBizTypeDesc[SupplierBizType['OUTGOING_REVERSE']]}</Select.Option>
            <Select.Option value={SupplierBizType['OTHER']}>{SupplierBizTypeDesc[SupplierBizType['OTHER']]}</Select.Option>
        </Select>
    )
}