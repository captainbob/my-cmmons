import { observable, action, toJS, runInAction } from 'mobx';

export default class Load {
    @observable loading = false;
    constructor() {
    }
    static instance = null;
    static getInstance() {
        if (Load.instance == null) {
            Load.instance = new Load()
        }
        return Load.instance
    }

    setLoading = (status) => {
        this.loading = status;
    }
}
// load的实例
const myLoad = Load.getInstance();

export {
    myLoad
}