/**
 * ExamineHandler - Handles LOOK/EXAMINE commands
 * Manages room descriptions, item examination, and ActionItem interactions
 */
class ExamineHandler {
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
        return upperVerb === "LOOK" || upperVerb === "EXAMINE";
    }

    /**
     * Handle LOOK/EXAMINE commands
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @returns {Object} Result object with success flag and any location changes
     */
    handle(verb, noun) {
        if (noun === null) {
            // Just looking at the room
            this.adventure.player.getLocation().beenHere(false); // Force room redisplay
            this.adventure.showLocation();
            return { success: true, moved: true }; // moved=true to trigger location display
        } else {
            // Looking at something specific
            return this.examineItem(verb, noun);
        }
    }

    /**
     * Examine a specific item
     * @param {string} verb - The command verb
     * @param {string} noun - The item to examine
     * @returns {Object} Result object
     */
    examineItem(verb, noun) {
        // First check for ActionItem actions (EXAMINE/LOOK with custom actions)
        let actionHandled = false;
        const currentRoomId = this.adventure.player.getLocation().getId ? 
                             this.adventure.player.getLocation().getId() : 1;
        
        // Check player inventory for ActionItems
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
        if (!actionHandled) {
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
                        
                        actionHandled = true;
                        break;
                    }
                }
            }
        }
        
        // If no ActionItem handled it, check for regular items
        if (!actionHandled) {
            let items = false;
            
            // Check player inventory first
            for (const anItem of playerItems) {
                if (anItem.getKeyword().toUpperCase() === noun.toUpperCase()) {
                    this.adventure.desc.value += anItem.getDescription() + "\n";
                    items = true;
                    break;
                }
            }
            
            // Check location items if not found in inventory
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
            
            if (!items) {
                this.adventure.desc.value += "I don't see that around here.\n";
            }
        }
        
        return { success: true, moved: false };
    }
}

// Make ExamineHandler available globally
window.ExamineHandler = ExamineHandler;