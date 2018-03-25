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
    @action
    setLoading = (status) => {
        this.loading = status;
    }
}