/**
 * ItemHandler - Handles GET/TAKE and DROP commands
 * Manages item pickup and drop mechanics with location transfer
 */
class ItemHandler {
    constructor(adventure) {
        this.adventure = adventure;
    }

    /**
     * Check if this handler can process the given command
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @returns {boolean} True if this handler can process the command
     */
    canHandle(verb, noun) {
        if (!verb) return false;
        const upperVerb = verb.toUpperCase();
        return upperVerb === "GET" || upperVerb === "TAKE" || upperVerb === "DROP";
    }

    /**
     * Handle GET/TAKE and DROP commands
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @returns {Object} Result object with success flag and any location changes
     */
    handle(verb, noun) {
        const upperVerb = verb.toUpperCase();
        
        if (upperVerb === "GET" || upperVerb === "TAKE") {
            return this.handleGet(noun);
        } else if (upperVerb === "DROP") {
            return this.handleDrop(noun);
        }
        
        return { success: false, moved: false };
    }

    /**
     * Handle GET/TAKE command
     * @param {string} noun - The item to get
     * @returns {Object} Result object
     */
    handleGet(noun) {
        console.log(`ItemHandler: handleGet called with noun: "${noun}"`);
        let items = false;
        
        if (noun && noun.toUpperCase() === "ALL") {
            // Handle "GET ALL" - process all items once, restart only when item is taken
            let foundItem = true;
            while (foundItem) {
                foundItem = false;
                const locationItems = this.adventure.player.getLocation().getItems();
                
                for (const anItem of locationItems) {
                    if (anItem.isGetable() === true) {
                        this.adventure.player.getLocation().removeItem(anItem);
                        this.adventure.player.addItem(anItem);
                        this.adventure.desc.value += anItem.getKeyword() + " taken.\n";
                        items = true;
                        foundItem = true; // Found a getable item, restart to get fresh item list
                        break;
                    }
                }
            }
            // Now handle non-getable items (only show message once each)
            const remainingItems = this.adventure.player.getLocation().getItems();
            for (const anItem of remainingItems) {
                if (anItem.isGetable() === false) {
                    this.adventure.desc.value += "You can't take the " + anItem.getKeyword() + ".\n";
                }
            }
        } else if (noun) {
            // Handle specific item
            const locationItems = this.adventure.player.getLocation().getItems();
            console.log(`ItemHandler: Looking for "${noun}" among ${locationItems.length} location items`);
            
            for (const anItem of locationItems) {
                console.log(`ItemHandler: Checking item "${anItem.getKeyword()}" (getable: ${anItem.isGetable()})`);
                if (anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                    console.log(`ItemHandler: Found matching item "${anItem.getKeyword()}"`);
                    if (anItem.isGetable() === true) {
                        this.adventure.player.getLocation().removeItem(anItem);
                        this.adventure.player.addItem(anItem);
                        this.adventure.desc.value += anItem.getKeyword() + " taken.\n";
                        console.log(`ItemHandler: Successfully took "${anItem.getKeyword()}"`);
                        items = true;
                        break;
                    } else {
                        this.adventure.desc.value += "You can't take the " + anItem.getKeyword() + ".\n";
                        console.log(`ItemHandler: Item "${anItem.getKeyword()}" is not getable`);
                        items = true;
                        break;
                    }
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
     * @param {string} noun - The item to drop
     * @returns {Object} Result object
     */
    handleDrop(noun) {
        let items = false;
        
        if (noun && noun.toUpperCase() === "ALL") {
            // Handle "DROP ALL"
            const playerItems = [...this.adventure.player.getItems()]; // Create copy to iterate
            for (const anItem of playerItems) {
                this.adventure.player.removeItem(anItem);
                this.adventure.player.getLocation().addItem(anItem);
                this.adventure.desc.value += anItem.getKeyword() + " dropped.\n";
                items = true;
            }
        } else if (noun) {
            // Handle specific item
            const playerItems = this.adventure.player.getItems();
            for (const anItem of playerItems) {
                if (anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                    this.adventure.player.removeItem(anItem);
                    this.adventure.player.getLocation().addItem(anItem);
                    this.adventure.desc.value += anItem.getKeyword() + " dropped.\n";
                    items = true;
                    break;
                }
            }
        }
        
        if (!items) {
            this.adventure.desc.value += "You aren't carrying that.\n";
        }
        
        return { success: true, moved: false };
    }
}

// Make ItemHandler available globally
window.ItemHandler = ItemHandler;