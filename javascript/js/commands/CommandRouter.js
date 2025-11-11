/**
 * CommandRouter - Routes commands to appropriate handlers
 * 
 * This demonstrates the Command Pattern and Single Responsibility Principle.
 * Each command type is handled by a specialized handler class.
 */
class CommandRouter {
    constructor(adventure) {
        this.adventure = adventure;
        this.handlers = [];
        
        // Initialize all available command handlers
        this.initializeHandlers();
    }

    /**
     * Initialize command handlers
     */
    initializeHandlers() {
        console.log("CommandRouter: Initializing handlers...");
        
        // Core system commands first - these should never be overridden
        if (window.SystemHandler) {
            console.log("CommandRouter: Adding SystemHandler");
            this.handlers.push(new SystemHandler(this.adventure));
        }
        
        if (window.GameControlHandler) {
            console.log("CommandRouter: Adding GameControlHandler");
            this.handlers.push(new GameControlHandler(this.adventure));
        }
        
        // ActionItemHandler comes VERY EARLY to allow custom item behaviors to override everything
        // This enables classic adventure patterns like "GO TREE" (climb tree), "GO BOAT" (board boat)
        // as well as overriding LOOK, SEARCH, GET, etc. with custom messages
        if (window.ActionItemHandler) {
            console.log("CommandRouter: Adding ActionItemHandler");
            this.handlers.push(new ActionItemHandler(this.adventure));
        }
        
        // Movement commands - can be overridden by ActionItems for "GO TREE", "GO ROPE" patterns
        if (window.MovementHandler) {
            console.log("CommandRouter: Adding MovementHandler");
            this.handlers.push(new MovementHandler(this.adventure));
        } else {
            console.log("CommandRouter: MovementHandler not available");
        }
        
        // Default command handlers - these can be overridden by ActionItems above
        if (window.InventoryHandler) {
            console.log("CommandRouter: Adding InventoryHandler");
            this.handlers.push(new InventoryHandler(this.adventure));
        }
        
        if (window.ItemHandler) {
            console.log("CommandRouter: Adding ItemHandler");
            this.handlers.push(new ItemHandler(this.adventure));
        }
        
        if (window.ExamineHandler) {
            console.log("CommandRouter: Adding ExamineHandler");
            this.handlers.push(new ExamineHandler(this.adventure));
        }
        
        if (window.SearchHandler) {
            console.log("CommandRouter: Adding SearchHandler");
            this.handlers.push(new SearchHandler(this.adventure));
        }
    }

    /**
     * Route a command to the appropriate handler
     * @param {string} verb - The command verb
     * @param {string} noun - The command noun/object
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {Object} - Result object with success flag and moved status
     */
    route(verb, noun, parseResult) {
        if (!verb) {
            this.adventure.desc.value += "I have no idea what you are trying to do.\n";
            return { success: true, moved: false };
        }

        // Try each handler until one can handle the command
        for (const handler of this.handlers) {
            if (handler.canHandle(verb, noun, parseResult)) {
                return handler.handle(verb, noun, parseResult);
            }
        }

        // No specialized handler found - let Adventure.js handle it
        return { success: false, moved: false };
    }

    /**
     * Check if this router can handle a specific verb
     * @param {string} verb - The command verb to check
     * @param {string} noun - The command noun (optional)
     * @param {Object} parseResult - Complete parse result with full noun info
     * @returns {boolean} - True if this router has a handler for the verb
     */
    canHandle(verb, noun, parseResult) {
        if (!verb) return false;
        
        return this.handlers.some(handler => handler.canHandle(verb, noun, parseResult));
    }
}

// Expose to global scope
window.CommandRouter = CommandRouter;