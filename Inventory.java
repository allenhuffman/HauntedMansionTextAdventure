/* Inventory item.  Contains a vector of item items... */

import java.util.Vector;

public class Inventory {
    private Vector 	items;

    // Create a new (empty) vector of items.
    Inventory()
    {
        items = new Vector();
    }
    // Add an item into inventory.
    public void addItem( Item item )
    {
        items.add( item );
    }
    // Remove an item from inventory.
    public void removeItem( Item item )
    {
        if ( items.contains(item) ) items.remove(item);
    }
    // Return a list of items in inventory.
    public Vector getItems()
    {
        return (Vector)items.clone();
    }
}
