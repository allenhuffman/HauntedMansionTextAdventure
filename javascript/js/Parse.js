class Parse {
    constructor() {
        this.verb = null;
        this.noun = null;
        this.fullNoun = null; // Store the complete noun phrase
        this.originalInput = null;
    }

    parse(s) {
        this.verb = null;
        this.noun = null;
        this.fullNoun = null;
        this.originalInput = s.trim();
        
        // Split by whitespace and process tokens
        const tokens = s.trim().split(/\s+/);
        
        if (tokens.length === 0) {
            return;
        }
        
        // First token is always the verb
        this.verb = tokens[0];
        
        if (tokens.length === 1) {
            return; // No noun
        }
        
        // Everything after the verb is potentially part of the noun
        const nounTokens = tokens.slice(1);
        
        // Store the full noun phrase for smart matching
        this.fullNoun = nounTokens.join(' ');
        
        // Keep the last word as noun for backward compatibility
        this.noun = nounTokens[nounTokens.length - 1];
    }

    getNoun() {
        return this.noun;
    }

    getVerb() {
        return this.verb;
    }
    
    // New method for smart matching
    getFullNoun() {
        return this.fullNoun;
    }
    
    // Get all potential noun variations for matching
    getNounVariations() {
        if (!this.fullNoun) {
            return [];
        }
        
        const tokens = this.fullNoun.split(' ');
        const variations = [];
        
        // Add the full phrase
        variations.push(this.fullNoun);
        
        // Add individual words
        for (const token of tokens) {
            if (!variations.includes(token)) {
                variations.push(token);
            }
        }
        
        // Add combinations (for "blue book" -> ["blue book", "blue", "book"])
        for (let i = 0; i < tokens.length; i++) {
            for (let j = i + 1; j <= tokens.length; j++) {
                const combination = tokens.slice(i, j).join(' ');
                if (!variations.includes(combination)) {
                    variations.push(combination);
                }
            }
        }
        
        return variations;
    }
    
    getOriginalInput() {
        return this.originalInput;
    }
}