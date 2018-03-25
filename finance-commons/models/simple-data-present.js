// 如果一个页面的主要结构是
// 搜索框 ， 表格展示 ， 分页，
//  那么可以继承这个类， 简化查询数据和分页等代码
import { observable, action, computed } from 'mobx';
import { message } from 'antd';
// import BaseDataProvider from './data-provider';
class MainViewModal {

    @observable filters = {};

    @observable datas = [];

    @observable pagination = {};

    @computed get currentPage() {
        return this.pagination.currentPage
    }

    constructor(dataProvider) {
        super();
        this.dataProvider = dataProvider;
    }

    @action
    search = (page, filters) => {
        this.filters = filters;
        let _filters = Object.assign({}, filters, {
            currentPage: page
        });
        this.dataProvider.getPage(page, _filters, (res) => {
            let { resultObjec } = res;
            this.datas = resultObject.results;
            this.pagination = resultObjec.pagination;
        }, (err) => {
            message.error(err)
        })
    }
    // 获取数据
    @action
    getPage = () => {

    }

}