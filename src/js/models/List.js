// Shopping List model
import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    // add an item to our shopping list
    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    // method to remove an item from our shopping list
    deleteItem (id) {

        const index = this.items.findIndex(el => el.id === id);
        // note: difference between slice and splice
        // [2,4,8] splice(1,2) -> returns [4,8], array becomes [2]
        // [2,4,8] slice(1,2) -> returns 4, array is [2,4,8]
        this.items.splice(index, 1);
    }

    // method to update the amount of ingredient needed in the shopping list
    updateCount(id, newCount) {

        // find the element with the id we passed in, update the count
        this.items.find(el => el.id === id).count = newCount;
    }
}