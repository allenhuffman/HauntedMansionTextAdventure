import java.util.Vector;

class Location {
    protected String 	description;
    protected String 	name;
    protected boolean	beenHere = false;
    protected Vector 	items = new Vector();
    protected Vector	exits = new Vector();

    protected String	soundFile; // Background music file (if any)
    public void setSound( String soundFile ) {
        this.soundFile = soundFile;
    }
    public String getSound() {
        return soundFile;
    }

    // Basic location creation.
    Location( String name, String description ) {
        this.description = description;
        this.name = name;
    }

    // Set/change room description.
    public void setDescription( String desc ) {
        description = desc;
    }
    // Return room description.
    public String getDescription() {
        return description;
    }
    // Set/change room short name.
    public void setName( String locationName ) {
        name = locationName;
    }
    // Return room short name.
    public String getName() {
        return name;
    }
    // Add an exit to this location.
    public void addExit( Exit exit )
    {
        exits.add( exit );
    }
    // Remove an exit from this location.
    public void removeExit( Exit exit )
    {
        if ( exits.contains(exit) ) exits.remove( exit );
    }
    // Return a vector of exits.
    public Vector getExits()
    {
        // Return a clone, as we don't want an external
        // item to modify our original vector
        return (Vector)exits.clone();
    }
    // Add (drop) an item in this location.
    public void addItem( Item item )
    {
        items.add( item );
    }
    // Remove (get) an item from this location.
    public void removeItem( Item item )
    {
        if ( items.contains(item) ) items.remove(item);
    }
    // Returns a vector of items
    public Vector getItems()
    {
        return (Vector)items.clone();
    }
    // Set/change been here status.
    public void beenHere( boolean beenHere )
    {
        this.beenHere = beenHere;
    }
    // Return been here status.
    public boolean beenHere()
    {
        return beenHere;
    }
}

