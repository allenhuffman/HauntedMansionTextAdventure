import java.util.*;
import java.io.*;

public class World {
    private Vector locations;   // List of Location items.
    private Vector exits;   	// List of Exit items.
    private Vector items;    	// List of Item items.

    // Player item.
    Player player = new Player();

    // World constructor
    public void World() {
        // Instantiate vector lists for location/exits
        locations = new Vector();
        exits = new Vector();
        items = new Vector();        
    }
    // Add exit to the world.
    public void addExit( Exit exit ) {
        if ( !exits.contains(exit) ) exits.add(exit);
    }
    // Add location to the world.
    public void addLocation( Location location ) {
        if ( !locations.contains(location) ) locations.add(location);
    }
    // Add items to the world.
    public void addItem( Item item ) {
        if ( !items.contains(item) ) items.add(items);
    }
}

