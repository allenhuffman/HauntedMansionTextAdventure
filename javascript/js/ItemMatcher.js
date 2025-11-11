/**
 * ItemMatcher - Smart item matching utility for parsing commands
 * 
 * Handles sophisticated item matching based on keywords, names, and partial matches.
 * Supports disambiguation when multiple items match the same input.
 */
class ItemMatcher {
    constructor() {
        // No constructor needed - utility class
    }

    /**
     * Find the best matching item from a collection based on user input
     * @param {string} input - User input to match against
     * @param {Array} items - Array of items to search through
     * @returns {Object} - Match result with item and confidence score
     */
    findBestMatch(input, items) {
        if (!input || !items || items.length === 0) {
            return { item: null, matches: [], confidence: 0 };
        }

        const inputLower = input.toLowerCase().trim();
        
        // Try reverse-matching strategy first: work backwards from the full input
        const reverseMatch = this.findBestMatchReverse(inputLower, items);
        if (reverseMatch.confidence >= 90) { // High confidence reverse match
            console.log(`ItemMatcher: Reverse match found with confidence ${reverseMatch.confidence}`);
            return reverseMatch;
        }

        // Fallback to original matching if no high-confidence reverse match
        const matches = [];

        for (const item of items) {
            const matchScore = this.calculateMatchScore(inputLower, item);
            if (matchScore > 0) {
                matches.push({
                    item: item,
                    score: matchScore,
                    matchType: this.getMatchType(inputLower, item)
                });
            }
        }

        // Sort by score (highest first)
        matches.sort((a, b) => b.score - a.score);

        return {
            item: matches.length > 0 ? matches[0].item : null,
            matches: matches,
            confidence: matches.length > 0 ? matches[0].score : 0
        };
    }

    /**
     * Reverse-matching strategy: try progressively longer phrases from the end
     * "get the blue key from table" -> try "key", then "blue key", then "the blue key", etc.
     * @param {string} input - Lowercase user input
     * @param {Array} items - Array of items to search
     * @returns {Object} Best match result
     */
    findBestMatchReverse(input, items) {
        const words = input.split(' ').filter(word => word.length > 0);
        
        // Try each suffix of the input, starting from the end
        for (let i = words.length - 1; i >= 0; i--) {
            const suffix = words.slice(i).join(' ');
            console.log(`ItemMatcher: Trying reverse match with "${suffix}"`);
            
            // Find exact or very close matches for this suffix
            const matches = [];
            for (const item of items) {
                const score = this.calculateMatchScore(suffix, item);
                if (score >= 90) { // Only consider high-confidence matches
                    matches.push({
                        item: item,
                        score: score,
                        matchType: this.getMatchType(suffix, item)
                    });
                }
            }
            
            if (matches.length === 1) {
                // Found exactly one high-confidence match - return it immediately
                console.log(`ItemMatcher: Single reverse match found for "${suffix}": "${matches[0].item.getName()}"`);
                return {
                    item: matches[0].item,
                    matches: matches,
                    confidence: matches[0].score
                };
            } else if (matches.length > 1) {
                // Multiple high-confidence matches - continue to next shorter phrase
                console.log(`ItemMatcher: Multiple reverse matches for "${suffix}" (${matches.length}), trying shorter phrase`);
                continue;
            }
            // No high-confidence matches for this suffix, try next shorter phrase
        }
        
        // No good reverse matches found
        return { item: null, matches: [], confidence: 0 };
    }

    /**
     * Calculate how well the input matches the item
     * @param {string} input - Lowercase user input
     * @param {Object} item - Item object with name as primary identifier
     * @returns {number} - Match score (0 = no match, higher = better match)
     */
    calculateMatchScore(input, item) {
        const name = item.getName().toLowerCase();
        
        // Remove articles from name for better matching
        const nameClean = this.removeArticles(name);
        
        let score = 0;

        // Exact name match (highest priority)
        if (input === name || input === nameClean) {
            score += 100;
        }
        
        // Name starts with input
        else if (name.startsWith(input) || nameClean.startsWith(input)) {
            score += 90;
        }
        
        // Input starts with name (partial input matching full name)
        else if (input.startsWith(name) || input.startsWith(nameClean)) {
            score += 85;
        }
        
        // Input matches end of name (for "blue book" matching "book")
        else if (name.endsWith(input) || nameClean.endsWith(input)) {
            score += 80;
        }
        
        // Name contains input
        else if (name.includes(input) || nameClean.includes(input)) {
            score += 70;
        }

        // Multi-word matching for phrases like "blue book"
        const inputWords = input.split(' ');
        const nameWords = nameClean.split(' ');
        
        if (inputWords.length > 1 && this.matchesWordSequence(inputWords, nameWords)) {
            score += 85;
        }
        
        // Partial word matching bonus
        const partialMatches = this.countPartialMatches(inputWords, nameWords.concat(item.getKeyword().toLowerCase().split(' ')));
        score += partialMatches * 10;

        return score;
    }

    /**
     * Remove common articles from text for cleaner matching
     * @param {string} text - Text to clean
     * @returns {string} - Text with articles removed
     */
    removeArticles(text) {
        return text.replace(/^(a|an|the|some)\s+/i, '').trim();
    }

    /**
     * Check if input words match a sequence in target words
     * @param {Array} inputWords - Words from user input
     * @param {Array} targetWords - Words from item name
     * @returns {boolean} - True if sequence matches
     */
    matchesWordSequence(inputWords, targetWords) {
        for (let i = 0; i <= targetWords.length - inputWords.length; i++) {
            let matches = true;
            for (let j = 0; j < inputWords.length; j++) {
                if (targetWords[i + j] !== inputWords[j]) {
                    matches = false;
                    break;
                }
            }
            if (matches) {
                return true;
            }
        }
        return false;
    }

    /**
     * Count how many input words partially match target words
     * @param {Array} inputWords - Words from user input
     * @param {Array} targetWords - Words from item
     * @returns {number} - Number of partial matches
     */
    countPartialMatches(inputWords, targetWords) {
        let count = 0;
        for (const inputWord of inputWords) {
            for (const targetWord of targetWords) {
                if (targetWord.includes(inputWord) || inputWord.includes(targetWord)) {
                    count++;
                    break; // Count each input word only once
                }
            }
        }
        return count;
    }

    /**
     * Determine the type of match for debugging
     * @param {string} input - User input
     * @param {Object} item - Matched item
     * @returns {string} - Match type description
     */
    getMatchType(input, item) {
        const name = item.getName().toLowerCase();
        const nameClean = this.removeArticles(name);

        if (input === name || input === nameClean) return 'exact_name';
        if (name.startsWith(input) || nameClean.startsWith(input)) return 'name_prefix';
        if (name.endsWith(input) || nameClean.endsWith(input)) return 'name_suffix';
        if (name.includes(input) || nameClean.includes(input)) return 'name_contains';
        
        const inputWords = input.split(' ');
        const nameWords = nameClean.split(' ');
        if (inputWords.length > 1 && this.matchesWordSequence(inputWords, nameWords)) {
            return 'word_sequence';
        }
        
        return 'partial';
    }

    /**
     * Handle disambiguation when multiple items match
     * @param {Array} matches - Array of match objects
     * @param {string} input - Original user input
     * @returns {Object} - Disambiguation result
     */
    handleDisambiguation(matches, input) {
        if (matches.length <= 1) {
            return {
                needsDisambiguation: false,
                selectedItem: matches.length > 0 ? matches[0].item : null,
                message: null
            };
        }

        // If there's a clear winner (significantly higher score), use it
        const topScore = matches[0].score;
        const secondScore = matches.length > 1 ? matches[1].score : 0;
        
        if (topScore > secondScore + 20) { // 20 point threshold for clear winner
            return {
                needsDisambiguation: false,
                selectedItem: matches[0].item,
                message: null
            };
        }

        // Need disambiguation - format like room object list
        const candidateItems = matches.slice(0, 5).map(match => match.item.getName());
        const itemList = TextUtils.formatItemList(candidateItems);
        const message = `Please be more specific. I see ${itemList}.`;

        return {
            needsDisambiguation: true,
            selectedItem: null,
            message: message,
            candidates: matches.slice(0, 5)
        };
    }

    /**
     * Find item by exact name (for backward compatibility)
     * @param {string} name - Exact name to match
     * @param {Array} items - Items to search
     * @returns {Object|null} - Matching item or null
     */
    findByKeyword(name, items) {
        if (!name || !items) return null;
        
        const nameUpper = name.toUpperCase();
        for (const item of items) {
            if (item.getName().toUpperCase() === nameUpper) {
                return item;
            }
        }
        return null;
    }


}

// Make available globally
window.ItemMatcher = ItemMatcher;