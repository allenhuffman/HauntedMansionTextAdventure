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

    /**
     * Strip leading articles from text for better grammar
     * Removes "a ", "an ", "the ", "some " from the beginning of text
     * @param {string} text - Text to process
     * @returns {string} Text without leading article
     */
    static stripArticle(text) {
        if (!text || typeof text !== 'string') {
            return text;
        }
        
        // Remove leading articles (case insensitive)
        return text.replace(/^(a|an|the|some)\s+/i, '');
    }

    /**
     * Format text for use after "the" - strips leading articles to avoid double articles
     * Example: "a red key" becomes "red key" so "the a red key" becomes "the red key"
     * @param {string} text - Text to format
     * @returns {string} Text suitable for use after "the"
     */
    static formatAfterThe(text) {
        return this.stripArticle(text);
    }

    /**
     * Format a list for negative contexts (uses "or" instead of "and")
     * @param {Array} items - Array of item names/strings
     * @returns {string} Formatted list (e.g., "the red key, the blue key, or the old rusty key")
     */
    static formatNegativeList(items) {
        if (!items || items.length === 0) {
            return "";
        }
        
        if (items.length === 1) {
            return items[0];
        }
        
        if (items.length === 2) {
            return `${items[0]} or ${items[1]}`;
        }
        
        // For 3 or more items: "item1, item2, or item3"
        const allButLast = items.slice(0, -1).join(', ');
        const lastItem = items[items.length - 1];
        return `${allButLast}, or ${lastItem}`;
    }
}

// Make available globally
window.TextUtils = TextUtils;