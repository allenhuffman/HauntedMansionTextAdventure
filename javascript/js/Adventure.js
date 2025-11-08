class Adventure {
    constructor() {
        this.desc = null;          // TextArea equivalent
        this.input = null;         // TextField equivalent
        this.verbose = false;
        this.player = null;        // CreateWorld instance
        this.soundPlayer = null;
    }

    async init() {
        // Initialize Audio subsystem
        this.soundPlayer = new SoundPlayer();

        // Get references to HTML elements
        this.desc = document.getElementById('desc');
        this.input = document.getElementById('input');

        // Add event listener for input
        this.input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.textEntered();
            }
        });

        // Add click event to enable audio (browser autoplay policy)
        document.addEventListener('click', () => {
            if (this.soundPlayer) {
                this.soundPlayer.enableAudio();
            }
        }, { once: true });

        // Focus on input field
        this.input.focus();

        this.desc.value = "Welcome, foolish mortal.\n\nLoading game map and items...\n\n(Click anywhere to enable atmospheric audio)\n";
        
        // Initialize the world
        this.player = new CreateWorld();
        await this.player.init();

        // Display initial location
        this.showLocation();
    }

    textEntered() {
        const parser = new Parse();
        let line = this.input.value;

        if (line.length === 0) return; // Ignore NULL lines...
        line = line.trim(); // Remove leading and trailing whitespace.

        parser.parse(line);
        let verb = parser.getVerb();
        let noun = parser.getNoun();

        // Handle direction shortcuts
        if (verb && verb.toUpperCase() === "N") { verb = "GO"; noun = "NORTH"; }
        if (verb && verb.toUpperCase() === "S") { verb = "GO"; noun = "SOUTH"; }
        if (verb && verb.toUpperCase() === "W") { verb = "GO"; noun = "WEST"; }
        if (verb && verb.toUpperCase() === "E") { verb = "GO"; noun = "EAST"; }
        if (verb && verb.toUpperCase() === "U") { verb = "GO"; noun = "UP"; }
        if (verb && verb.toUpperCase() === "D") { verb = "GO"; noun = "DOWN"; }
        if (verb && verb.toUpperCase() === "I") { verb = "INVENTORY"; }
        if (verb && verb.toUpperCase() === "L") { verb = "LOOK"; }

        this.desc.value += "> " + line + "\n";

        let moved = false;
        
        // Handle verbs (commands)...
        if (verb && verb.toUpperCase() === "GO") {
            moved = false;
            const exits = this.player.getLocation().getExits();
            
            for (const anExit of exits) {
                if ((anExit.getDirectionName() && anExit.getDirectionName().toUpperCase() === (noun || "").toUpperCase()) ||
                    (anExit.getShortDirectionName() && anExit.getShortDirectionName().toUpperCase() === (noun || "").toUpperCase())) {
                    // Set location to the location pointed to by exit.
                    this.player.setLocation(anExit.getLeadsTo());
                    moved = true;
                    break;
                }
            }

            if (!moved) this.desc.value += "You can't go that way.\n";
        }
        else if (verb && verb.toUpperCase() === "INVENTORY") {
            this.desc.value += "You are carrying ";
            let items = false;
            const playerItems = this.player.getItems();
            
            for (let i = 0; i < playerItems.length; i++) {
                const anItem = playerItems[i];
                if (items === true && i === playerItems.length - 1) this.desc.value += "and ";
                this.desc.value += anItem.getName();
                items = true;
                if (i < playerItems.length - 1) { // More items?
                    this.desc.value += ", ";
                } else {
                    this.desc.value += ".\n";
                }
            }
            if (!items) this.desc.value += "nothing.\n";
        }
        else if (verb && (verb.toUpperCase() === "GET" || verb.toUpperCase() === "TAKE")) {
            let items = false;
            
            if (noun && noun.toUpperCase() === "ALL") {
                // Handle "GET ALL" - process all items once, restart only when item is taken
                let foundItem = true;
                while (foundItem) {
                    foundItem = false;
                    const locationItems = this.player.getLocation().getItems();
                    
                    for (const anItem of locationItems) {
                        if (anItem.isGetable() === true) {
                            this.player.getLocation().removeItem(anItem);
                            this.player.addItem(anItem);
                            this.desc.value += anItem.getKeyword() + " taken.\n";
                            items = true;
                            foundItem = true; // Found a getable item, restart to get fresh item list
                            break;
                        }
                    }
                }
                // Now handle non-getable items (only show message once each)
                const remainingItems = this.player.getLocation().getItems();
                for (const anItem of remainingItems) {
                    this.desc.value += "You can't get the " + anItem.getKeyword() + ".\n";
                }
                if (remainingItems.length > 0) items = true; // Mark that we found items
            } else {
                // Handle specific item
                const locationItems = this.player.getLocation().getItems();
                for (const anItem of locationItems) {
                    if (anItem.getKeyword() && anItem.getKeyword().toUpperCase() === (noun || "").toUpperCase()) {
                        items = true;
                        if (anItem.isGetable() === true) {
                            this.player.getLocation().removeItem(anItem);
                            this.player.addItem(anItem);
                            this.desc.value += anItem.getKeyword() + " taken.\n";
                        } else {
                            this.desc.value += "You can't get the " + anItem.getKeyword() + ".\n";
                        }
                        break;
                    }
                }
            }
            if (!items) this.desc.value += "I don't see that here.\n";
        }
        else if (verb && verb.toUpperCase() === "DROP") {
            let items = false;
            
            // Use while loop with fresh array each iteration to handle "ALL" case
            // This matches the Java HACK: e = player.getItems().elements();
            let foundItem = true;
            while (foundItem) {
                foundItem = false;
                const playerItems = this.player.getItems();
                
                for (const anItem of playerItems) {
                    // Item is here, see if this is what they want to drop.
                    if ((anItem.getKeyword() && anItem.getKeyword().toUpperCase() === (noun || "").toUpperCase()) ||
                        (noun && noun.toUpperCase() === "ALL")) {
                        this.player.removeItem(anItem);
                        this.player.getLocation().addItem(anItem);
                        this.desc.value += anItem.getKeyword() + " dropped.\n";
                        foundItem = true; // Continue searching for more items
                        items = true;
                        if (noun && noun.toUpperCase() !== "ALL") {
                            foundItem = false; // Only drop one item unless ALL
                        }
                        break; // Restart the loop with fresh item list
                    }
                }
            }
            if (!items) this.desc.value += "You don't seem to be carrying that.\n";
        }
        else if (verb && verb.toUpperCase() === "VERBOSE") {
            if (noun === null || noun.toUpperCase() === "ON") {
                this.verbose = true;
            } else if (noun.toUpperCase() === "OFF") {
                this.verbose = false;
            }
            if (this.verbose === true) {
                this.desc.value += "Verbose mode is ON.\n";
            } else {
                this.desc.value += "Verbose mode is OFF.\n";
            }
        }
        else if (verb && (verb.toUpperCase() === "LOOK" || verb.toUpperCase() === "EXAMINE")) {
            if (noun === null) { // are we just looking at the room?
                this.player.getLocation().beenHere(false); // kinda a kludge
                this.showLocation();
            } else {
                // Nope, find the item...
                let items = false;
                
                // First check player inventory
                const playerItems = this.player.getItems();
                for (const anItem of playerItems) {
                    // Item is in inventory, see if this is what they want to examine.
                    if (anItem.getKeyword() && anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                        this.desc.value += anItem.getDescription() + "\n";
                        items = true;
                        break;
                    }
                }
                
                // Now check for items that are in the room.
                if (!items) {
                    const locationItems = this.player.getLocation().getItems();
                    for (const anItem of locationItems) {
                        // Item is in room, see if this is what they want to examine.
                        if (anItem.getKeyword() && anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                            this.desc.value += anItem.getDescription() + "\n";
                            items = true;
                            break;
                        }
                    }
                }

                if (!items) this.desc.value += "I don't see that around here.\n";
            } // end of (noun===null)
        }
        else if (verb && verb.toUpperCase() === "GOTO") {
            // Debug command: teleport to any room by number
            if (noun && !isNaN(noun)) {
                const roomId = parseInt(noun);
                if (this.player.locations[roomId]) {
                    this.player.setLocation(this.player.locations[roomId]);
                    this.desc.value += `[DEBUG: Teleported to room ${roomId}]\n`;
                    moved = true;
                } else {
                    this.desc.value += `[DEBUG: Room ${roomId} does not exist]\n`;
                }
            } else {
                this.desc.value += "[DEBUG: Usage: GOTO <room_number>]\n";
            }
        } else {
            // Check for ActionItems - items that respond to custom verbs
            let actionHandled = false;
            if (verb && noun) {
                const currentRoomId = this.player.getLocation().getId ? this.player.getLocation().getId() : 1;
                
                // Check player inventory for ActionItems
                const playerItems = this.player.getItems();
                for (const anItem of playerItems) {
                    if (anItem.isSpecial() && anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                        const result = anItem.executeAction(verb, currentRoomId, this.world, playerItems);
                        if (result && result.success) {
                            this.desc.value += result.message + "\n";
                            
                            // Handle location change
                            if (result.newLocation) {
                                // Find the location by ID in the locations array
                                const newLoc = this.player.locations[result.newLocation];
                                if (newLoc) {
                                    this.player.setLocation(newLoc);
                                    moved = true;
                                }
                            }
                            
                            // Handle dynamic exit creation
                            if (result.addExit) {
                                const destinationLocation = this.player.locations[result.addExit.destination];
                                if (destinationLocation) {
                                    this.player.getLocation().addExitByDirection(result.addExit.direction, destinationLocation);
                                }
                            }
                            
                            // Handle item description/name changes
                            if (result.newDescription) {
                                anItem.setDescription(result.newDescription);
                            }
                            if (result.newName) {
                                anItem.setName(result.newName);
                            }
                            
                            // Handle item consumption
                            if (result.consumeItem) {
                                this.player.removeItem(anItem);
                            }
                            
                            actionHandled = true;
                            break;
                        }
                    }
                }
                
                // Check room items for ActionItems
                if (!actionHandled) {
                    const locationItems = this.player.getLocation().getItems();
                    for (const anItem of locationItems) {
                        if (anItem.isSpecial() && anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                            const result = anItem.executeAction(verb, currentRoomId, this.world, playerItems);
                            if (result && result.success) {
                                this.desc.value += result.message + "\n";
                                
                                // Handle location change
                                if (result.newLocation) {
                                    // Find the location by ID in the locations array
                                    const newLoc = this.player.locations[result.newLocation];
                                    if (newLoc) {
                                        this.player.setLocation(newLoc);
                                        moved = true;
                                    }
                                }
                                
                                // Handle dynamic exit creation
                                if (result.addExit) {
                                    const destinationLocation = this.player.locations[result.addExit.destination];
                                    if (destinationLocation) {
                                        this.player.getLocation().addExitByDirection(result.addExit.direction, destinationLocation);
                                    }
                                }
                                
                                // Handle item description/name changes
                                if (result.newDescription) {
                                    anItem.setDescription(result.newDescription);
                                }
                                if (result.newName) {
                                    anItem.setName(result.newName);
                                }
                                
                                // Handle item consumption
                                if (result.consumeItem) {
                                    this.player.getLocation().removeItem(anItem);
                                }
                                
                                actionHandled = true;
                                break;
                            }
                        }
                    }
                }
            }
            
            if (!actionHandled && moved === false) {
                this.desc.value += "I have no idea what you are trying to do.\n";
            }
        }

        // See if we have to redisplay the location stuff.
        if (moved === true) this.showLocation();

        this.input.value = "";
        
        // Auto-scroll to bottom
        this.desc.scrollTop = this.desc.scrollHeight;
    }

    showLocation() {
        let flag = false;

        this.desc.value += "\nLOCATION: " + this.player.getLocation().getName() + "\n";
        
        if (this.player.getLocation().beenHere() === false || this.verbose === true) {
            this.desc.value += this.player.getLocation().getDescription() + "\n";
            this.player.getLocation().beenHere(true);
        }

        flag = false; // No exits found yet.
        const allExits = this.player.getLocation().getExits();
        // Filter out exits that point to room 0 or null (blocked exits)
        const exits = allExits.filter(exit => exit.getLeadsTo() && exit.getLeadsTo().getId && exit.getLeadsTo().getId() !== 0);
        
        for (let i = 0; i < exits.length; i++) {
            const anExit = exits[i];
            if (flag === true) { // If we have printed at least one dir...
                if (i === exits.length - 1) { // ...but there are no more after this one,
                    this.desc.value += " and "; // ...we can print the final "and".
                } else { // Else there are more after this one...
                    this.desc.value += ", "; // ...so just print a comma.
                }
            }
            if (flag === false) this.desc.value += "Obvious exits lead ";
            this.desc.value += anExit.getDirectionName();
            flag = true;
            if (i === exits.length - 1) this.desc.value += ".\n";
        }
        if (flag === false) this.desc.value += "There are no obvious exits.\n";

        flag = false; // no items
        this.desc.value += "You see ";
        const items = this.player.getLocation().getItems();
        
        for (let i = 0; i < items.length; i++) {
            const anItem = items[i];
            if (flag === true && i === items.length - 1) this.desc.value += "and ";
            this.desc.value += anItem.getName();
            flag = true;
            if (i < items.length - 1) { // More items?
                this.desc.value += ", ";
            } else {
                this.desc.value += ".\n";
            }
        }
        if (!flag) {
            this.desc.value += "nothing of interest.\n";
        }
        
        // HACK - Audio system
        if (this.player.getLocation().getSound() !== null) {
            this.desc.value += "[Background sound: " + this.player.getLocation().getSound() + "]\n";
            this.soundPlayer.loop(this.player.getLocation().getSound());
        }
        
        // Auto-scroll to bottom
        this.desc.scrollTop = this.desc.scrollHeight;
    }
}