export class BaseDataProvider {
    constructor() {
        this.resultObject = {};
        this.results = [];
        this.pagination = {};
    }

    getPage(page, filter, success, error) {

    }

    setPageData(resultObject, convertData) {
        if (resultObject) {
            this.resultObject = resultObject;
            this.pagination = resultObject.pagination
            let datas = []
            if (resultObject.results) {
                datas = resultObject.results.map(result => {
                    return convertData(result)
                })
            }
            this.results = datas
        } else {
            this.resultObject = {};
            this.results = [];
            this.pagination = {};
        }
    }

    clear() {
        this.resultObject = {};
        this.results = [];
        this.pagination = {};
    }
}