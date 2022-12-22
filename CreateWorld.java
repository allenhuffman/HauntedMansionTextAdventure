import java.io.*;
import java.util.Vector;
import java.net.*;

public final class CreateWorld
{
    private Vector 	locations = new Vector();	// List of Location items.
    private Vector 	exits = new Vector();   	// List of Exit items.
    Location 		currentLocation;		// Where we currently are in the game.
    Inventory 		inventory = new Inventory();	// What we are holding (player's inventory).

    // Er...
    CreateWorld( URL docBase ) {
        int numRooms = 0;

        { // HACK: A new scope just for this one thing that we want to go away later.
            // Define a temporary array which will hold location objects.
            // We will know how large this array is later, and do the actual
            // allocation at that time.  It is placed here so both try{} blocks
            // will have access to it.
            Location[] tempLocation;
        
            try {
                // I want these to exist only during this scope.
                String[] roomNames = new String[100];
                String[] roomDescs = new String[100];
                int[][] roomExits = new int[100][6];            
    
    //            FileReader	file = new FileReader( "hm_map.csv" );
    //            BufferedReader	buff = new BufferedReader(file);
                System.out.println( "Retrieving map from: "+docBase );
                URL url=new URL( docBase, "hm_map.csv");
                BufferedReader buff = new BufferedReader( new InputStreamReader(url.openStream()) );
        
                while(true) {
                    // Read a line from the file.
                    String line = buff.readLine();
                    // If we can't, it must be the end of file so get outta here.
                    if (line==null) break;
                    // System.out.println(line);
                    // Start tokenizing the line, CSV style.
                    CSVTokenizer csvt = new CSVTokenizer(line);
                    
                    // What is the Java equiv of atoi() ?
                    roomExits[numRooms][0] = Integer.parseInt(csvt.nextToken());
                    roomExits[numRooms][1] = Integer.parseInt(csvt.nextToken());
                    roomExits[numRooms][2] = Integer.parseInt(csvt.nextToken());
                    roomExits[numRooms][3] = Integer.parseInt(csvt.nextToken());
                    roomExits[numRooms][4] = Integer.parseInt(csvt.nextToken());
                    roomExits[numRooms][5] = Integer.parseInt(csvt.nextToken());
                    roomNames[numRooms] = csvt.nextToken();
                    roomDescs[numRooms] = csvt.nextToken();
                    numRooms++;
                }
                buff.close(); // Close access to this file/URL/whatever.
    
                // At this point, the state table has been read into a big array.
                // We want to build Location objects from this stuff.
                tempLocation = new Location[numRooms];
    
                for ( int i=0; i<numRooms; i++ ) {
                    // System.out.println( "Adding location "+i );
                    tempLocation[i] = new Location( roomNames[i], roomDescs[i] );
                }
                System.out.println( numRooms+" rooms added to game." );
                // Now we do the same with all the exits.
                int numExits = 0;
                for ( int i=0; i<numRooms; i++ ) {
                    // Loop through each exit direction.
                    for ( int j=0; j<6; j++ ) {
                        if ( roomExits[i][j]!=0 ) { // If this is an exit,
                            // System.out.println( "Adding exit in dir "+j+" to room "+i );
                            tempLocation[i].addExit( new Exit(j+1, tempLocation[roomExits[i][j]]) );
                            // Now add it to the real vector of locations.
                            //locations.add( tempLocation[i] );
                            numExits++;
                        }
                    }
                }
                System.out.println( numExits+" exits added to game." );
                currentLocation = tempLocation[1];
            } catch (IOException e) {
                // If here, we were unable to process the map file.
                System.out.println( "Error -- "+e.toString() );
                // Proceed no further!
                return;
            }
    
            int numItems = 0;
            try {
                // Now lets process game items.
                int[] itemLocation = new int[100];
                String[] itemKeyword = new String[100];
                String[] itemName = new String[100];
                String[] itemDescription = new String[100];
                boolean[] itemGetable = new boolean[100];
    
    //            FileReader	file = new FileReader( "hm_items.csv" );
    //            BufferedReader	buff = new BufferedReader(file);
                System.out.println( "Retrieving item list from: "+docBase );
                URL url=new URL( docBase, "hm_items.csv");
                BufferedReader buff = new BufferedReader( new InputStreamReader(url.openStream()) );
    
                while(true) {
                    // Read a line from the file.
                    String line = buff.readLine();
                    // If we can't, it must be the end of file so get outta here.
                    if (line==null) break;
                    // System.out.println(line);
                    // Start tokenizing the line, CSV style.
                    CSVTokenizer csvt = new CSVTokenizer(line);
                    
                    // What is the Java equiv of atoi() ?
                    itemLocation[numItems] = Integer.parseInt(csvt.nextToken());
                    itemKeyword[numItems] = csvt.nextToken();
                    itemName[numItems] = csvt.nextToken();
                    itemDescription[numItems] = csvt.nextToken();
                    String temp = csvt.nextToken();
                    if ( temp.equalsIgnoreCase("false") ) {
                        itemGetable[numItems] = false;
                    } else {
                        itemGetable[numItems] = true;
                    }
                    numItems++;
                }
                buff.close(); // Close access to this file/URL/whatever.
                
                // At this point, the state table has been read into a big array.
                // Create new item objects...
                for ( int i=0; i<numItems; i++ ) {
                    // System.out.println( "Adding item "+i+" to location "+itemLocation[i]+"." );
                    if ( itemLocation[i]==0 ) { // Player inventory
                        inventory.addItem( new Item( itemKeyword[i], itemName[i],
                                            itemDescription[i] ) );
                    } else { // In a location.
                        tempLocation[itemLocation[i]].addItem( 
                            new Item( itemKeyword[i], itemName[i], itemDescription[i],
                                        itemGetable[i] ) );
                    }
                }
                System.out.println( numItems+" items added to game." );
    
            } catch (IOException e) {
                System.out.println( "Error -- "+e.toString() );
                return;
            }
/*
            // ActionItem hack/test:
            Location roof = new Location( "Roof", "You are on the roof." );
            ActionItem ladder = new ActionItem( "ladder", "a tall metal ladder",
                "It is a tall sturdy ladder that runs to the roof." );
            ladder.setLeadsTo( roof );
            tempLocation[1].addItem( ladder );
*/
            // Sound hack.
            // Zone where foyer music plays.
            tempLocation[1].setSound( "foyer.au" );
            tempLocation[2].setSound( "foyer.au" );
            // Zone where storm plays
            tempLocation[3].setSound( "storm.au" );
            tempLocation[4].setSound( "storm.au" );
            // Zones where load music plays.
            tempLocation[5].setSound( "load.au" );
            tempLocation[6].setSound( "load.au" );
            tempLocation[14].setSound( "load.au" );
            tempLocation[11].setSound( "load.au" );
            tempLocation[12].setSound( "load.au" );
            // Zone where ballroom music plays.
            tempLocation[15].setSound( "ballroom.au" );
            tempLocation[32].setSound( "ballroom.au" );
            tempLocation[29].setSound( "ballroom.au" );
            // Zone where attic music plays.
            tempLocation[46].setSound( "attic.au" );
            tempLocation[51].setSound( "attic.au" );
            // Zone where attic ledge music plays.
            tempLocation[52].setSound( "atticledge.au" );
            // Zone where doors play.
            tempLocation[23].setSound( "doors.au" );
            tempLocation[25].setSound( "doors.au" );
        } // HACK: End of scope for tempLocation[] array.  Bye!
    }
    
    // Player functions.
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
}