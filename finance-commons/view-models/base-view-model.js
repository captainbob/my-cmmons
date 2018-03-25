
import { observable, computed } from 'mobx'
import { message } from 'antd'

class BaseViewModel {
    @observable isLoading = false
    @observable datas = []
    @observable total = 0
    @observable pageSize = 10

    @observable _pageSelectStatus = observable.map({})
    @observable _currentPage = 0
    _cache = {}
    _selectItems = new Set()

    constructor(contentProvider) {
        this.provider = contentProvider
    }

    getPage(page, filter) {
        if (this._cache[page]) {
            this._setDatas(page, this._cache[page])
        } else {
            if (this.provider) {
                this.isLoading = true
                this.provider.getPage(page, filter, (response) => {
                    this.total = response.pagination.totalResult
                    this._setDatas(page, response.results)
                    this.isLoading = false
                }, (message) => {
                    message.error(message, 3)
                    this.isLoading = false
                })
            }
        }
        this._currentPage = page
    }

    toggleAll() {
        const pageSelectStatus = this._pageSelectStatus.get(this._currentPage)
        this.datas = this.datas.map(data => {
            data.$select = !pageSelectStatus
            return data
        })
        this._pageSelectStatus.set(this._currentPage, !pageSelectStatus)

        if (!pageSelectStatus) {
            this.datas.forEach(data => {
                this._selectItems.add(data[this.primaryKey])
            })
        }
    }

    toggle(primaryKey) {
        this.datas = this.datas.map(data => {
            if (data[this.primaryKey] == primaryKey) {
                const select = !!data.$select
                data.$select = !select
                if (select) {
                    this._selectItems.delete(data[this.primaryKey])
                } else {
                    this._selectItems.add(data[this.primaryKey])
                }
            }
            return data
        })
    }

    clear() {
        this._cache = {}
        this.datas = []
        this.total = 0
    }

    _setDatas(page, datas) {
        datas = datas.map(data => {
            data.$select = this._selectItems.has(data[this.primaryKey])
            return data
        })
        this.datas = datas
        this._cache[page] = datas
    }

    get selectPrimaryKeys() {
        const keys = []
        for (let value of this._selectItems.values()) {
            keys.push(value)
        }
        return keys
    }

    get primaryKey() {
        return this._primaryKey || 'id'
    }

    set primaryKey(key) {
        this._primaryKey = key
    }

    @computed get currentPageSelectStatus() {
        return this._pageSelectStatus.get(this._currentPage)
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
        }
    }
}

module.exports = { BaseViewModel, ContentProvider }