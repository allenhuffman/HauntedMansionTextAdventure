class World {
    constructor() {
        this.locations = [];    // List of Location items.
        this.exits = [];        // List of Exit items.
        this.items = [];        // List of Item items.
        this.player = new Player(); // Player item.
    }

    // Add exit to the world.
    addExit(exit) {
        if (!this.exits.includes(exit)) {
            this.exits.push(exit);
        }
    }

    // Add location to the world.
    addLocation(location) {
        if (!this.locations.includes(location)) {
            this.locations.push(location);
        }
    }

    // Add items to the world.
    addItem(item) {
        if (!this.items.includes(item)) {
            this.items.push(item);
        }
    }

    // Get all locations
    getLocations() {
        return [...this.locations]; // Return a copy
    }

    // Get all exits
    getExits() {
        return [...this.exits]; // Return a copy
    }

    // Get all items
    getItems() {
        return [...this.items]; // Return a copy
    }

    // Get the player
    getPlayer() {
        return this.player;
    }
}