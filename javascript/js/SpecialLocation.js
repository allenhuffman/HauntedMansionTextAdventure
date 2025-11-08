class SpecialLocation extends Location {
    constructor(name, description) {
        super(name, description);
        this.specialExits = []; // Vector equivalent
    }

    // Add a special exit to this location
    addSpecialExit(specialExit) {
        this.specialExits.push(specialExit);
    }

    // Remove a special exit from this location
    removeSpecialExit(specialExit) {
        const index = this.specialExits.indexOf(specialExit);
        if (index > -1) {
            this.specialExits.splice(index, 1);
        }
    }

    // Get all special exits
    getSpecialExits() {
        return [...this.specialExits]; // Return a copy
    }
}