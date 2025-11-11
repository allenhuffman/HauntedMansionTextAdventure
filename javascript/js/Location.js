class Location {
    constructor(name, description, id = null) {
        this.id = id;
        this.description = description;
        this.name = name;
        this._beenHere = false;
        this.items = [];
        this.exits = [];
        this.soundFile = null; // Background music file (if any)
    }

    // Get the location ID
    getId() {
        return this.id;
    }

    // Set the location ID
    setId(id) {
        this.id = id;
    }

    setSound(soundFile) {
        this.soundFile = soundFile;
    }

    getSound() {
        return this.soundFile;
    }

    // Set/change room description.
    setDescription(desc) {
        this.description = desc;
    }

    // Return room description.
    getDescription() {
        return this.description;
    }

    // Set/change room short name.
    setName(locationName) {
        this.name = locationName;
    }

    // Return room short name.
    getName() {
        return this.name;
    }

    // Add an exit to this location.
    addExit(exit) {
        this.exits.push(exit);
    }

    // Add an exit by direction string and destination location
    addExitByDirection(directionStr, destinationLocation) {
        // Convert direction string to Exit constant
        const directionMap = {
            'north': Exit.NORTH,
            'south': Exit.SOUTH,
            'west': Exit.WEST,
            'east': Exit.EAST,
            'up': Exit.UP,
            'down': Exit.DOWN
        };

        const direction = directionMap[directionStr.toLowerCase()];
        if (direction) {
            // Check if an exit in this direction already exists
            const existingExit = this.exits.find(exit => exit.getDirection() === direction);
            
            if (destinationLocation === 0 || destinationLocation === null) {
                // Remove the exit if destination is 0 or null
                if (existingExit) {
                    this.removeExit(existingExit);
                }
            } else {
                if (existingExit) {
                    // Modify existing exit
                    existingExit.setLeadsTo(destinationLocation);
                } else {
                    // Create new exit
                    const exit = new Exit(direction, destinationLocation);
                    this.addExit(exit);
                }
            }
        }
    }

    // Remove an exit from this location.
    removeExit(exit) {
        const index = this.exits.indexOf(exit);
        if (index > -1) {
            this.exits.splice(index, 1);
        }
    }

    // Return a copy of exits array.
    getExits() {
        // Return a clone, as we don't want an external
        // item to modify our original array
        return [...this.exits];
    }

    // Add (drop) an item in this location.
    addItem(item) {
        this.items.push(item);
    }

    // Remove (get) an item from this location.
    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }

    // Returns a copy of items array
    getItems() {
        return [...this.items];
    }

    // Set/change been here status.
    beenHere(beenHereValue) {
        if (beenHereValue !== undefined) {
            this._beenHere = beenHereValue;
        }
        return this._beenHere;
    }
}