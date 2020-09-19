//This is the controller for the entire project

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import { elements, renderLoader, clearLoader } from './views/base';


/*** global state of the app which contains:
 * - search object
 * - current recipe object
 * - shopping list object
 * - liked recipes
 ***/
const state = {};


/**  
 * 
 * SEARCH CONTROLLER
 * 
***/

const controlSearch = async () => {

    // Get the search query from UI - read input from user
    const query = searchView.getInput();

    //if there has been a query entered, handle 
    if (query) {

        // create new search object and add it to state
        //we are getting this 'new Search' from Search model
        state.search = new Search(query);


        // prepare UI for results - first clearing old results + resetting input
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);


        // search for recipes - get recipes from API call
        // returns a promise so we use await
        try {

            // get recipe data and parse ingredients
            await state.search.getResults();

            // render results on UI 
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (err) {
            alert('Error! Something went wrong with the search...');
            clearLoader();
        }
    }
}

// when query is submitted, prevent default refresh and call search function
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});



// event delegation - handling pagination
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});






/**  
 * 
 * RECIPE CONTROLLER
 * 
 * 
***/

const controlRecipe = async () => {

    // Get ID of the recipe from URL
    const id = window.location.hash.replace('#', '');

    if (id) {

        // prepare the UI for changes - 
        // clear previous results
        // render loader, pass in the parent
        recipeView.clearRecipe();
        renderLoader(elements.recipe);


        // highlight the selected search item - 
        // (have to make sure there was actually a search made)
        if (state.search) searchView.highLightSelected(id);

        // create new recipe object
        state.recipe = new Recipe(id);


        // get recipe data - retrns a promise - gtting data from API
        // need a try catch in case api call fails
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render the recipe in the UI!!
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );


        } catch (err) {
            console.log(err);
            // to implement - better error handling. add message to UI, not an alert
            alert('ERROR processing recipe---');
        }
    }
};


// adding event listeners to global window - for hashchange (clicking on a diff recipe) and load
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

// instead of the above - add same event listener for multiple events
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));






/***** 
 * 
 * LIST CONTROLLER 
 * 
 * *****/

const controlList = () => {

    // create new list if there is none yet
    if (!state.list) state.list = new List();

    // add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};


// handle delete and update list item events
// these html elements are not there when the page loads
elements.shopping.addEventListener('click', e => {

    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state 
        state.list.deleteItem(id);
        // delete from UI
        listView.deleteItem(id);

        // handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
})


// method to delete entire shopping list when button is clicked
elements.deleteListButton.addEventListener('click', () => {
    state.list.deleteList();
    listView.deleteList();
})
 
// adding new items manually - it works
//clean this up
elements.addItemToList.addEventListener("click", e => {

    e.preventDefault();
    if (state.list) {
        console.log("Trying to add an item");
        var count = document.getElementById("count").value;
        var unit = document.getElementById("unit").value;
        var ingred = document.getElementById("ingred").value;

        console.log(state.list);
        //this is not working - cannot read property "addItem" of undefined
        const newItem = state.list.addItem(count, unit, ingred);
        listView.renderItem(newItem);
    } else {
        state.list = new List();
        var count = document.getElementById("count").value;
        var unit = document.getElementById("unit").value;
        var ingred = document.getElementById("ingred").value;
        const newItem = state.list.addItem(count, unit, ingred);
        listView.renderItem(newItem);
    }
}); 

// restore shopping list on page load
window.addEventListener('load', () => {
    
    state.list = new List();

    // restore likes
    state.list.readStorage();

    // render all liked recipes
    state.list.items.forEach(item => listView.renderItem(item));

});  








/***** 
 * 
 * LIKE CONTROLLER 
 * 
 * *****/


const controlLike = () => {

    if (!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;

    // user has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {

        // add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // toggle the like button
        likesView.toggleLikeBtn(true);

        // add like to UI list
        likesView.renderLike(newLike);


        // user HAS liked the current recipe    
    } else {

        // remove like from the state
        state.likes.deleteLike(currentID);

        // toggle the like button
        likesView.toggleLikeBtn(false);


        // remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// restore liked recipes on page load
window.addEventListener('load', () => {

    state.likes = new Likes();

    // restore likes
    state.likes.readStorage();

    // toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // render all liked recipes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});







// handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {

    // if decrease button, or any child element of it (*), is clicked
    if (e.target.matches(".btn-decrease, .btn-decrease *")) {

        if (state.recipe.servings > 1) {
            state.recipe.updateServings("dec");
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches(".btn-increase, .btn-increase *")) {

        // increase button is clicked
        state.recipe.updateServings("inc");
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {

        // add ingredients to shopping list
        controlList();

    } else if (e.target.matches('.recipe__love, .recipe__love *')) {

        // like controller
        controlLike();
    }
});

