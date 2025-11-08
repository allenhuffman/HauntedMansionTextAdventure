class Exit {
    // Direction constants
    static UNDEFINED = 0;
    static NORTH = 1;
    static SOUTH = 2;
    static WEST = 3;
    static EAST = 4;
    static UP = 5;
    static DOWN = 6;

    // Full direction strings.
    static dirName = [
        "UNDEFINED", "North", "South", "West", "East", "Up", "Down"
    ];

    // Abbreviated direction strings.
    static shortDirName = [
        "NULL", "N", "S", "W", "E", "U", "D"
    ];

    constructor(direction, leadsTo) {
        this.direction = direction || Exit.UNDEFINED;
        this.leadsTo = leadsTo || null;
        
        // Assign direction name.
        if (direction < Exit.dirName.length) {
            this.directionName = Exit.dirName[direction];
        }
        
        // Assign direction abbreviation.
        if (direction < Exit.shortDirName.length) {
            this.shortDirectionName = Exit.shortDirName[direction];
        }
    }

    // For future subclass use.
    isSpecial() {
        return false;
    }

    // Assign direction.
    setDirection(direction) {
        this.direction = direction;
        
        // Assign direction name.
        if (direction < Exit.dirName.length) {
            this.directionName = Exit.dirName[direction];
        }
        
        // Assign direction abbreviation.
        if (direction < Exit.shortDirName.length) {
            this.shortDirectionName = Exit.shortDirName[direction];
        }
    }

    // Return direction.
    getDirection() {
        return this.direction;
    }

    // Return direction name.
    getDirectionName() {
        return this.directionName;
    }

    // Return short direction name.
    getShortDirectionName() {
        return this.shortDirectionName;
    }

    // Assign/change location.
    setLeadsTo(leadsTo) {
        this.leadsTo = leadsTo;
    }

    // Return location.
    getLeadsTo() {
        return this.leadsTo;
    }
}