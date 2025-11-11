/**
 * MovementHandler - Handles player movement commands (GO, GOTO)
 * 
 * Extracted from Adventure.js to separate movement logic from main game controller.
 * This demonstrates clean refactoring with single responsibility principle.
 */
class MovementHandler {
    constructor(adventure) {
        this.adventure = adventure;
    }

    /**
     * Check if this handler can process the given command
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun (optional)
     * @returns {boolean} - True if this handler can process the command
     */
    canHandle(verb, noun) {
        console.log("MovementHandler canHandle called with:", verb, noun);
        if (!verb) {
            console.log("MovementHandler: No verb, returning false");
            return false;
        }
        const verbUpper = verb.toUpperCase();
        console.log("MovementHandler: verbUpper =", verbUpper);
        const result = verbUpper === "GO" || verbUpper === "GOTO";
        console.log("MovementHandler: canHandle result =", result);
        return result;
    }

    /**
     * Handle movement commands (GO direction, GOTO room_number)
     * @param {string} verb - The movement verb (GO, GOTO) 
     * @param {string} noun - The direction or room number
     * @returns {Object} - Result object with success flag and moved status
     */
    handle(verb, noun) {
        const verbUpper = verb.toUpperCase();
        
        if (verbUpper === "GO") {
            const moved = this.handleGo(noun);
            return { success: true, moved: moved };
        }
        
        if (verbUpper === "GOTO") {
            const moved = this.handleGoto(noun);
            return { success: true, moved: moved };
        }
        
        return { success: false, moved: false };
    }

    /**
     * Handle GO direction command
     * @param {string} direction - Direction to move (NORTH, SOUTH, etc.)
     * @returns {boolean} - True if player moved, false otherwise
     */
    handleGo(direction) {
        if (!direction) {
            this.adventure.desc.value += "Go where?\n";
            return false;
        }

        const exits = this.adventure.player.getLocation().getExits();
        
        for (const anExit of exits) {
            if ((anExit.getDirectionName() && anExit.getDirectionName().toUpperCase() === direction.toUpperCase()) ||
                (anExit.getShortDirectionName() && anExit.getShortDirectionName().toUpperCase() === direction.toUpperCase())) {
                // Set location to the location pointed to by exit
                this.adventure.player.setLocation(anExit.getLeadsTo());
                return true; // Player moved
            }
        }

        this.adventure.desc.value += "You can't go that way.\n";
        return false;
    }

    /**
     * Handle GOTO room_number command (debug feature)
     * @param {string} roomNumber - Room number to teleport to
     * @returns {boolean} - True if player moved, false otherwise
     */
    handleGoto(roomNumber) {
        if (!roomNumber || isNaN(roomNumber)) {
            this.adventure.desc.value += "[DEBUG: Usage: GOTO <room_number>]\n";
            return false;
        }

        const roomId = parseInt(roomNumber);
        if (this.adventure.player.locations[roomId]) {
            this.adventure.player.setLocation(this.adventure.player.locations[roomId]);
            this.adventure.desc.value += `[DEBUG: Teleported to room ${roomId}]\n`;
            return true;
        } else {
            this.adventure.desc.value += `[DEBUG: Room ${roomId} does not exist]\n`;
            return false;
        }
    }

    /**
     * Process direction shortcuts (N -> GO NORTH, etc.)
     * @param {string} verb - Original verb that might be a shortcut
     * @param {string} noun - Original noun
     * @returns {object} - {verb, noun} with shortcuts expanded
     */
    static processDirectionShortcuts(verb, noun) {
        if (!verb) return { verb, noun };
        
        const verbUpper = verb.toUpperCase();
        const shortcuts = {
            'N': { verb: 'GO', noun: 'NORTH' },
            'S': { verb: 'GO', noun: 'SOUTH' },
            'W': { verb: 'GO', noun: 'WEST' },
            'E': { verb: 'GO', noun: 'EAST' },
            'U': { verb: 'GO', noun: 'UP' },
            'D': { verb: 'GO', noun: 'DOWN' }
        };

        return shortcuts[verbUpper] || { verb, noun };
    }
}

// Expose to global scope for CommandRouter
window.MovementHandler = MovementHandler;