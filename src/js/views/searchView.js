import { elements } from './base';

// just grabbing the input from the UI input form
export const getInput = () => elements.searchInput.value;

// clear input form after submitting query
export const clearInput = () => {
    elements.searchInput.value = '';
};

// clear previous results before displaying new results
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};


// when a recipe is selected this will make it stay highlighted
export const highLightSelected = id => {

    const resultsArr = Array.from(document.querySelectorAll('.results__link'));

    // remove the class from all recipes first so they dont all stay highlighted
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    // only add the highlight to the currently selected recipe
    document.querySelector(`.results__link[href*="${id}"`).classList.add('results__link--active');
}


//if title is too long were going to shorten it appropriately
export const limitRecipeTitle = (title, limit = 17) => {

    const newTitle = [];

    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        //return the result - adding spaces and '...'
        return `${newTitle.join(' ')} ...`;
    } 
    return title;
};


// dont need to export this function - only need it in this module
// formatting each recipe on our recipe list + rendering to the DOM
const renderRecipe = (recipe) => {
  const markup = `
    
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);

};

// function to render our buttons
// type is going to be 'prev' or 'next'
const createButton = (page, type) => `

    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;


// rendering previous and next page buttons on proper pages
const renderButtons = (page, numResults, resPerPage) => {

    const pages = Math.ceil(numResults / resPerPage);

    let button;

    if (page === 1 && pages > 1) {

        // On first page only need one button - to go to next page
        button = createButton(page, 'next');

    } else if (page < pages) {

        // we want both a previous and a next button
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;

    } else if (page === pages && pages > 1) {

        // on the last page - only want a button to go to previous page
        button = createButton(page, 'prev');

    }

    //insert the buttons into the DOM
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};





// loop thru the recipe results and render recipe for each
// handling pagination here too
export const renderResults = (recipes, page = 1, resPerPage = 10) => {

    // render results of current page
    // only display a certain number of recipes per page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // render the pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};