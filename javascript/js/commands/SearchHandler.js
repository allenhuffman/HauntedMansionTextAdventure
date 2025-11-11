/**
 * SearchHandler - Handles SEARCH command
 * Manages special item interactions and search functionality
 */
class SearchHandler {
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
        return verb && verb.toUpperCase() === "SEARCH" && noun;
    }

    /**
     * Handle SEARCH command
     * @param {string} verb - The command verb
     * @param {string} noun - The item to search
     * @returns {Object} Result object with success flag and any location changes
     */
    handle(verb, noun) {
        // SEARCH is typically handled by ActionItems with custom actions
        // This handler provides a fallback for when no ActionItem handles it
        
        const currentRoomId = this.adventure.player.getLocation().getId ? 
                             this.adventure.player.getLocation().getId() : 1;
        
        // First check for ActionItem actions in player inventory
        const playerItems = this.adventure.player.getItems();
        for (const anItem of playerItems) {
            if (anItem.isSpecial() && anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                const result = anItem.executeAction(verb, currentRoomId, this.adventure.world, playerItems);
                if (result && result.success) {
                    this.adventure.desc.value += result.message + "\n";
                    
                    // Handle location change
                    if (result.newLocation) {
                        const newLoc = this.adventure.player.locations[result.newLocation];
                        if (newLoc) {
                            this.adventure.player.setLocation(newLoc);
                            return { success: true, moved: true };
                        }
                    }
                    
                    return { success: true, moved: false };
                }
            }
        }
        
        // Check location items for ActionItems
        const locationItems = this.adventure.player.getLocation().getItems();
        for (const anItem of locationItems) {
            if (anItem.isSpecial() && anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                const result = anItem.executeAction(verb, currentRoomId, this.adventure.world, locationItems);
                if (result && result.success) {
                    this.adventure.desc.value += result.message + "\n";
                    
                    // Handle location change
                    if (result.newLocation) {
                        const newLoc = this.adventure.player.locations[result.newLocation];
                        if (newLoc) {
                            this.adventure.player.setLocation(newLoc);
                            return { success: true, moved: true };
                        }
                    }
                    
                    return { success: true, moved: false };
                }
            }
        }
        
        // Fallback: if no ActionItem handled it, provide generic search behavior
        let itemFound = false;
        
        // Check if the item exists (in inventory or location)
        for (const anItem of playerItems) {
            if (anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                this.adventure.desc.value += "You search the " + anItem.getName() + " but find nothing special.\n";
                itemFound = true;
                break;
            }
        }
        
        if (!itemFound) {
            for (const anItem of locationItems) {
                if (anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                    this.adventure.desc.value += "You search the " + anItem.getName() + " but find nothing special.\n";
                    itemFound = true;
                    break;
                }
            }
        }
        
        if (!itemFound) {
            this.adventure.desc.value += "I don't see that around here to search.\n";
        }
        
        return { success: true, moved: false };
    }
}

// Make SearchHandler available globally
window.SearchHandler = SearchHandler;