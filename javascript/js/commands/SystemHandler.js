/**
 * SystemHandler - Handles HELP, VERSION, VERBOSE, SOUND commands
 * Manages game state and information display commands
 */
class SystemHandler {
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
        return upperVerb === "HELP" || upperVerb === "VERSION" || 
               upperVerb === "VERBOSE" || upperVerb === "SOUND";
    }

    /**
     * Handle system commands
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @returns {Object} Result object with success flag and any location changes
     */
    handle(verb, noun, parseResult) {
        const upperVerb = verb.toUpperCase();
        
        switch (upperVerb) {
            case "HELP":
                return this.handleHelp();
            case "VERSION":
                return this.handleVersion();
            case "VERBOSE":
                return this.handleVerbose(noun);
            case "SOUND":
                return this.handleSound(noun);
            default:
                return { success: false, moved: false };
        }
    }

    /**
     * Handle HELP command
     * @returns {Object} Result object
     */
    handleHelp() {
        this.adventure.desc.value += "Available commands:\n";
        this.adventure.desc.value += "GO [direction] - Move in a direction (N, S, E, W, U, D)\n";
        this.adventure.desc.value += "LOOK/EXAMINE [item] - Look around or examine something\n";
        this.adventure.desc.value += "GET/TAKE [item] - Pick up an item\n";
        this.adventure.desc.value += "DROP [item] - Drop an item\n";
        this.adventure.desc.value += "INVENTORY - Show what you're carrying\n";
        this.adventure.desc.value += "HELP - Show this help\n";
        this.adventure.desc.value += "QUIT - Exit the game\n";
        this.adventure.desc.value += "VERBOSE ON/OFF - Toggle verbose mode\n";
        this.adventure.desc.value += "SOUND ON/OFF - Toggle sound\n";
        this.adventure.desc.value += "VERSION - Show version information\n";
        
        return { success: true, moved: false };
    }

    /**
     * Handle VERSION command
     * @returns {Object} Result object
     */
    handleVersion() {
        if (window.Versions) {
            this.adventure.desc.value += window.Versions.getFullVersionString() + "\n";
        } else {
            this.adventure.desc.value += "Haunted Mansion Text Adventure - JavaScript Version\n";
        }
        
        return { success: true, moved: false };
    }

    /**
     * Handle VERBOSE command
     * @param {string} noun - ON or OFF
     * @returns {Object} Result object
     */
    handleVerbose(noun) {
        if (!noun) {
            // Toggle verbose mode if no argument given
            this.adventure.verbose = !this.adventure.verbose;
        } else {
            const upperNoun = noun.toUpperCase();
            if (upperNoun === "ON") {
                this.adventure.verbose = true;
            } else if (upperNoun === "OFF") {
                this.adventure.verbose = false;
            } else {
                this.adventure.desc.value += "Use VERBOSE ON or VERBOSE OFF.\n";
                return { success: true, moved: false };
            }
        }
        
        if (this.adventure.verbose) {
            this.adventure.desc.value += "Verbose mode ON. Room descriptions will always be shown.\n";
            // Force redisplay of current location
            this.adventure.player.getLocation().beenHere(false);
            this.adventure.showLocation();
        } else {
            this.adventure.desc.value += "Verbose mode OFF. Room descriptions shown only on first visit.\n";
        }
        
        return { success: true, moved: false };
    }

    /**
     * Handle SOUND command
     * @param {string} noun - ON or OFF
     * @returns {Object} Result object
     */
    handleSound(noun) {
        if (!noun) {
            // Toggle sound if no argument given
            if (this.adventure.soundEnabled) {
                this.adventure.soundEnabled = false;
                if (this.adventure.soundPlayer) {
                    this.adventure.soundPlayer.stopLoop();
                }
                this.adventure.desc.value += "Sound OFF.\n";
            } else {
                this.adventure.soundEnabled = true;
                if (this.adventure.soundPlayer) {
                    this.adventure.soundPlayer.enableAudio();
                    // Restart current room's audio if it has sound
                    if (this.adventure.player && this.adventure.player.getLocation().getSound() !== null) {
                        this.adventure.soundPlayer.loop(this.adventure.player.getLocation().getSound());
                    }
                }
                this.adventure.desc.value += "Sound ON.\n";
            }
        } else {
            const upperNoun = noun.toUpperCase();
            if (upperNoun === "ON") {
                this.adventure.soundEnabled = true;
                if (this.adventure.soundPlayer) {
                    this.adventure.soundPlayer.enableAudio();
                    // Restart current room's audio if it has sound
                    if (this.adventure.player && this.adventure.player.getLocation().getSound() !== null) {
                        this.adventure.soundPlayer.loop(this.adventure.player.getLocation().getSound());
                    }
                }
                this.adventure.desc.value += "Sound ON.\n";
            } else if (upperNoun === "OFF") {
                this.adventure.soundEnabled = false;
                if (this.adventure.soundPlayer) {
                    this.adventure.soundPlayer.stopLoop();
                }
                this.adventure.desc.value += "Sound OFF.\n";
            } else {
                this.adventure.desc.value += "Use SOUND ON or SOUND OFF.\n";
            }
        }
        
        return { success: true, moved: false };
    }
}

// Make SystemHandler available globally
window.SystemHandler = SystemHandler;