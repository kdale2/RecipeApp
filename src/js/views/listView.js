// Shopping List View

import { elements } from './base';


// method to render each item/ingredient in the UI
export const renderItem = item => {

    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
        </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};



// method to delete the item from the UI
export const deleteItem = id => {

    console.log("Trying to delete an item from the list");

    // select the proper item by ID and remove it from the html
    const item = document.querySelector(`[data-itemid="${id}"]`);


    console.log("The item we selected is " + item);
    console.log("The parent element is: " + item.parentElement);
    item.parentElement.removeChild(item);

};


// delete entire shopping list from the UI
export const deleteList = () => {

    //deleting all html / child nodes from the shopping list
    elements.shopping.innerHTML = '';

} 