/**
 * SearchHandler - Handles SEARCH command
 * Manages special item interactions and search functionality
 */
class SearchHandler {
    constructor(adventure) {
        this.adventure = adventure;
        this.centralMatcher = new CentralMatcher(adventure);
    }

    /**
     * Check if this handler can process the given command
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {boolean} True if this handler can process the command
     */
    canHandle(verb, noun, parseResult) {
        return verb && verb.toUpperCase() === "SEARCH";
    }

    /**
     * Handle SEARCH command
     * @param {string} verb - The command verb
     * @param {string} noun - The item to search (for backward compatibility)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {Object} Result object with success flag and any location changes
     */
    handle(verb, noun, parseResult) {
        // Check if no noun was provided
        if (!noun && (!parseResult || !parseResult.getFullNoun())) {
            this.adventure.desc.value += "You need to search something specific.\n";
            return { success: true, moved: false };
        }
        
        // For SEARCH commands, use full noun phrase from parseResult if available
        const searchTerm = (parseResult && parseResult.getFullNoun()) ? parseResult.getFullNoun() : noun;
        
        // Don't allow searching "all" - require specific targets
        if (searchTerm.toLowerCase() === "all" || searchTerm.toLowerCase() === "everything") {
            this.adventure.desc.value += "You need to search something specific, not everything at once.\n";
            return { success: true, moved: false };
        }
        
        // SEARCH is typically handled by ActionItems with custom actions
        // This handler provides a fallback for when no ActionItem handles it
        
        const currentRoomId = this.adventure.player.getLocation().getId ? 
                             this.adventure.player.getLocation().getId() : 1;
        
        // Get all items from player inventory and location
        const playerItems = this.adventure.player.getItems();
        const locationItems = this.adventure.player.getLocation().getItems();
        
        // First check for ActionItem actions in player inventory using smart matching
        const playerActionItems = playerItems.filter(item => item.isSpecial && item.isSpecial());
        if (playerActionItems.length > 0) {
            const playerMatch = this.itemMatcher.findBestMatch(searchTerm, playerActionItems);
            if (playerMatch.item) {
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
        }
        
        // Check location items for ActionItems using smart matching
        const locationActionItems = locationItems.filter(item => item.isSpecial && item.isSpecial());
        if (locationActionItems.length > 0) {
            const locationMatch = this.itemMatcher.findBestMatch(searchTerm, locationActionItems);
            if (locationMatch.item) {
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
                    
                    return { success: true, moved: false };
                }
            }
        }
        
        // Fallback: if no ActionItem handled it, provide generic search behavior using CentralMatcher
        const matchResult = this.centralMatcher.findItem(searchTerm);
        
        // Debug logging can be enabled here if needed
        // console.log(`SearchHandler: searchTerm="${searchTerm}", success=${matchResult.success}, needsDisambiguation=${matchResult.needsDisambiguation}`);
        
        if (matchResult.needsDisambiguation) {
            this.adventure.desc.value += matchResult.message + "\n";
        } else if (matchResult.success && matchResult.item) {
            this.adventure.desc.value += "You search the " + matchResult.item.getName() + " but find nothing special.\n";
        } else {
            this.adventure.desc.value += matchResult.message || "I don't see that around here to search.\n";
        }
        
        return { success: true, moved: false };
    }
}

// Make SearchHandler available globally
window.SearchHandler = SearchHandler;