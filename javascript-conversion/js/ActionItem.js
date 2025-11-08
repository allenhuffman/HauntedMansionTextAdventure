class ActionItem extends Item {
    constructor(keyword, name, description, getable = false) {
        super(keyword, name, description, getable);
        this.action = null;     // Action keyword.
        this.leadsTo = null;    // Where does this item take you?
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
}