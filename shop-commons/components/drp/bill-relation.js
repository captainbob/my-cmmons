import { Component } from 'react';
import { Modal, message } from 'antd';
import { fjs } from 'djmodules-utils';

import { BillTypeKey } from './bill-relation-config';
let billTypeKey = new BillTypeKey();

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <a href="javascript:;" style={Object.assign({}, this.props.style || {})}
                onClick={() => {
                    this.ajaxBillRelation({
                        brandId: currentBrandId,
                        billId: this.props.billId,
                    }).then(result => {
                        let itemNum = 0;
                        const _modal = Modal.info({
                            title: this.props.title || '查看关联单据',
                            okText: '关闭',
                            content: (
                                <div>
                                    {Object.values(result || []).filter(item => item && item.length).length ? '' :
                                        <div style={{ color: '#666666' }}>未找到关联单据...</div>
                                    }
                                    {Object.keys(result || []).map((itemKey, i) => {      // 先拿到上下游属性键值
                                        return (
                                            <div>
                                                {!result[itemKey] || !result[itemKey].length ? '' :
                                                    <div style={Object.assign({}, { borderTop: '1px solid #EEEEEE', padding: '8px 0' }, !i ? { borderTop: 'none' } : {})}>
                                                        <h4>{itemKey}</h4>
                                                        <div style={{ padding: '5px 0', lineHeight: '1.8em' }}>
                                                            {result[itemKey].map(item => {
                                                                let billTypeId = itemKey == '下游单据' ? String(item.billTypeId) : String(item.parentBillTypeId);
                                                                let url = billTypeKey[billTypeId] && billTypeKey[billTypeId].url;
                                                                return (
                                                                    <p>
                                                                        {item.billTypeName || (billTypeKey[billTypeId] && billTypeKey[billTypeId].label)}：
                                                                        <a
                                                                            style={!url ? { color: '#999999', cursor: 'default', textDecoration: 'none' } : {}}
                                                                            href={!url ? 'javascript:;' : billTypeKey[billTypeId].url + item.billId}
                                                                            target={!url ? '_self' : "_blank"}
                                                                        >
                                                                            {item.billCode}
                                                                        </a>
                                                                    </p>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            ),
                            onOk() { },
                        });
                    });
                }}
            >
                {this.props.children || '查看关联单据'}
            </a>
        );
    }
    ajaxBillRelation = (data, callback) => {
        return fjs.http.post('/rs/workflow/bill_relation/get_bill_relation_stream', data).then(result => {
            let res = {};
            if (result.status === 'success' || result.resultCode === 'success') {
                result = result && result.resultObject;
                if (result) {
                    res = {
                        // 上游
                        '上游单据': result.upstreams.map(item => {
                            return {
                                billId: item.atom.parentBillId,
                                billTypeName: item.billTypeName,
                                billCode: item.atom.parentBillCode,
                                billTypeId: item.atom.parentBillTypeId,
                                parentBillTypeId: item.atom.parentBillTypeId
                            };
                        }),
                        // 下游
                        '下游单据': result.downstreams.map(item => {
                            return {
                                billId: item.atom.billId,
                                billTypeName: item.billTypeName,
                                billCode: item.atom.billCode,
                                billTypeId: item.atom.billTypeId,
                                parentBillTypeId: item.atom.parentBillTypeId
                            };
                        }),
                    }
                }
            } else {
                message.error(result.exceptionMessage || result.message || '请求异常');
            }
            return res;
        })
    }
}