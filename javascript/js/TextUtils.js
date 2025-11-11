/**
 * TextUtils - Shared utility functions for text formatting
 * 
 * Provides consistent text formatting across the game, particularly for lists.
 */
class TextUtils {
    /**
     * Format a list of items in natural language style
     * @param {Array} items - Array of item names/strings
     * @returns {string} Formatted list (e.g., "a red key, a blue key, and an old rusty key")
     */
    static formatItemList(items) {
        if (!items || items.length === 0) {
            return "";
        }
        
        if (items.length === 1) {
            return items[0];
        }
        
        if (items.length === 2) {
            return `${items[0]} and ${items[1]}`;
        }
        
        // For 3 or more items: "item1, item2, and item3"
        const allButLast = items.slice(0, -1).join(', ');
        const lastItem = items[items.length - 1];
        return `${allButLast}, and ${lastItem}`;
    }

    /**
     * Format a list with custom conjunction
     * @param {Array} items - Array of strings to format
     * @param {string} conjunction - Word to use before last item (default: "and")
     * @returns {string} Formatted list
     */
    static formatList(items, conjunction = "and") {
        if (!items || items.length === 0) {
            return "";
        }
        
        if (items.length === 1) {
            return items[0];
        }
        
        if (items.length === 2) {
            return `${items[0]} ${conjunction} ${items[1]}`;
        }
        
        // For 3 or more items: "item1, item2, and item3"
        const allButLast = items.slice(0, -1).join(', ');
        const lastItem = items[items.length - 1];
        return `${allButLast}, ${conjunction} ${lastItem}`;
    }
}

// Make available globally
window.TextUtils = TextUtils;