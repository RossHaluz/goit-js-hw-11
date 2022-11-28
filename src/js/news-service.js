import axios from 'axios';
import Notiflix from 'notiflix';

export default class FetchApiService {
    constructor() {
        this.pageNumber = 1;
        this.searchValue = '';
    }
    
    async fetchImages() {
        const BASE_URL = "https://pixabay.com/api/?key=";
        const KEY = "31525049-8cf7ae88f273a5df998b4a2e3";
        const PARE_PAGE = 40;

        const params = new URLSearchParams({
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
        })

        try {
            const response = await axios.get(`${BASE_URL}${KEY}&${params}&q=${this.searchValue}&page=${this.pageNumber}&per_page=${PARE_PAGE}`)
            this.incrementPage()
            return response;
        } catch (error) {
            Notiflix.Notify.failure('Qui timide rogat docet negare');
        }
    }

    incrementPage() {
        this.pageNumber += 1;
    }

    resetPage() {
        this.pageNumber = 1;
    }

    get query() {
        return this.searchValue;
    }

    set query(newQuery) {
        this.searchValue = newQuery;
    }

    get number() {
        return this.pageNumber;
    }
    
    set number(newNubmer) {
        this.pageNumber = newNubmer;
    }

}