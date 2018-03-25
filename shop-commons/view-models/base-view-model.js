
import { observable, computed } from 'mobx'
import { message } from 'antd'

function getDefaultPageSize() {
    const pageSize = window.localStorage.getItem('base-view-model-page-size') || 10;
    return parseInt(pageSize);
}

function setDefaultPageSize(pageSize) {
    window.localStorage.setItem('base-view-model-page-size', pageSize);
}

class BaseViewModel {
    @observable isLoading = false;
    @observable datas = [];
    @observable total = 0;
    @observable pageSize = getDefaultPageSize();

    @observable _pageSelectStatus = observable.map({});
    @observable currentPage = 1;
    _cache = {};
    _selectItems = new Set();
    _currentFilter = {}

    constructor(contentProvider) {
        if (contentProvider instanceof ContentProvider) {
            this.provider = contentProvider;
        } else {
            throw new Error(`${contentProvider} should be an instance of ContentProvider`);
        }
    }

    getPage(page, filter) {
        if (!filter) {
            filter = this._currentFilter;
        }
        filter = Object.assign({}, filter || {}, { pageSize: this.pageSize, showCount: this.pageSize });
        this._currentFilter = filter;
        if (this._cache[page]) {
            this._setDatas(page, this._cache[page]);
        } else {
            if (this.provider) {
                this.isLoading = true;
                this.provider.getPage(page, filter, (response) => {
                    this.isLoading = false;
                    if (response && response.pagination && (typeof response.pagination.totalResult == 'number') && response.results) {
                        this.total = response.pagination.totalResult;
                        this._setDatas(page, response.results);
                    } else {
                        const dataStructure = {
                            pagination: {
                                totalResult: 'number'
                            },
                            results: 'array'
                        };
                        throw new Error(`the response should be someting like ${JSON.stringify(dataStructure)}`);
                    }
                }, (message) => {
                    this.isLoading = false;
                    message.error(message, 3);
                })
            }
        }
        this.currentPage = page;
    }

    toggleAll() {
        const pageSelectStatus = this._pageSelectStatus.get(this.currentPage)
        this.datas = this.datas.map(data => {
            data.$select = !pageSelectStatus;
            return data;
        })
        this._pageSelectStatus.set(this.currentPage, !pageSelectStatus);

        if (!pageSelectStatus) {
            this.datas.forEach(data => {
                this._selectItems.add(data[this.primaryKey]);
            });
        } else {
            this.datas.forEach(data => {
                this._selectItems.delete(data[this.primaryKey]);
            });
        }
    }

    toggle(primaryKey) {
        this.datas = this.datas.map(data => {
            if (data[this.primaryKey] == primaryKey) {
                const select = !!data.$select;
                data.$select = !select;
                if (select) {
                    this._selectItems.delete(data[this.primaryKey]);
                } else {
                    this._selectItems.add(data[this.primaryKey]);
                }
            }
            return data;
        });
        const currentPageSelectStatus = this.datas.reduce((pre, next) => {
            return pre && next.$select;
        }, true);
        this._pageSelectStatus.set(this.currentPage, currentPageSelectStatus);
    }

    clear() {
        this._pageSelectStatus = observable.map({});
        this._selectItems = new Set();
        this._cache = {};
        this.datas = [];
        this.total = 0;
    }

    onShowSizeChange = (current, pageSize) => {
        setDefaultPageSize(pageSize);
        this.pageSize = pageSize;
        this.reload();
    }

    reload = (filter) => {
        this.clear();
        this.currentPage = 1;
        if (filter) {
            filter = Object.assign({}, filter || {}, { pageSize: this.pageSize, showCount: this.pageSize });
        }
        this.getPage(this.currentPage, filter || this._currentFilter);
    }

    _setDatas(page, datas) {
        datas = datas.map(data => {
            data.$select = this._selectItems.has(data[this.primaryKey]);
            return data
        });
        this.datas = this.convertDatas(datas);
        this._cache[page] = datas;
    }

    convertDatas(datas) {
        return datas;
    }

    get selectPrimaryKeys() {
        const keys = [];
        for (let value of this._selectItems.values()) {
            keys.push(value);
        }
        return keys;
    }

    get selectItems() {
        const items = [];
        for (let value of this._selectItems.values()) {
            Object.keys(this._cache).forEach(key => {
                this._cache[key].forEach(item => {
                    if (item[this.primaryKey] == value) {
                        items.push(item);
                    }
                })
            })
        }
        return items;
    }

    get primaryKey() {
        return this._primaryKey || 'id';
    }

    set primaryKey(key) {
        this._primaryKey = key;
    }

    @computed get currentPageSelectStatus() {
        return this._pageSelectStatus.get(this.currentPage);
    }
}

class ContentProvider {
    getPage(page, filter, success, error) {
    }

    makePageFromArray(array) {
        return {
            results: array,
            pagination: {
                totalResult: array.length
            }
        };
    }
}

module.exports = { BaseViewModel, ContentProvider }