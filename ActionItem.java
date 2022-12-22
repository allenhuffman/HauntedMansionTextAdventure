/*
An ActionItem is an item that can be used to get to another location,
such as a ladder (which you could climb) or a boat (which you could 'row').
Typically the item would not be getable since the destination is fixed,
but if someone wanted to carry around a magic teleportation box that would
take them instantly to some fixed location, I guess we will allow that.

Ideally, the game parser will let you type "go item" to end up at the
destination location, but special action words will also be allowed to
make more sense.  "climb ladder" sounds better than "go ladder", for
instance.
*/

public class ActionItem extends Item {
    private String	action;		// Action keyword.
    private Location	leadsTo;	// Where does this item take you?

    public boolean isSpecial() {
        return true;
    }
    
    ActionItem() {
    }

    // Some constructors (which just call the super class, Item).
    ActionItem( String keyword, String name ) {
        super( keyword, name, "", false );
    }
    // Full item with description.
    ActionItem( String keyword, String name, String description ) {
        super( keyword, name, description, false );
    }
    // Static (possibly non-moveable) item.
    ActionItem( String keyword, String name, String description, boolean getable ) {
        super( keyword, name, description, getable );
    }

    // New methods to manipulate the exit this item leads to.
    // Set where this item leads to.
    public void setLeadsTo( Location leadsTo )
    {
        this.leadsTo = leadsTo;
    }
    // Return where this item leads to.
    public Location getLeadsTo()
    {
        return leadsTo;
    }

    // Then it should use all the methods from the super class.  Yes?
};
