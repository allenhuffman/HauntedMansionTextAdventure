/**
 * ActionItemHandler - Handles special item interactions with custom verbs
 * 
 * Extracted from Adventure.js fallback system to handle ActionItems properly.
 * ActionItems are special items that respond to custom verbs like "USE CRYSTAL", "TOUCH MIRROR", etc.
 */
class ActionItemHandler {
    constructor(adventure) {
        this.adventure = adventure;
        this.itemMatcher = new ItemMatcher();
    }

    /**
     * Check if this handler can process the given command
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (item keyword)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {boolean} - True if we have an ActionItem and it has executeAction method
     */
    canHandle(verb, noun, parseResult) {
        if (!verb || !noun) {
            return false;
        }

        console.log(`ActionItemHandler: canHandle called with verb="${verb}", noun="${noun}"`);

        // Find the ActionItem using smart matching
        const actionItem = this.findActionItem(noun, parseResult);
        if (!actionItem) {
            console.log(`ActionItemHandler: No ActionItem found for "${noun}"`);
            return false;
        }

        console.log(`ActionItemHandler: Found ActionItem "${actionItem.getKeyword()}" with executeAction: ${typeof actionItem.executeAction}`);

        // Check if this ActionItem has the executeAction method (indicating it's a full ActionItem)
        const hasExecuteAction = typeof actionItem.executeAction === 'function';
        
        // Also check if this ActionItem actually supports the specific verb
        let hasVerb = false;
        if (hasExecuteAction && typeof actionItem.hasAction === 'function') {
            hasVerb = actionItem.hasAction(verb);
            console.log(`ActionItemHandler: ActionItem has verb "${verb}": ${hasVerb}`);
        }
        
        const canHandle = hasExecuteAction && hasVerb;
        console.log(`ActionItemHandler: canHandle result = ${canHandle} (executeAction: ${hasExecuteAction}, hasVerb: ${hasVerb})`);
        return canHandle;
    }

    /**
     * Handle ActionItem interactions
     * @param {string} verb - The action verb (USE, TOUCH, ACTIVATE, etc.)
     * @param {string} noun - The item keyword (for backward compatibility)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {Object} - Result object with success flag and moved status
     */
    handle(verb, noun, parseResult) {
        console.log(`ActionItemHandler: handle called with verb="${verb}", noun="${noun}"`);
        
        const actionItem = this.findActionItem(noun, parseResult);
        if (!actionItem) {
            console.log(`ActionItemHandler: No ActionItem found in handle`);
            return { success: false, moved: false };
        }

        const currentRoomId = this.adventure.player.getLocation().getId ? 
                            this.adventure.player.getLocation().getId() : 1;
        
        console.log(`ActionItemHandler: Found ActionItem, executing action "${verb}" in room ${currentRoomId}`);

        // Determine which item collection this ActionItem belongs to
        let itemCollection = null;
        const playerItems = this.adventure.player.getItems();
        const locationItems = this.adventure.player.getLocation().getItems();

        // Check if it's in player inventory
        if (playerItems.some(item => item === actionItem)) {
            itemCollection = playerItems;
        } else if (locationItems.some(item => item === actionItem)) {
            itemCollection = locationItems;
        }

        if (!itemCollection) {
            this.adventure.desc.value += "You can't interact with that right now.\n";
            return { success: true, moved: false };
        }

        // Execute the ActionItem's JSON-driven action
        let result = null;
        if (typeof actionItem.executeAction === 'function') {
            result = actionItem.executeAction(verb, currentRoomId, this.adventure.player, itemCollection);
        }
        
        if (result && result.success) {
            this.adventure.desc.value += result.message + "\n";
            
            // Handle revealing items in current location
            if (result.revealsItemId && !result.revealsItemLocation) {
                this.revealItem(result.revealsItemId);
            }
            
            // Handle revealing items in specific location
            if (result.revealsItemId && result.revealsItemLocation) {
                this.revealItemInLocation(result.revealsItemId, result.revealsItemLocation);
            }
            
            // Handle sound effects
            if (result.addSound && Array.isArray(result.addSound)) {
                this.handleSoundEffects(result.addSound, currentRoomId);
            }
            
            // Handle location change if the ActionItem moves the player
            let moved = false;
            if (result.newLocation) {
                const newLoc = this.adventure.player.locations[result.newLocation];
                if (newLoc) {
                    this.adventure.player.setLocation(newLoc);
                    moved = true;
                }
            }
            
            // Handle adding exits
            if (result.addExit) {
                this.handleAddExit(result.addExit, currentRoomId);
            }
            
            return { success: true, moved: moved };
        } else {
            // ActionItem didn't handle this verb, let other handlers try
            return { success: false, moved: false };
        }
    }

    /**
     * Find an ActionItem by keyword in player inventory or current location
     * @param {string} keyword - The item keyword to search for (for backward compatibility)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {ActionItem|null} - The matching ActionItem or null if not found
     */
    findActionItem(keyword, parseResult) {
        if (!keyword) {
            return null;
        }

        const fullNoun = parseResult && parseResult.getFullNoun ? parseResult.getFullNoun() : keyword;
        const searchTerm = fullNoun || keyword;

        // Get ALL items from both player inventory and location (not just ActionItems)
        const playerItems = this.adventure.player.getItems();
        const locationItems = this.adventure.player.getLocation().getItems();
        const allItems = [...playerItems, ...locationItems];
        
        // Do smart matching across ALL items to find the best match
        const matchResult = this.itemMatcher.findBestMatch(searchTerm, allItems);
        
        // Check if disambiguation is needed
        const disambigResult = this.itemMatcher.handleDisambiguation(matchResult.matches, searchTerm);
        
        if (disambigResult.needsDisambiguation) {
            // Let other handlers deal with disambiguation
            return null;
        } else if (disambigResult.selectedItem) {
            // Only return the item if it's an ActionItem - otherwise let other handlers deal with it
            if (disambigResult.selectedItem.isSpecial && disambigResult.selectedItem.isSpecial()) {
                return disambigResult.selectedItem;
            }
        }
        
        return null;
    }

    /**
     * Get all ActionItems currently available to the player
     * @returns {Array} - Array of available ActionItems
     */
    getAvailableActionItems() {
        const actionItems = [];

        // Get ActionItems from player inventory
        const playerItems = this.adventure.player.getItems();
        for (const anItem of playerItems) {
            if (anItem.isSpecial && anItem.isSpecial()) {
                actionItems.push(anItem);
            }
        }

        // Get ActionItems from current location
        const locationItems = this.adventure.player.getLocation().getItems();
        for (const anItem of locationItems) {
            if (anItem.isSpecial && anItem.isSpecial()) {
                actionItems.push(anItem);
            }
        }

        return actionItems;
    }

    /**
     * Reveal a hidden item by adding it to the current location
     * @param {number} itemId - The ID of the item to reveal
     */
    revealItem(itemId) {
        console.log(`ActionItemHandler: Attempting to reveal item with ID: ${itemId}`);
        
        // Find the item in the CreateWorld's allItems collection (stored in this.adventure.player)
        const allItems = this.adventure.player.allItems;
        if (!allItems) {
            console.log("ActionItemHandler: allItems not available in player (CreateWorld)");
            return;
        }

        const itemToReveal = allItems[itemId];
        if (!itemToReveal) {
            console.log(`ActionItemHandler: Item with ID ${itemId} not found in allItems`);
            return;
        }

        console.log(`ActionItemHandler: Found item to reveal: ${itemToReveal.getName()}`);

        // Add the item to the current location
        const currentLocation = this.adventure.player.getLocation();
        currentLocation.addItem(itemToReveal);
        
        console.log(`ActionItemHandler: Revealed item: ${itemToReveal.getName()} in location ${currentLocation.getName()}`);
        
        // Also remove from hiddenItems if it was there
        if (this.adventure.player.hiddenItems && this.adventure.player.hiddenItems[itemId]) {
            delete this.adventure.player.hiddenItems[itemId];
            console.log(`ActionItemHandler: Removed item ${itemId} from hiddenItems`);
        }

        // Force a refresh of the room description to show the newly revealed item
        this.adventure.desc.value += `\nYou notice something you hadn't seen before...\n`;
    }

    /**
     * Handle sound effects from action definitions
     * @param {Array} soundEffects - Array of sound effect definitions
     * @param {number} currentRoomId - Current room ID
     */
    handleSoundEffects(soundEffects, currentRoomId) {
        console.log(`ActionItemHandler: Processing ${soundEffects.length} sound effects`);
        
        // Update sound configuration for each room specified
        for (const soundEffect of soundEffects) {
            const targetRoomId = soundEffect.roomId;
            const soundFile = soundEffect.soundFile;
            
            console.log(`ActionItemHandler: Setting sound ${soundFile} for room ${targetRoomId}`);
            
            // Find the target location and set its sound
            const targetLocation = this.adventure.player.locations[targetRoomId];
            if (targetLocation && targetLocation.setSound) {
                targetLocation.setSound(soundFile);
                console.log(`ActionItemHandler: Sound ${soundFile} set for location ${targetLocation.getName()}`);
            } else {
                console.log(`ActionItemHandler: Could not find location ${targetRoomId} or setSound method`);
            }
        }
        
        // Start playing sound for current room if it was affected
        const currentRoomSound = soundEffects.find(sound => sound.roomId === currentRoomId);
        if (currentRoomSound && this.adventure.soundPlayer && this.adventure.soundPlayer.loop) {
            console.log(`ActionItemHandler: Starting sound ${currentRoomSound.soundFile} in current room ${currentRoomId}`);
            this.adventure.soundPlayer.loop(currentRoomSound.soundFile);
        }
    }

    /**
     * Handle adding exits from action definitions
     * @param {Object} exitDef - Exit definition
     * @param {number} currentRoomId - Current room ID
     */
    handleAddExit(exitDef, currentRoomId) {
        console.log(`ActionItemHandler: Adding exit ${exitDef.direction} to ${exitDef.destination} in room ${currentRoomId}`);
        
        // Find the current location and add the exit
        const currentLocation = this.adventure.player.getLocation();
        if (currentLocation && currentLocation.addExit) {
            // Convert direction string to Exit constant
            let directionConstant = Exit.UNDEFINED;
            const dir = exitDef.direction.toUpperCase();
            switch (dir) {
                case "NORTH": directionConstant = Exit.NORTH; break;
                case "SOUTH": directionConstant = Exit.SOUTH; break;
                case "WEST": directionConstant = Exit.WEST; break;
                case "EAST": directionConstant = Exit.EAST; break;
                case "UP": directionConstant = Exit.UP; break;
                case "DOWN": directionConstant = Exit.DOWN; break;
            }
            
            // Find the destination location object
            const destinationLocation = this.adventure.player.locations[exitDef.destination];
            if (destinationLocation) {
                const exit = new Exit(directionConstant, destinationLocation);
                currentLocation.addExit(exit);
                console.log(`ActionItemHandler: Successfully added ${dir} exit to room ${exitDef.destination}`);
            } else {
                console.log(`ActionItemHandler: Could not find destination location ${exitDef.destination}`);
            }
        }
    }

    /**
     * Reveal an item in a specific location
     * @param {number} itemId - The ID of the item to reveal
     * @param {number} locationId - The ID of the location to reveal it in
     */
    revealItemInLocation(itemId, locationId) {
        console.log(`ActionItemHandler: Attempting to reveal item ${itemId} in location ${locationId}`);
        
        const allItems = this.adventure.player.allItems;
        if (!allItems) {
            console.log("ActionItemHandler: allItems not available");
            return;
        }

        const itemToReveal = allItems[itemId];
        if (!itemToReveal) {
            console.log(`ActionItemHandler: Item with ID ${itemId} not found`);
            return;
        }

        // Find the target location
        const locations = this.adventure.player.locations;
        const targetLocation = locations[locationId];
        if (!targetLocation) {
            console.log(`ActionItemHandler: Location ${locationId} not found`);
            return;
        }

        // Add the item to the target location
        targetLocation.addItem(itemToReveal);
        console.log(`ActionItemHandler: Revealed item ${itemToReveal.getName()} in location ${targetLocation.getName()}`);
        
        // Remove from hiddenItems
        if (this.adventure.player.hiddenItems && this.adventure.player.hiddenItems[itemId]) {
            delete this.adventure.player.hiddenItems[itemId];
            console.log(`ActionItemHandler: Removed item ${itemId} from hiddenItems`);
        }
    }
}

// Expose to global scope for CommandRouter
window.ActionItemHandler = ActionItemHandler;