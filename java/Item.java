/*
    "book"
    "a small book"
    "It is a small paperback book by Douglas Adams. Don't Panic!"
*/
public class Item {
    protected String 	keyword = null;
    protected String 	name = null;
    protected String 	description = null;
    protected boolean	getable = true;

    public boolean isSpecial() {
        return false;
    }

    Item() {
        keyword = null;
        name = null;
        description = null;
        getable = true;
    }

    // Basic item with no description.
    Item( String keyword, String name ) {
        this.keyword = keyword;
        this.name = name;
        getable = true;
    }
    // Full item with description.
    Item( String keyword, String name, String description ) {
        this.keyword = keyword;
        this.name = name;
        this.description = description;
        getable = true;
    }
    // Static (possibly non-moveable) item.
    Item( String keyword, String name, String description, boolean getable ) {
        this.keyword = keyword;
        this.name = name;
        this.description = description;
        this.getable = getable;
    }

    // Set/change item description.
    public void setDescription( String description ) {
        this.description = description;
    }
    // Return item description.
    public String getDescription() {
        return description;
    }
    // Set/change item name.
    public void setName( String name ) {
        this.name = name;
    }
    // Return item name.
    public String getName() {
        return name;
    }
    // Set/change item keyword.
    public void setKeyword( String keyword ) {
        this.keyword = keyword;
    }
    // Return item keyword.
    public String getKeyword() {
        return keyword;
    }
    // Set/change item getable status.
    public void setGetable( boolean getable ) {
        this.getable = getable;
    }
    // Return item getable status.
    public boolean isGetable() {
        return getable;
    }
};
