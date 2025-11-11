/**
 * ExamineHandler - Handles LOOK/EXAMINE commands
 * Manages room descriptions, item examination, and ActionItem interactions
 */
class ExamineHandler {
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
        const canHandle = upperVerb === "LOOK" || upperVerb === "EXAMINE";
        console.log(`ExamineHandler: canHandle called with verb="${verb}", noun="${noun}", result=${canHandle}`);
        return canHandle;
    }

    /**
     * Handle LOOK/EXAMINE commands
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {Object} Result object with success flag and any location changes
     */
    handle(verb, noun, parseResult) {
        console.log(`ExamineHandler: handle called with verb="${verb}", noun="${noun}"`);
        if (noun === null) {
            // Just looking at the room
            this.adventure.player.getLocation().beenHere(false); // Force room redisplay
            return { success: true, moved: true }; // moved=true to trigger location display
        } else {
            // Looking at something specific
            console.log(`ExamineHandler: examining specific item "${noun}"`);
            const result = this.examineItem(verb, noun, parseResult);
            console.log(`ExamineHandler: examineItem returned:`, result);
            return result;
        }
    }

    /**
     * Examine a specific item
     * @param {string} verb - The command verb
     * @param {string} noun - The item to examine (for backward compatibility)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {Object} Result object
     */
    examineItem(verb, noun, parseResult) {
        // For LOOK/EXAMINE commands, use the simple noun rather than fullNoun to avoid 
        // matching issues with prepositions like "look at door" -> "at door"
        const searchTerm = noun;
        
        // First check for ActionItem actions (EXAMINE/LOOK with custom actions)
        let actionHandled = false;
        const currentRoomId = this.adventure.player.getLocation().getId ? 
                             this.adventure.player.getLocation().getId() : 1;
        
        // Check player inventory for ActionItems with smart matching
        const playerItems = this.adventure.player.getItems();
        const playerMatch = this.itemMatcher.findBestMatch(searchTerm, playerItems);
        
        if (playerMatch.item && playerMatch.item.isSpecial()) {
            const result = playerMatch.item.executeAction(verb, currentRoomId, this.adventure.world, playerItems);
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
        
        // Check location items for ActionItems with smart matching (include invisible items)
        if (!actionHandled) {
            const locationItems = this.adventure.player.getLocation().getItems(); // This includes invisible items
            const locationMatch = this.itemMatcher.findBestMatch(searchTerm, locationItems);
            
            if (locationMatch.item && locationMatch.item.isSpecial()) {
                const result = locationMatch.item.executeAction(verb, currentRoomId, this.adventure.world, locationItems);
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
                    
                    actionHandled = true;
                }
            }
        }
        
        // If no ActionItem handled it, check for regular items
        if (!actionHandled) {
            let items = false;
            
            // Combine all items for comprehensive matching
            const allItems = [...playerItems, ...this.adventure.player.getLocation().getItems()];
            const allItemsMatch = this.itemMatcher.findBestMatch(searchTerm, allItems);
            
            // Check if disambiguation is needed
            const disambigResult = this.itemMatcher.handleDisambiguation(allItemsMatch.matches, searchTerm);
            
            if (disambigResult.needsDisambiguation) {
                this.adventure.desc.value += disambigResult.message + "\n";
                items = true; // Mark as handled
            } else if (disambigResult.selectedItem) {
                const description = disambigResult.selectedItem.getDescription();
                const displayDescription = description && description.trim() !== '' ? description : "You see nothing special.";
                this.adventure.desc.value += displayDescription + "\n";
                items = true;
            }
            
            if (!items) {
                console.log(`ExamineHandler: Could not find item "${searchTerm}"`);
                console.log(`Available items:`, allItems.map(item => `"${item.getName()}" (invisible: ${item.invisible})`));
                this.adventure.desc.value += "I don't see that around here.\n";
            }
        }
        
        return { success: true, moved: false };
    }
}

// Make ExamineHandler available globally
window.ExamineHandler = ExamineHandler;