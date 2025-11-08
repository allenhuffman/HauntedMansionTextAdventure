class CreateWorld {
    constructor() {
        this.locations = [];     // List of Location items.
        this.exits = [];         // List of Exit items.
        this.currentLocation = null;    // Where we currently are in the game.
        this.inventory = new Inventory();   // What we are holding (player's inventory).
    }

    async init() {
        let tempLocation = [];

        try {
            // Load room data from JSON
            console.log("Retrieving map from: data/hm_map.json");
            const mapResponse = await fetch('data/hm_map.json');
            const mapData = await mapResponse.json();

            const numRooms = mapData.rooms.length;
            tempLocation = new Array(numRooms);

            // Create Location objects
            for (let i = 0; i < numRooms; i++) {
                const room = mapData.rooms[i];
                tempLocation[room.id] = new Location(room.name, room.description, room.id);
            }
            console.log(numRooms + " rooms added to game.");

            // Create exits
            let numExits = 0;
            for (let i = 0; i < numRooms; i++) {
                const room = mapData.rooms[i];
                const roomLocation = tempLocation[room.id];
                
                // Map exit directions: north=1, south=2, west=3, east=4, up=5, down=6
                const exitMappings = [
                    { direction: 1, target: room.exits.north },   // North
                    { direction: 2, target: room.exits.south },   // South  
                    { direction: 3, target: room.exits.west },    // West
                    { direction: 4, target: room.exits.east },    // East
                    { direction: 5, target: room.exits.up },      // Up
                    { direction: 6, target: room.exits.down }     // Down
                ];

                for (const exit of exitMappings) {
                    if (exit.target !== 0) { // If this is a valid exit
                        roomLocation.addExit(new Exit(exit.direction, tempLocation[exit.target]));
                        numExits++;
                    }
                }
            }
            console.log(numExits + " exits added to game.");
            this.currentLocation = tempLocation[1]; // Start at room 1

        } catch (e) {
            console.log("Error loading map -- " + e.toString());
            return;
        }

        // Now load items
        try {
            console.log("Retrieving item list from: data/hm_items.json");
            const itemResponse = await fetch('data/hm_items.json');
            const itemData = await itemResponse.json();

            // Initialize items tracking
            this.allItems = {}; // Track all items by ID for revealing
            this.hiddenItems = {}; // Track hidden items (startLocation: 0)

            // Create item objects
            for (const itemInfo of itemData.items) {
                const actions = itemInfo.actions || [];
                const item = new Item(itemInfo.keyword, itemInfo.name, itemInfo.description, itemInfo.carryable, actions);
                
                // Store item by ID for revealing system
                this.allItems[itemInfo.id] = item;
                
                if (itemInfo.startLocation === 0) { // Hidden items (limbo)
                    this.hiddenItems[itemInfo.id] = item;
                    // Also add to room 0 so they're visible with GOTO 0 debug command
                    tempLocation[0].addItem(item);
                } else { // In a location
                    tempLocation[itemInfo.startLocation].addItem(item);
                }
            }
            console.log(itemData.items.length + " items added to game.");

        } catch (e) {
            console.log("Error loading items -- " + e.toString());
            return;
        }

        // Sound hack - hardcoded sound zones matching the Java original
        // Zone where foyer music plays.
        tempLocation[1].setSound("foyer.au");
        tempLocation[2].setSound("foyer.au");
        // Zone where storm plays
        tempLocation[3].setSound("storm.au");
        tempLocation[4].setSound("storm.au");
        // Zones where load music plays.
        tempLocation[5].setSound("load.au");
        tempLocation[6].setSound("load.au");
        tempLocation[14].setSound("load.au");
        tempLocation[11].setSound("load.au");
        tempLocation[12].setSound("load.au");
        // Zone where ballroom music plays.
        tempLocation[15].setSound("ballroom.au");
        tempLocation[32].setSound("ballroom.au");
        tempLocation[29].setSound("ballroom.au");
        // Zone where attic music plays.
        tempLocation[46].setSound("attic.au");
        tempLocation[51].setSound("attic.au");
        // Zone where attic ledge music plays.
        tempLocation[52].setSound("atticledge.au");
        // Zone where doors play.
        tempLocation[23].setSound("doors.au");
        tempLocation[25].setSound("doors.au");
        
        // Store the locations array for ActionItem access
        this.locations = tempLocation;
    }

    // Player functions.
    getLocation() {
        return this.currentLocation;
    }

    setLocation(location) {
        this.currentLocation = location;
    }

    addItem(item) {
        this.inventory.addItem(item);
    }

    removeItem(item) {
        this.inventory.removeItem(item);
    }

    getItems() {
        return this.inventory.getItems();
    }

    // Reveal a hidden item by moving it from limbo to the specified location
    revealItemById(itemId, targetLocation) {
        const item = this.hiddenItems[itemId];
        if (item) {
            // Remove from hidden items tracking
            delete this.hiddenItems[itemId];
            // Remove from room 0 (limbo)
            this.locations[0].removeItem(item);
            // Add to target location
            targetLocation.addItem(item);
            return item;
        }
        return null;
    }
}