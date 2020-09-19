// Shopping List model
import uniqid from 'uniqid';



// need to add methods here to persist the shopping list in local storage

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

        //persist data in local storage
        this.persistData();

        return item;
    }

    // method to remove an item from our shopping list
    deleteItem(id) {

        const index = this.items.findIndex(el => el.id === id);
        // note: difference between slice and splice
        // [2,4,8] splice(1,2) -> returns [4,8], array becomes [2]
        // [2,4,8] slice(1,2) -> returns 4, array is [2,4,8]
        this.items.splice(index, 1);

        console.log("successfully deleted from state");

        this.persistData();
    }

    // method to update the amount of ingredient needed in the shopping list
    updateCount(id, newCount) {

        // find the element with the id we passed in, update the count
        this.items.find(el => el.id === id).count = newCount;
    }

// adding a method to delete the entire shopping list contents
    deleteList() {
        this.items = [];
    }

    persistData() {
        localStorage.setItem('items', JSON.stringify(this.items));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('items'));

        // restoring likes from the localStorage
        if (storage) this.items = storage;
    }  
}