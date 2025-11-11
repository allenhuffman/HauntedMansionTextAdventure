class ActionItem extends Item {
    constructor(keyword, name, description, getable = false) {
        // Handle both old format (keyword, name, description, getable) and new format (options object)
        if (typeof keyword === 'object' && keyword !== null) {
            // New format: first parameter is an options object
            super(keyword); // Pass the options object to parent constructor
        } else {
            // Old format: separate parameters
            super(keyword, name, description, getable);
        }
        
        this.action = null;     // Action keyword.
        this.leadsTo = null;    // Where does this item take you?
        this.actions = [];      // Array of action definitions from JSON
        this.performedActions = new Set(); // Track which onceOnly actions have been performed
    }

    // Alternative constructors
    static createBasic(keyword, name) {
        return new ActionItem(keyword, name, "", false);
    }

    static createWithDescription(keyword, name, description) {
        return new ActionItem(keyword, name, description, false);
    }

    isSpecial() {
        return true;
    }

    // Set the action keyword for this item
    setAction(action) {
        this.action = action;
    }

    // Get the action keyword for this item
    getAction() {
        return this.action;
    }

    // Set where this item leads to.
    setLeadsTo(leadsTo) {
        this.leadsTo = leadsTo;
    }

    // Return where this item leads to.
    getLeadsTo() {
        return this.leadsTo;
    }

    // Set the actions array from JSON data
    setActions(actions) {
        this.actions = actions || [];
    }

    // Get all actions for this item
    getActions() {
        return this.actions;
    }

    // Check if this item has a specific action
    hasAction(verb) {
        const verbLower = verb.toLowerCase();
        return this.actions.some(action => {
            const verbs = action.verb.toLowerCase().split(',').map(v => v.trim());
            return verbs.includes(verbLower);
        });
    }

    // Execute an action based on the JSON definition
    executeAction(verb, currentRoomId, player, itemCollection) {
        const verbLower = verb.toLowerCase();
        
        // Find the matching action (supports comma-separated verbs)
        const actionDef = this.actions.find(action => {
            const verbs = action.verb.toLowerCase().split(',').map(v => v.trim());
            return verbs.includes(verbLower);
        });
        if (!actionDef) {
            return { success: false, message: "I don't understand that." };
        }

        // Check if this is a onceOnly action that has already been performed
        const actionKey = `${verb}_${this.getKeyword()}`;
        if (actionDef.onceOnly && this.performedActions.has(actionKey)) {
            return { 
                success: true, 
                message: actionDef.alreadyPerformedMessage || "You have already done that." 
            };
        }

        // Check room requirement
        if (actionDef.useInRoom && actionDef.useInRoom !== "*" && actionDef.useInRoom !== currentRoomId) {
            return { success: false, message: "You can't do that here." };
        }

        // Check item requirement using exact string matching
        if (actionDef.requiresItem && player) {
            const requiredItem = actionDef.requiresItem.toLowerCase();
            const hasRequiredItem = player.getItems().some(item => 
                item.getName().toLowerCase().includes(requiredItem)
            );
            
            if (!hasRequiredItem) {
                return { 
                    success: true, 
                    message: actionDef.requiresItemMessage || `You need a ${actionDef.requiresItem} to do that.` 
                };
            }
        }

        // Mark as performed if onceOnly
        if (actionDef.onceOnly) {
            this.performedActions.add(actionKey);
        }

        // Update description if specified
        if (actionDef.newDescription) {
            this.setDescription(actionDef.newDescription);
        }

        // Update name if specified
        if (actionDef.newName) {
            this.setName(actionDef.newName);
        }

        // Return success with all the action data for the handler to process
        return {
            success: true,
            message: actionDef.message,
            revealsItemId: actionDef.revealsItemId,
            revealsItemLocation: actionDef.revealsItemLocation,
            newLocation: actionDef.newLocation,
            addSound: actionDef.addSound,
            addExit: actionDef.addExit
        };
    }
}