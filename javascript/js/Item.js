class Item {
    constructor(keyword, name, description, getable = true) {
        this.keyword = keyword || null;
        this.name = name || null;
        this.description = description || null;
        this.getable = getable;
    }

    isSpecial() {
        return false;
    }

    // Set/change item description.
    setDescription(description) {
        this.description = description;
    }

    // Return item description.
    getDescription() {
        return this.description;
    }

    // Set/change item name.
    setName(name) {
        this.name = name;
    }

    // Return item name.
    getName() {
        return this.name;
    }

    // Set/change item keyword.
    setKeyword(keyword) {
        this.keyword = keyword;
    }

    // Return item keyword.
    getKeyword() {
        return this.keyword;
    }

    // Set/change item getable status.
    setGetable(getable) {
        this.getable = getable;
    }

    // Return item getable status.
    isGetable() {
        return this.getable;
    }
}