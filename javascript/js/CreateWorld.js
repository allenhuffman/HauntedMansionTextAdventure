class CreateWorld {
    constructor() {
        this.locations = [];     // List of Location items.
        this.exits = [];         // List of Exit items.
        this.currentLocation = null;    // Where we currently are in the game.
        this.inventory = new Inventory();   // What we are holding (player's inventory).
    }

    async init() {
        let tempLocation = [];
        const errors = []; // Collect errors to report to user

        // Use global configuration loaded in index.html
        const config = window.gameConfig || {};
        this.config = config; // Store for backward compatibility

        try {
            // Load room data from JSON
            const mapFile = this.config.data_files?.map || "data/hm_map.json";
            console.log("Retrieving map from: " + mapFile);
            const mapResponse = await fetch(mapFile);
            const mapData = await mapResponse.json();

            const numRooms = mapData.rooms.length;
            // Size array to accommodate highest room ID + limbo (room 0)
            const maxRoomId = Math.max(...mapData.rooms.map(room => room.id));
            tempLocation = new Array(maxRoomId + 1);

            // Create limbo room (room 0) for hidden items
            tempLocation[0] = new Location("Limbo", "A place for hidden items (debug only)", 0);

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
            const mapFile = this.config.data_files?.map || "hm_map.json";
            errors.push("Failed to load game map (" + mapFile + "): " + e.message);
        }

        // Now load items
        try {
            const itemsFile = this.config.data_files?.items || "data/hm_items.json";
            console.log("Retrieving item list from: " + itemsFile);
            const itemResponse = await fetch(itemsFile);
            const itemData = await itemResponse.json();

            // Initialize items tracking
            this.allItems = {}; // Track all items by ID for revealing
            this.hiddenItems = {}; // Track hidden items (startLocation: 0)

            // Create item objects
            for (const itemInfo of itemData.items) {
                const actions = itemInfo.actions || [];
                let item;
                
                // Create ActionItem if it has actions, otherwise regular Item
                // Use new object-based constructor format for proper name-only support
                const itemOptions = {
                    name: itemInfo.name || itemInfo.keyword, // Prefer name, fallback to keyword
                    description: itemInfo.description,
                    getable: itemInfo.carryable !== undefined ? itemInfo.carryable : true,
                    invisible: itemInfo.invisible || false,
                    actions: actions
                };
                
                if (actions.length > 0) {
                    item = new ActionItem(itemOptions);
                    item.setActions(actions);
                } else {
                    item = new Item(itemOptions);
                }
                
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
            const itemsFile = this.config.data_files?.items || "hm_items.json";
            errors.push("Failed to load game items (" + itemsFile + "): " + e.message);
        }

        // Set up audio zones and room-specific overrides
        try {
            // First, load audio zones
            const audioFile = this.config.data_files?.audio || "data/hm_audio.json";
            console.log("Loading audio zones from: " + audioFile);
            const audioResponse = await fetch(audioFile);
            const audioData = await audioResponse.json();
            
            // Store zones for dynamic updates
            this.audioZones = audioData.zones;
            
            let audioRoomCount = 0;
            
            // Apply zone audio to rooms (only if zone has soundFile and is enabled)
            for (const [zoneName, zoneData] of Object.entries(audioData.zones)) {
                if (zoneData.soundFile && zoneData.enabled !== false) { 
                    // Apply audio if zone has soundFile and is not explicitly disabled
                    for (const roomId of zoneData.rooms) {
                        if (tempLocation[roomId]) {
                            tempLocation[roomId].setSound(zoneData.soundFile);
                            console.log(`Zone ${zoneName} - Room ${roomId}: ${zoneData.soundFile}`);
                            audioRoomCount++;
                        }
                    }
                } else if (zoneData.soundFile && zoneData.enabled === false) {
                    console.log(`Zone ${zoneName} - Audio disabled (${zoneData.rooms.length} rooms, would play: ${zoneData.soundFile})`);
                } else {
                    console.log(`Zone ${zoneName} - Silent zone (${zoneData.rooms.length} rooms)`);
                }
            }
            
            // Then, apply room-specific overrides from hm_map.json
            const mapResponse = await fetch('data/hm_map.json');
            const mapData = await mapResponse.json();
            
            for (const room of mapData.rooms) {
                if (room.soundFile && tempLocation[room.id]) {
                    tempLocation[room.id].setSound(room.soundFile);
                    console.log(`Room override ${room.id} (${room.name}): ${room.soundFile}`);
                    audioRoomCount++;
                }
            }
            
            console.log(`${audioRoomCount} rooms have background audio.`);
        } catch (e) {
            console.log("Error setting up room audio -- " + e.toString());
            errors.push("Failed to set up room audio: " + e.message);
        }        
        
        // Store the locations array for ActionItem access
        this.locations = tempLocation;
        
        // Return result with any errors
        return { errors: errors };
    }

    // Get game configuration
    getConfig() {
        return this.config;
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

    // Set audio for an entire zone
    setZoneSound(zoneName, soundFile) {
        if (this.audioZones && this.audioZones[zoneName]) {
            const zone = this.audioZones[zoneName];
            zone.soundFile = soundFile; // Update zone definition
            
            // Apply to all rooms in the zone
            for (const roomId of zone.rooms) {
                if (this.locations[roomId]) {
                    this.locations[roomId].setSound(soundFile);
                }
            }
            console.log(`Zone ${zoneName} audio set to: ${soundFile}`);
            return true;
        }
        console.log(`Zone ${zoneName} not found`);
        return false;
    }

    // Remove audio from an entire zone
    removeZoneSound(zoneName) {
        if (this.audioZones && this.audioZones[zoneName]) {
            const zone = this.audioZones[zoneName];
            delete zone.soundFile; // Remove from zone definition
            
            // Remove from all rooms in the zone
            for (const roomId of zone.rooms) {
                if (this.locations[roomId]) {
                    this.locations[roomId].setSound(null);
                }
            }
            console.log(`Zone ${zoneName} audio removed`);
            return true;
        }
        console.log(`Zone ${zoneName} not found`);
        return false;
    }
}