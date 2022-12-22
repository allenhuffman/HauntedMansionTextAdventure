import java.util.Vector;

class Player {
    private Location 	currentLocation;
    private Inventory	inventory = new Inventory();

    public Location getLocation()
    {
        return currentLocation;
    }

    public void setLocation( Location location )
    {
        currentLocation = location;
    }

    public void addItem( Item item )
    {
        inventory.addItem( item );
    }

    public void removeItem( Item item )
    {
        inventory.removeItem( item );
    }

    public Vector getItems()
    {
        return inventory.getItems();
    }
};
