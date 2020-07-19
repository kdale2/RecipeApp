//Search model

import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    //async functions return a promise
    // getting the recipe info from the API call
    async getResults() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch(error) {
            alert(error);
        }
    }
}