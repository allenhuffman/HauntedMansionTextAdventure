/**
 * CentralMatcher - Centralized item matching utility
 * 
 * Provides a single entry point for all item matching operations
 * Handles the common pattern of searching through inventory + room items
 */
class CentralMatcher {
    constructor(adventure) {
        this.adventure = adventure;
        this.itemMatcher = new ItemMatcher();
    }

    /**
     * Find the best matching item from player inventory and current room
     * @param {string} noun - The noun to match against
     * @param {Object} options - Optional configuration
     * @param {boolean} options.inventoryOnly - Only search inventory
     * @param {boolean} options.roomOnly - Only search current room
     * @param {Array} options.additionalItems - Extra items to include in search
     * @returns {Object} - Match result with disambiguation info
     */
    findItem(noun, options = {}) {
        if (!noun) {
            return {
                success: false,
                item: null,
                needsDisambiguation: false,
                message: "You need to specify what you're looking for.",
                matches: []
            };
        }

        // Gather items based on options
        let searchItems = [];
        
        if (!options.roomOnly) {
            // Include player inventory
            const playerItems = this.adventure.player.getItems();
            searchItems = searchItems.concat(playerItems);
        }
        
        if (!options.inventoryOnly) {
            // Include current room items
            const locationItems = this.adventure.player.getLocation().getItems();
            searchItems = searchItems.concat(locationItems);
        }
        
        // Add any additional items specified
        if (options.additionalItems && Array.isArray(options.additionalItems)) {
            searchItems = searchItems.concat(options.additionalItems);
        }

        // Use ItemMatcher to find best match
        const itemMatch = this.itemMatcher.findBestMatch(noun, searchItems);
        
        // Handle high-confidence single matches directly
        if (itemMatch.item && itemMatch.confidence >= 90 && itemMatch.matches && itemMatch.matches.length === 1) {
            return {
                success: true,
                item: itemMatch.item,
                needsDisambiguation: false,
                message: null,
                matches: itemMatch.matches,
                confidence: itemMatch.confidence
            };
        }
        
        // Handle disambiguation for multiple or lower-confidence matches
        const disambigResult = this.itemMatcher.handleDisambiguation(itemMatch.matches, noun);
        
        return {
            success: !disambigResult.needsDisambiguation,
            item: disambigResult.selectedItem,
            needsDisambiguation: disambigResult.needsDisambiguation,
            message: disambigResult.message,
            matches: itemMatch.matches,
            confidence: itemMatch.confidence,
            candidates: disambigResult.candidates
        };
    }

    /**
     * Find item in player inventory only
     * @param {string} noun - The noun to match against
     * @returns {Object} - Match result
     */
    findInInventory(noun) {
        return this.findItem(noun, { inventoryOnly: true });
    }

    /**
     * Find item in current room only
     * @param {string} noun - The noun to match against
     * @returns {Object} - Match result
     */
    findInRoom(noun) {
        return this.findItem(noun, { roomOnly: true });
    }

    /**
     * Find item with ActionItem capabilities (special items)
     * @param {string} noun - The noun to match against
     * @param {Object} options - Search options
     * @returns {Object} - Match result with ActionItem filtering
     */
    findActionItem(noun, options = {}) {
        const result = this.findItem(noun, options);
        
        if (result.success && result.item) {
            // Check if the found item is an ActionItem
            if (result.item.isSpecial && result.item.isSpecial()) {
                return result;
            } else {
                return {
                    success: false,
                    item: null,
                    needsDisambiguation: false,
                    message: `The ${result.item.getName()} can't be used that way.`,
                    matches: []
                };
            }
        }
        
        return result;
    }

    /**
     * Check if a specific item name exists in the available items
     * @param {string} itemName - Exact item name to look for
     * @param {Object} options - Search options
     * @returns {Object|null} - The item if found, null otherwise
     */
    findExactItem(itemName, options = {}) {
        const itemList = [];
        
        if (!options.roomOnly) {
            itemList.push(...this.adventure.player.getItems());
        }
        
        if (!options.inventoryOnly) {
            itemList.push(...this.adventure.player.getLocation().getItems());
        }
        
        const itemNameLower = itemName.toLowerCase();
        for (const item of itemList) {
            if (item.getName().toLowerCase() === itemNameLower) {
                return item;
            }
        }
        
        return null;
    }
}

// Make available globally
window.CentralMatcher = CentralMatcher;