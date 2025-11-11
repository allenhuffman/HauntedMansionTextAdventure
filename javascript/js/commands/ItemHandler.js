/**
 * ItemHandler - Handles GET/TAKE and DROP commands
 * Manages item pickup and drop mechanics with location transfer
 * Enhanced with smart item matching for multi-word item names
 */
class ItemHandler {
    constructor(adventure) {
        this.adventure = adventure;
        this.itemMatcher = new ItemMatcher();
    }

    /**
     * Check if this handler can process the given command
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @returns {boolean} True if this handler can process the command
     */
    canHandle(verb, noun, parseResult) {
        if (!verb) return false;
        const upperVerb = verb.toUpperCase();
        return upperVerb === "GET" || upperVerb === "TAKE" || upperVerb === "DROP";
    }

    /**
     * Handle GET/TAKE and DROP commands
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {Object} Result object with success flag and any location changes
     */
    handle(verb, noun, parseResult) {
        const upperVerb = verb.toUpperCase();
        
        if (upperVerb === "GET" || upperVerb === "TAKE") {
            return this.handleGet(noun, parseResult);
        } else if (upperVerb === "DROP") {
            return this.handleDrop(noun, parseResult);
        }
        
        return { success: false, moved: false };
    }

    /**
     * Handle GET/TAKE command
     * @param {string} noun - The item to get (for backward compatibility)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {Object} Result object
     */
    handleGet(noun, parseResult) {
        const fullNoun = parseResult && parseResult.getFullNoun ? parseResult.getFullNoun() : noun;
        console.log(`ItemHandler: handleGet called with noun: "${noun}", fullNoun: "${fullNoun}"`);
        console.log(`ItemHandler: Current location has ${this.adventure.player.getLocation().getItems().length} items`);
        this.adventure.player.getLocation().getItems().forEach((item, index) => {
            console.log(`ItemHandler: Item ${index}: "${item.getName()}" (keyword: "${item.getKeyword()}", getable: ${item.isGetable()})`);
        });
        let items = false;
        
        if (noun && noun.toUpperCase() === "ALL") {
            // Handle "GET ALL" - collect all getable items first, then show combined message
            const takenItems = [];
            const cantTakeItems = [];
            
            // Process all items once
            let foundItem = true;
            while (foundItem) {
                foundItem = false;
                const locationItems = this.adventure.player.getLocation().getItems();
                
                for (const anItem of locationItems) {
                    if (anItem.isGetable() === true) {
                        this.adventure.player.getLocation().removeItem(anItem);
                        this.adventure.player.addItem(anItem);
                        // Format item name for natural language (strip article for "the red key" format)
                        const itemName = TextUtils.formatAfterThe(anItem.getKeyword());
                        takenItems.push("the " + itemName);
                        items = true;
                        foundItem = true; // Found a getable item, restart to get fresh item list
                        break;
                    }
                }
            }
            
            // Collect non-getable visible items for error messages
            const remainingItems = this.adventure.player.getLocation().getItems();
            for (const anItem of remainingItems) {
                if (anItem.isGetable() === false && !anItem.isInvisible()) {
                    const itemName = TextUtils.formatAfterThe(anItem.getKeyword());
                    cantTakeItems.push("the " + itemName);
                }
            }
            
            // Show combined messages
            if (takenItems.length > 0) {
                if (takenItems.length === 1) {
                    this.adventure.desc.value += "You take " + takenItems[0] + ".\n";
                } else {
                    const itemList = TextUtils.formatItemList(takenItems);
                    this.adventure.desc.value += "You take " + itemList + ".\n";
                }
            }
            
            if (cantTakeItems.length > 0) {
                if (cantTakeItems.length === 1) {
                    this.adventure.desc.value += "You can't take " + cantTakeItems[0] + ".\n";
                } else {
                    const itemList = TextUtils.formatItemList(cantTakeItems);
                    this.adventure.desc.value += "You can't take " + itemList + ".\n";
                }
            }
        } else if (fullNoun || noun) {
            // Handle specific item with smart matching
            const searchTerm = fullNoun || noun;
            const locationItems = this.adventure.player.getLocation().getItems();
            console.log(`ItemHandler: Looking for "${searchTerm}" among ${locationItems.length} location items using smart matching`);
            
            // Try smart matching first
            const matchResult = this.itemMatcher.findBestMatch(searchTerm, locationItems);
            
            // Check if disambiguation is needed
            const disambigResult = this.itemMatcher.handleDisambiguation(matchResult.matches, searchTerm);
            
            if (disambigResult.needsDisambiguation) {
                this.adventure.desc.value += disambigResult.message + "\n";
                items = true; // Mark as handled
            } else if (disambigResult.selectedItem) {
                console.log(`ItemHandler: Smart match found "${disambigResult.selectedItem.getKeyword()}" with confidence ${matchResult.confidence}`);
                const anItem = disambigResult.selectedItem;
                
                if (anItem.isGetable() === true) {
                    this.adventure.player.getLocation().removeItem(anItem);
                    this.adventure.player.addItem(anItem);
                    // Format for natural language: "You take the red key."
                    const itemName = TextUtils.formatAfterThe(anItem.getKeyword());
                    this.adventure.desc.value += "You take the " + itemName + ".\n";
                    console.log(`ItemHandler: Successfully took "${anItem.getKeyword()}"`);
                    items = true;
                } else {
                    // Use TextUtils to handle grammar properly (avoid "the a key" constructions)
                    const itemName = TextUtils.formatAfterThe(anItem.getKeyword());
                    this.adventure.desc.value += "You can't take the " + itemName + ".\n";
                    console.log(`ItemHandler: Item "${anItem.getKeyword()}" is not getable`);
                    items = true;
                }
            }
        }
        
        if (!items) {
            this.adventure.desc.value += "I don't see that around here.\n";
        }
        
        return { success: true, moved: false };
    }

    /**
     * Handle DROP command
     * @param {string} noun - The item to drop (for backward compatibility)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {Object} Result object
     */
    handleDrop(noun, parseResult) {
        const fullNoun = parseResult && parseResult.getFullNoun ? parseResult.getFullNoun() : noun;
        console.log(`ItemHandler: handleDrop called with noun: "${noun}", fullNoun: "${fullNoun}"`);
        let items = false;
        
        if (noun && noun.toUpperCase() === "ALL") {
            // Handle "DROP ALL" - collect all items first, then show combined message
            const playerItems = [...this.adventure.player.getItems()]; // Create copy to avoid modification during iteration
            const droppedItems = [];
            
            for (const anItem of playerItems) {
                this.adventure.player.removeItem(anItem);
                this.adventure.player.getLocation().addItem(anItem);
                // Format item name for natural language (strip article for "the red key" format)
                const itemName = TextUtils.formatAfterThe(anItem.getKeyword());
                droppedItems.push("the " + itemName);
                items = true;
            }
            
            // Show combined message
            if (droppedItems.length > 0) {
                if (droppedItems.length === 1) {
                    this.adventure.desc.value += "You drop " + droppedItems[0] + ".\n";
                } else {
                    const itemList = TextUtils.formatItemList(droppedItems);
                    this.adventure.desc.value += "You drop " + itemList + ".\n";
                }
            }
        } else if (fullNoun || noun) {
            // Handle specific item with smart matching
            const searchTerm = fullNoun || noun;
            const playerItems = this.adventure.player.getItems();
            console.log(`ItemHandler: Looking for "${searchTerm}" among ${playerItems.length} player items using smart matching`);
            
            // Try smart matching first
            const matchResult = this.itemMatcher.findBestMatch(searchTerm, playerItems);
            
            // Check if disambiguation is needed
            const disambigResult = this.itemMatcher.handleDisambiguation(matchResult.matches, searchTerm);
            
            if (disambigResult.needsDisambiguation) {
                this.adventure.desc.value += disambigResult.message + "\n";
                items = true; // Mark as handled
            } else if (disambigResult.selectedItem) {
                console.log(`ItemHandler: Smart match found "${disambigResult.selectedItem.getKeyword()}" with confidence ${matchResult.confidence}`);
                const anItem = disambigResult.selectedItem;
                
                this.adventure.player.removeItem(anItem);
                this.adventure.player.getLocation().addItem(anItem);
                // Format for natural language: "You drop the red key."
                const itemName = TextUtils.formatAfterThe(anItem.getKeyword());
                this.adventure.desc.value += "You drop the " + itemName + ".\n";
                console.log(`ItemHandler: Successfully dropped "${anItem.getKeyword()}"`);
                items = true;
            }
        }
        
        if (!items) {
            this.adventure.desc.value += "You're not carrying that.\n";
        }
        
        return { success: true, moved: false };
    }
}

// Make ItemHandler available globally
window.ItemHandler = ItemHandler;