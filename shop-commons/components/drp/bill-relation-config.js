// 单据类型配制 统一可共享
export class BillTypeKey {
    '9' = {
        type: '订货申请', label: '订货申请单',
        url: '/views/modules/4.0/flow/order-application.html?closeStatus=1&wapper=menu#/detail/'
    }
    '10' = {
        type: '订货', label: '订货单',
        url: '/views/modules/4.0/flow/order.html?closeStatus=1&#/detail/'
    }
    '11' = {
        type: '采购计划', label: '采购计划单',
        url: '/views/modules/4.0/procured/procured-plan.html?closeStatus=1&#/detail/'
    }
    '12' = {
        type: '采购', label: '采购订单',
        url: '/views/modules/4.0/procured/procured-order.html?closeStatus=1&#/orderDetail/'
    }
    '13' = {
        type: '入库通知', label: '入库通知单',
        url: '/views/modules/4.0/procured/procured-order.html?closeStatus=1&#/notification/'
    }
    '14' = {
        type: '采购退货', label: '采购退货单',
        url: '/views/modules/4.0/procured/procured-return.html?closeStatus=1&#/detail/'
    }
    '15' = {
        type: '出库通知', label: '出库通知单',
        url: ''
    }
    '20' = {
        type: '出库', label: '出库单',
        url: '/views/modules/4.0/stock/out-warehouse.html?closeStatus=1&#/detail/'
    }
    '30' = {
        type: '入库', label: '入库单',
        url: '/views/modules/4.0/stock/warehousing.html?closeStatus=1&#/detail/'
    }
    '31' = {
        type: '差异', label: '差异单',
        url: '/views/modules/4.0/stock/differences-list.html?closeStatus=1&#/detail/'
    }
    '40' = {
        type: '库存调整', label: '库存调整单',
        url: '/views/modules/4.0/stock/adjustment.html?closeStatus=1&#/detail/'
    }
    '50' = {
        type: '盘点', label: '盘点单',
        url: '/views/modules/4.0/stock/inventory.html?closeStatus=1&#/edit/other/'
    }
    '60' = {
        type: '配货', label: '配货单',
        url: '/views/modules/4.0/flow/allocation.html?closeStatus=1&#/edit/main_billId/'
    }
    '70' = {
        type: '调拨', label: '调拨单',
        url: '/views/modules/4.0/flow/transfer.html?closeStatus=1&#/edit/main_billId/'
    }
    '80' = {
        type: '退货', label: '退货单',
        url: '/views/modules/4.0/flow/return.html?closeStatus=1&#/edit/main_billId/'
    }
    '81' = {
        type: '退货申请', label: '退货申请单',
        url: '/views/modules/4.0/flow/return.html?closeStatus=1&nomenu=true#/edit/main_edit/'
    }
    '85' = {
        type: '积分', label: '积分订单',
        url: ''
    }
    '90' = {
        type: '订单', label: '订单',
        url: ''
    }
    '91' = {
        type: '退款', label: '退款单',
        url: ''
    }
}