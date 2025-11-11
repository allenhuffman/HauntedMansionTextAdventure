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
        return upperVerb === "LOOK" || upperVerb === "EXAMINE";
    }

    /**
     * Handle LOOK/EXAMINE commands
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {Object} Result object with success flag and any location changes
     */
    handle(verb, noun, parseResult) {
        if (noun === null) {
            // Just looking at the room
            this.adventure.player.getLocation().beenHere(false); // Force room redisplay
            this.adventure.showLocation();
            return { success: true, moved: true }; // moved=true to trigger location display
        } else {
            // Looking at something specific
            return this.examineItem(verb, noun, parseResult);
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
        const fullNoun = parseResult && parseResult.getFullNoun ? parseResult.getFullNoun() : noun;
        const searchTerm = fullNoun || noun;
        
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
        
        // Check location items for ActionItems with smart matching
        if (!actionHandled) {
            const locationItems = this.adventure.player.getLocation().getItems();
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
                this.adventure.desc.value += disambigResult.selectedItem.getDescription() + "\n";
                items = true;
            } else {
                // Fallback to exact matching for backward compatibility
                for (const anItem of playerItems) {
                    if (anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                        this.adventure.desc.value += anItem.getDescription() + "\n";
                        items = true;
                        break;
                    }
                }
                
                if (!items) {
                    const locationItems = this.adventure.player.getLocation().getItems();
                    for (const anItem of locationItems) {
                        if (anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                            this.adventure.desc.value += anItem.getDescription() + "\n";
                            items = true;
                            break;
                        }
                    }
                }
            }
            
            if (!items) {
                this.adventure.desc.value += "I don't see that around here.\n";
            }
        }
        
        return { success: true, moved: false };
    }
}

// Make ExamineHandler available globally
window.ExamineHandler = ExamineHandler;