/**
 * GameControlHandler - Handles QUIT, RESTART, YES/NO confirmation commands
 * Manages game lifecycle and confirmation dialogs
 */
class GameControlHandler {
    constructor(adventure) {
        this.adventure = adventure;
    }

    /**
     * Check if this handler can process the given command
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @returns {boolean} True if this handler can process the command
     */
    canHandle(verb, noun, parseResult) {
        if (!verb) return false;
        const upperVerb = verb.toUpperCase();
        return upperVerb === "QUIT" || upperVerb === "RESTART" || 
               upperVerb === "YES" || upperVerb === "NO";
    }

    /**
     * Handle game control commands
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @returns {Object} Result object with success flag and any location changes
     */
    handle(verb, noun, parseResult) {
        const upperVerb = verb.toUpperCase();
        
        switch (upperVerb) {
            case "QUIT":
                return this.handleQuit();
            case "RESTART":
                return this.handleRestart();
            case "YES":
                return this.handleYes();
            case "NO":
                return this.handleNo();
            default:
                return { success: false, moved: false };
        }
    }

    /**
     * Handle QUIT command
     * @returns {Object} Result object
     */
    handleQuit() {
        this.adventure.desc.value += "Are you sure you want to quit? (YES/NO)\n";
        this.adventure.awaitingQuitConfirmation = true;
        
        return { success: true, moved: false };
    }

    /**
     * Handle RESTART command
     * @returns {Object} Result object
     */
    handleRestart() {
        if (this.adventure.awaitingQuitConfirmation) {
            // If we're in quit confirmation mode, restart anyway
            this.adventure.desc.value += "Restarting the haunted adventure...\n\n";
            this.adventure.awaitingQuitConfirmation = false;
            location.reload();
        } else {
            // Ask for confirmation before restart
            this.adventure.desc.value += "Are you sure you want to restart? (YES/NO)\n";
            this.adventure.awaitingRestartConfirmation = true;
        }
        
        return { success: true, moved: false };
    }

    /**
     * Handle YES command (confirmation)
     * @returns {Object} Result object
     */
    handleYes() {
        if (this.adventure.awaitingQuitConfirmation) {
            this.adventure.desc.value += "Thanks for playing the Haunted Mansion!\n";
            this.adventure.desc.value += "Closing game...\n";
            this.adventure.awaitingQuitConfirmation = false;
            
            // Attempt to close the window/tab
            setTimeout(() => {
                window.close();
                // If close fails (blocked by browser), show alternative
                this.adventure.desc.value += "Please close this browser tab to exit.\n";
            }, 1000);
            
        } else if (this.adventure.awaitingRestartConfirmation) {
            this.adventure.desc.value += "Restarting the haunted adventure...\n\n";
            this.adventure.awaitingRestartConfirmation = false;
            location.reload();
            
        } else {
            this.adventure.desc.value += "Yes what? I don't understand.\n";
        }
        
        return { success: true, moved: false };
    }

    /**
     * Handle NO command (cancel confirmation)
     * @returns {Object} Result object
     */
    handleNo() {
        if (this.adventure.awaitingQuitConfirmation) {
            this.adventure.desc.value += "Good! Continue your haunted adventure...\n";
            this.adventure.awaitingQuitConfirmation = false;
            
        } else if (this.adventure.awaitingRestartConfirmation) {
            this.adventure.desc.value += "Continuing your current adventure...\n";
            this.adventure.awaitingRestartConfirmation = false;
            
        } else {
            this.adventure.desc.value += "No what? I don't understand.\n";
        }
        
        return { success: true, moved: false };
    }

    /**
     * Check if we're in a confirmation state
     * @returns {boolean} True if awaiting confirmation
     */
    isAwaitingConfirmation() {
        return this.adventure.awaitingQuitConfirmation || 
               this.adventure.awaitingRestartConfirmation;
    }

    /**
     * Handle unrecognized input during confirmation
     * @returns {Object} Result object
     */
    handleConfirmationError() {
        if (this.adventure.awaitingQuitConfirmation) {
            this.adventure.desc.value += "Please type YES to quit, NO to continue, or RESTART to start over.\n";
        } else if (this.adventure.awaitingRestartConfirmation) {
            this.adventure.desc.value += "Please type YES to restart or NO to continue.\n";
        }
        
        return { success: true, moved: false };
    }
}

// Make GameControlHandler available globally
window.GameControlHandler = GameControlHandler;