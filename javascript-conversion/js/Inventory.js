class Inventory {
    constructor() {
        this.items = [];
    }

    // Add an item into inventory.
    addItem(item) {
        this.items.push(item);
    }

    // Remove an item from inventory.
    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    // Return a copy of items array.
    getItems() {
        return [...this.items];
    }
}