class CSVTokenizer {
    constructor(line) {
        this.source = line;
        this.currentPosition = 0;
        this.maxPosition = line.length;
    }

    /**
     * Find the position of the next comma.
     * If no comma exists, returns maxPosition.
     * If this is the last field, returns maxPosition.
     */
    nextComma(ind) {
        let inquote = false;
        while (ind < this.maxPosition) {
            const ch = this.source.charAt(ind);
            if (!inquote && ch === ',') {
                break;
            } else if (ch === '"') {
                inquote = !inquote; // Handle "" inside quotes
            }
            ind++;
        }
        return ind;
    }

    /**
     * Return the number of remaining tokens.
     */
    countTokens() {
        let i = 0;
        let ret = 1;
        while ((i = this.nextComma(i)) < this.maxPosition) {
            i++;
            ret++;
        }
        return ret;
    }

    /**
     * Return the next token string.
     */
    nextToken() {
        // ">=" would not correctly handle empty fields
        // When it's the last field (comma at end of line), an exception would occur
        // so we need to handle this case
        if (this.currentPosition > this.maxPosition) {
            throw new Error("No more tokens available");
        }

        const st = this.currentPosition;
        this.currentPosition = this.nextComma(this.currentPosition);

        let strb = "";
        let pos = st;
        while (pos < this.currentPosition) {
            const ch = this.source.charAt(pos++);
            if (ch === '"') {
                // If we see a quote, check if it's a double quote (escaped quote)
                if ((pos < this.currentPosition) && (this.source.charAt(pos) === '"')) {
                    strb += ch;
                    pos++;
                }
            } else {
                strb += ch;
            }
        }
        this.currentPosition++;
        return strb;
    }

    /**
     * Same as nextToken method, but returns Object type.
     * Provided for compatibility with java.util.Enumeration interface.
     */
    nextElement() {
        return this.nextToken();
    }

    /**
     * Check if there are more tokens remaining.
     */
    hasMoreTokens() {
        // Use "<=" not "<" to properly handle empty fields
        return (this.nextComma(this.currentPosition) <= this.maxPosition);
    }

    /**
     * Same as hasMoreTokens method.
     * Provided for compatibility with java.util.Enumeration interface.
     */
    hasMoreElements() {
        return this.hasMoreTokens();
    }

    /**
     * Return string representation of this instance.
     */
    toString() {
        return `CSVTokenizer("${this.source}")`;
    }
}