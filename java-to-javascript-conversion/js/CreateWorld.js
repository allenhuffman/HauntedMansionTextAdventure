class CreateWorld {
    constructor() {
        this.locations = [];     // List of Location items.
        this.exits = [];         // List of Exit items.
        this.currentLocation = null;    // Where we currently are in the game.
        this.inventory = new Inventory();   // What we are holding (player's inventory).
    }

    async init() {
        let numRooms = 0;
        let tempLocation = [];

        try {
            // Load room data from CSV
            console.log("Retrieving map from: data/hm_map.csv");
            const mapResponse = await fetch('data/hm_map.csv');
            const mapText = await mapResponse.text();
            const mapLines = mapText.trim().split('\n');

            const roomNames = [];
            const roomDescs = [];
            const roomExits = [];

            for (const line of mapLines) {
                if (line.trim() === '') continue;
                
                const csvt = new CSVTokenizer(line);
                const exits = [];
                
                // Read the 6 direction exits (N,S,W,E,U,D)
                for (let i = 0; i < 6; i++) {
                    exits[i] = parseInt(csvt.nextToken());
                }
                
                const roomName = csvt.nextToken();
                const roomDesc = csvt.nextToken();
                
                roomExits[numRooms] = exits;
                roomNames[numRooms] = roomName;
                roomDescs[numRooms] = roomDesc;
                numRooms++;
            }

            // At this point, the state table has been read into arrays.
            // We want to build Location objects from this stuff.
            tempLocation = new Array(numRooms);

            for (let i = 0; i < numRooms; i++) {
                tempLocation[i] = new Location(roomNames[i], roomDescs[i]);
            }
            console.log(numRooms + " rooms added to game.");

            // Now we do the same with all the exits.
            let numExits = 0;
            for (let i = 0; i < numRooms; i++) {
                // Loop through each exit direction.
                for (let j = 0; j < 6; j++) {
                    if (roomExits[i][j] !== 0) { // If this is an exit,
                        tempLocation[i].addExit(new Exit(j + 1, tempLocation[roomExits[i][j]]));
                        numExits++;
                    }
                }
            }
            console.log(numExits + " exits added to game.");
            this.currentLocation = tempLocation[1]; // Start at room 1

        } catch (e) {
            console.log("Error loading map -- " + e.toString());
            return;
        }

        // Now load items
        let numItems = 0;
        try {
            console.log("Retrieving item list from: data/hm_items.csv");
            const itemResponse = await fetch('data/hm_items.csv');
            const itemText = await itemResponse.text();
            const itemLines = itemText.trim().split('\n');

            const itemLocation = [];
            const itemKeyword = [];
            const itemName = [];
            const itemDescription = [];
            const itemGetable = [];

            for (const line of itemLines) {
                if (line.trim() === '') continue;
                
                const csvt = new CSVTokenizer(line);
                
                itemLocation[numItems] = parseInt(csvt.nextToken());
                itemKeyword[numItems] = csvt.nextToken();
                itemName[numItems] = csvt.nextToken();
                itemDescription[numItems] = csvt.nextToken();
                const temp = csvt.nextToken();
                itemGetable[numItems] = !temp.toLowerCase().includes("false");
                numItems++;
            }

            // At this point, the state table has been read into arrays.
            // Create new item objects...
            for (let i = 0; i < numItems; i++) {
                if (itemLocation[i] === 0) { // Player inventory
                    this.inventory.addItem(new Item(itemKeyword[i], itemName[i], itemDescription[i]));
                } else { // In a location.
                    tempLocation[itemLocation[i]].addItem(
                        new Item(itemKeyword[i], itemName[i], itemDescription[i], itemGetable[i])
                    );
                }
            }
            console.log(numItems + " items added to game.");

        } catch (e) {
            console.log("Error loading items -- " + e.toString());
            return;
        }

        // Sound hack - hardcoded sound zones matching the Java original
        // Zone where foyer music plays.
        tempLocation[1].setSound("foyer.au");
        tempLocation[2].setSound("foyer.au");
        // Zone where storm plays
        tempLocation[3].setSound("storm.au");
        tempLocation[4].setSound("storm.au");
        // Zones where load music plays.
        tempLocation[5].setSound("load.au");
        tempLocation[6].setSound("load.au");
        tempLocation[14].setSound("load.au");
        tempLocation[11].setSound("load.au");
        tempLocation[12].setSound("load.au");
        // Zone where ballroom music plays.
        tempLocation[15].setSound("ballroom.au");
        tempLocation[32].setSound("ballroom.au");
        tempLocation[29].setSound("ballroom.au");
        // Zone where attic music plays.
        tempLocation[46].setSound("attic.au");
        tempLocation[51].setSound("attic.au");
        // Zone where attic ledge music plays.
        tempLocation[52].setSound("atticledge.au");
        // Zone where doors play.
        tempLocation[23].setSound("doors.au");
        tempLocation[25].setSound("doors.au");
    }

    // Player functions.
    getLocation() {
        return this.currentLocation;
    }

    setLocation(location) {
        this.currentLocation = location;
    }

    addItem(item) {
        this.inventory.addItem(item);
    }

    removeItem(item) {
        this.inventory.removeItem(item);
    }

    getItems() {
        return this.inventory.getItems();
    }
}