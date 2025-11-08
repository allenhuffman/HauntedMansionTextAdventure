class Item {
    constructor(keyword, name, description, getable = true, actions = []) {
        this.keyword = keyword || null;
        this.name = name || null;
        this.description = description || null;
        this.getable = getable;
        this.actions = actions || [];
        
        // Store original values for resetting
        this.originalName = name || null;
        this.originalDescription = description || null;
        
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
                item.getKeyword().toLowerCase() === action.requiresItem.toLowerCase()
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
            message: action.message || `You ${verb} the ${this.keyword}.`,
            newLocation: null,
            consumeItem: action.consumeItem || false,
            addExit: action.addExit || null,
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

    // Set/change item keyword.
    setKeyword(keyword) {
        this.keyword = keyword;
    }

    // Return item keyword.
    getKeyword() {
        return this.keyword;
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