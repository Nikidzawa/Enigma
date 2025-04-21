import {makeAutoObservable} from "mobx";

class SearchController {
    isSearch = false;
    value = '';

    constructor() {
        makeAutoObservable(this);
    }

    setIsSearching(value) {
        this.isSearch = value;
    }

    isSearching() {
        return this.isSearch;
    }

    setSearchValue(value) {
        this.value = value;
    }

    getSearchValue() {
        return this.value;
    }

    stopSearch() {
        this.isSearch = false;
        this.value = ''
    }
}

export default new SearchController();