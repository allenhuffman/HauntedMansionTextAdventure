class Item {
    constructor(keyword, name, description, getable = true, actions = []) {
        // For backward compatibility, support both old (keyword, name) and new (name only) formats
        if (typeof keyword === 'object' && keyword !== null) {
            // New format: first parameter is an options object
            const options = keyword;
            this.name = options.name || null;
            this.description = options.description || null;
            this.getable = options.getable !== undefined ? options.getable : true;
            this.actions = options.actions || [];
        } else {
            // Old format: separate parameters, but use name as primary identifier
            this.name = name || keyword || null; // Prefer name, fallback to keyword
            this.description = description || null;
            this.getable = getable !== undefined ? getable : true;
            this.actions = actions || [];
        }
        
        // Store original values for resetting
        this.originalName = this.name || null;
        this.originalDescription = this.description || null;
        
        // Track which actions have been performed (for onceOnly actions)
        this.performedActions = new Set();
    }

    isSpecial() {
        return this.actions && this.actions.length > 0;
    }

    // Check if this item can perform a specific action
    canPerformAction(verb, currentRoomId) {
        if (!this.isSpecial()) return null;
        
        // First check if there's an action that matches the verb and room, regardless of onceOnly status
        const matchingAction = this.actions.find(action => {
            if (action.verb.toLowerCase() !== verb.toLowerCase()) return false;
            
            // Check if action works in this room
            if (action.useInRoom === "*") return true; // Works anywhere
            if (Array.isArray(action.useInRoom)) {
                return action.useInRoom.includes(currentRoomId);
            }
            return action.useInRoom === currentRoomId;
        });
        
        if (!matchingAction) return null;
        
        // If it's a onceOnly action that has already been performed, return a special marker
        if (matchingAction.onceOnly && this.performedActions.has(matchingAction.verb.toLowerCase())) {
            return { ...matchingAction, _alreadyPerformed: true };
        }
        
        return matchingAction;
    }

    // Execute an action and return the result
    executeAction(verb, currentRoomId, world, playerItems = []) {
        const action = this.canPerformAction(verb, currentRoomId);
        if (!action) return null;

        // Check if this is a onceOnly action that has already been performed
        if (action._alreadyPerformed) {
            return {
                success: true,
                message: action.alreadyPerformedMessage || "You find nothing else."
            };
        }

        // Check if action requires a specific item
        if (action.requiresItem) {
            const hasRequiredItem = playerItems.some(item => 
                item.getName().toLowerCase().includes(action.requiresItem.toLowerCase())
            );
            if (!hasRequiredItem) {
                return {
                    success: true, // Changed to true so message shows instead of falling back
                    message: action.requiresItemMessage || `You need a ${action.requiresItem} to do that.`
                };
            }
        }

        // Handle empty strings or undefined by reverting to originals
        let newDescription = action.newDescription;
        if (newDescription === "" || newDescription === undefined) {
            newDescription = this.originalDescription;
        }
        
        let newName = action.newName;
        if (newName === "" || newName === undefined) {
            newName = this.originalName;
        }

        const result = {
            success: true,
            message: action.message || `You ${verb} the ${this.name}.`,
            newLocation: null,
            consumeItem: action.consumeItem || false,
            addExit: action.addExit || null,
            addSound: action.addSound || null,
            removeSound: action.removeSound || null,
            newDescription: newDescription,
            newName: newName,
            revealsItem: action.revealsItem || null,
            revealsItemId: action.revealsItemId || null
        };

        // Mark action as performed if it's onceOnly
        if (action.onceOnly) {
            this.performedActions.add(action.verb.toLowerCase());
        }

        // Handle location change
        if (action.leadsTo) {
            if (typeof action.leadsTo === 'number') {
                result.newLocation = action.leadsTo;
            } else if (typeof action.leadsTo === 'string') {
                // Could support room name lookup here if needed
                result.newLocation = action.leadsTo;
            }
        }

        return result;
    }

    // Set/change item description.
    setDescription(description) {
        this.description = description;
    }

    // Return item description.
    getDescription() {
        return this.description;
    }

    // Set/change item name.
    setName(name) {
        this.name = name;
    }

    // Return item name.
    getName() {
        return this.name;
    }

    // Return item keyword (for backward compatibility - returns name)
    getKeyword() {
        return this.name; // Use name as the keyword for backward compatibility
    }

    // Set/change item keyword (for backward compatibility - sets name)
    setKeyword(keyword) {
        this.name = keyword;
    }

    // Set/change item getable status.
    setGetable(getable) {
        this.getable = getable;
    }

    // Return item getable status.
    isGetable() {
        return this.getable;
    }
}