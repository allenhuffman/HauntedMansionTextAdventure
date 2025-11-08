class Parse {
    constructor() {
        this.verb = null;
        this.noun = null;
    }

    parse(s) {
        this.verb = null;
        this.noun = null;
        
        // Split by whitespace and process tokens
        const tokens = s.trim().split(/\s+/);
        
        for (let i = 0; i < tokens.length; i++) {
            const next = tokens[i];
            if (this.verb === null) {
                this.verb = next;
            } else {
                this.noun = next; // Keep overwriting - last word becomes noun (matches Java)
            }
        }
    }

    getNoun() {
        return this.noun;
    }

    getVerb() {
        return this.verb;
    }
}