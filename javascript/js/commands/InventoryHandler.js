/**
 * InventoryHandler - Handles INVENTORY command
 * Shows player's carried items with proper formatting
 */
class InventoryHandler {
    constructor(adventure) {
        this.adventure = adventure;
    }

    /**
     * Check if this handler can process the given command
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {boolean} True if this handler can process the command
     */
    canHandle(verb, noun, parseResult) {
        return verb && verb.toUpperCase() === "INVENTORY";
    }

    /**
     * Handle the INVENTORY command
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {Object} Result object with success flag and any location changes
     */
    handle(verb, noun, parseResult) {
        this.adventure.desc.value += "You are carrying ";
        let items = false;
        const playerItems = this.adventure.player.getItems();
        
        for (let i = 0; i < playerItems.length; i++) {
            const anItem = playerItems[i];
            if (items === true && i === playerItems.length - 1) {
                this.adventure.desc.value += "and ";
            }
            this.adventure.desc.value += anItem.getName();
            items = true;
            if (i < playerItems.length - 1) {
                this.adventure.desc.value += ", ";
            } else {
                this.adventure.desc.value += ".\n";
            }
        }
        
        if (!items) {
            this.adventure.desc.value += "nothing.\n";
        }
        
        return { success: true, moved: false };
    }
}

// Make InventoryHandler available globally
window.InventoryHandler = InventoryHandler;