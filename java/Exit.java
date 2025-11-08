public class Exit
{
    protected int 		direction = UNDEFINED;	/* Going this direction... */
    protected Location 		leadsTo = null;		/* ...leads to here. */
    protected String 		directionName;		/* Direction name. */
    protected String 		shortDirectionName;	/* Direction abbreviation. */

    // Some constant #define-type directional values.
    public static final int UNDEFINED = 0;
    public static final int NORTH = 1;
    public static final int SOUTH = 2;
    public static final int WEST  = 3;
    public static final int EAST  = 4;
    public static final int UP = 5;
    public static final int DOWN = 6;
        // Full direction strings.	
    public static final String[] dirName = { 
        "UNDEFINED", "North", "South", "West", "East", "Up", "Down"
    };
    // Abbreviated direction strings.
    public static final String[] shortDirName = {
        "NULL", "N", "S", "W", "E", "U", "D"
    };

    // For future subclass use.
    public boolean isSpecial() {
        return false;
    }

    // Default constructor. Creates a null exit.
    public void Exit() {
        direction 		= Exit.UNDEFINED;
        leadsTo 		= null;
        directionName 		= dirName[UNDEFINED];
        shortDirectionName 	= shortDirName[UNDEFINED];
    }
    // Create a functional exit.
    public Exit( int direction, Location leadsTo ) {
        // Assign direction name.
        if (direction <= dirName.length ) directionName = dirName[direction];
        // Assign direction abbreviation.
        if (direction <= shortDirName.length ) shortDirectionName = shortDirName[direction];
        // Assign destination location.
        this.leadsTo = leadsTo;
    }
    // Assign direction.
    public void setDirection( int direction ) {
        // Assign direction name.
        if (direction <= dirName.length ) directionName = dirName[direction];
        // Assign direction abbreviation.
        if (direction <= shortDirName.length ) shortDirectionName = shortDirName[direction];
    }
    // Return direction.
    public int getDirection() {
        return direction;
    }
    // Return direction name.
    public String getDirectionName() {
        return directionName;
    }
    // Return short direction name.
    public String getShortDirectionName() {
        return shortDirectionName;
    }
    // Assign/change location.
    public void setLeadsTo( Location leadsTo ) {
        this.leadsTo = leadsTo;
    }
    // Return location.
    public Location getLeadsTo() {
        return leadsTo;
    }
}
