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
    }

    isSpecial() {
        return this.actions && this.actions.length > 0;
    }

    // Check if this item can perform a specific action
    canPerformAction(verb, currentRoomId) {
        if (!this.isSpecial()) return null;
        
        return this.actions.find(action => {
            if (action.verb.toLowerCase() !== verb.toLowerCase()) return false;
            
            // Check if action works in this room
            if (action.useInRoom === "*") return true; // Works anywhere
            if (Array.isArray(action.useInRoom)) {
                return action.useInRoom.includes(currentRoomId);
            }
            return action.useInRoom === currentRoomId;
        });
    }

    // Execute an action and return the result
    executeAction(verb, currentRoomId, world, playerItems = []) {
        const action = this.canPerformAction(verb, currentRoomId);
        if (!action) return null;

        // Check if action requires a specific item
        if (action.requiresItem) {
            const hasRequiredItem = playerItems.some(item => 
                item.getKeyword().toLowerCase() === action.requiresItem.toLowerCase()
            );
            if (!hasRequiredItem) {
                return {
                    success: false,
                    message: `You need a ${action.requiresItem} to do that.`
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
            newName: newName
        };

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