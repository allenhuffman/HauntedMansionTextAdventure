//
//  Adventure.java
//  Adventure
//
//  Created by Allen Huffman on Fri Nov 22 2002.
//  With substantial technical hand holding by Vaughn Cato ;-)
//  Copyright (c) 2002 __MyCompanyName__. All rights reserved.
//  A simple Java applet
//

import java.awt.*;
import java.applet.*;
import java.awt.event.*;
import java.util.Enumeration;

public class Adventure extends Applet {
    TextArea 	desc;
    TextField 	input;
//    Player 	player = new Player();
    boolean	verbose = false;
    CreateWorld	player;
    SoundPlayer	soundPlayer;
        
    class TextAction implements ActionListener {
        public void actionPerformed(ActionEvent event) {
            textEntered();
        }
    };
    
    public void textEntered()
    {
        Parse parser = new Parse();
        String line = input.getText();

        if ( line.length()==0 ) return;	// Ignore NULL lines...
        line.trim();			// Remove leading and trailing whitespace.

        parser.parse( line );
        String verb = parser.getVerb();
        String noun = parser.getNoun();
        
        if ( verb.equalsIgnoreCase("N") ) { verb="GO"; noun="NORTH"; };
        if ( verb.equalsIgnoreCase("S") ) { verb="GO"; noun="SOUTH"; };
        if ( verb.equalsIgnoreCase("W") ) { verb="GO"; noun="WEST"; };
        if ( verb.equalsIgnoreCase("E") ) { verb="GO"; noun="EAST"; };
        if ( verb.equalsIgnoreCase("U") ) { verb="GO"; noun="UP"; };
        if ( verb.equalsIgnoreCase("D") ) { verb="GO"; noun="DOWN"; };
        if ( verb.equalsIgnoreCase("I") ) { verb="INVENTORY"; };
        if ( verb.equalsIgnoreCase("L") ) { verb="LOOK"; };

        desc.append( "> "+line+"\n" );
        
        boolean moved = false;
        // Handle verbs (commands)...
        if ( verb.equalsIgnoreCase("GO") ) {
            moved = false;
            for (Enumeration e = player.getLocation().getExits().elements();
                e.hasMoreElements(); )
            {
                Exit an_exit = (Exit) e.nextElement();

                if ( an_exit.getDirectionName().equalsIgnoreCase(noun) ||
                    an_exit.getShortDirectionName().equalsIgnoreCase(noun) )
                {
                    // Set location to the location pointed to by exit.
                    player.setLocation( an_exit.getLeadsTo() );
                    moved = true;
                }				
            }
/*
            // If that didn't work, we check for ActionItems.
            for (Enumeration e = player.getLocation().getItems().elements();
                 e.hasMoreElements(); )
            {
                ActionItem an_item = (ActionItem)e.nextElement();

                if ( an_item.isSpecial() && an_item.getKeyword().equalsIgnoreCase(noun) ) {
                        // Set location to the location pointed to by exit
                        player.setLocation( an_item.getLeadsTo() );
                        moved = true;
                }
            }
*/
            if ( !moved ) desc.append( "You can't go that way.\n" );     
        }
        else if ( verb.equalsIgnoreCase("INVENTORY") ) {
            desc.append( "You are carrying " );
            boolean items = false;
            for ( Enumeration e = player.getItems().elements();
                e.hasMoreElements(); )
            {
                Item an_item = (Item)e.nextElement();
                if ( items==true && !e.hasMoreElements() ) desc.append( "and " );
                desc.append( an_item.getName() );
                items = true;
                if ( e.hasMoreElements() ) { // More items?
                    desc.append( ", " );
                } else {
                    desc.append( ".\n" );
                }
            }
            if ( !items ) desc.append( "nothing.\n" );
        }
        
        else if ( verb.equalsIgnoreCase("GET") || verb.equalsIgnoreCase("TAKE") ) {
            boolean items = false;
            for (Enumeration e = player.getLocation().getItems().elements();
                e.hasMoreElements(); )
            {
                Item an_item = (Item)e.nextElement();
                /* An item is here, see if this is what they want to take. */
                if ( an_item.getKeyword().equalsIgnoreCase(noun) ||
                    noun.equalsIgnoreCase("ALL") )
                {
                    // Set location to the location pointed to by exit
                    if ( an_item.isGetable()==true ) {
                        player.getLocation().removeItem(an_item);
                        player.addItem(an_item);
                        desc.append( an_item.getKeyword()+" taken.\n" );
                        // break;
                        // If "ALL" is given, I want it to keep scanning...
                        e = player.getLocation().getItems().elements(); /* HACK */
                    } else {
                        desc.append( "You can't get the "+an_item.getKeyword()+".\n" );
                    }
                    items = true;
                }				
            } 
            if ( !items ) desc.append( "I don't see that here.\n" );
        }
        
        else if ( verb.equalsIgnoreCase("DROP") ) {
            boolean items = false;
            for (Enumeration e = player.getItems().elements();
                e.hasMoreElements(); )
            {
                Item an_item = (Item)e.nextElement();
                /* Item is here, see if this is what they want to take. */
                if ( an_item.getKeyword().equalsIgnoreCase(noun) ||
                    noun.equalsIgnoreCase("ALL") )
                {
                    // Set location to the location pointed to by exit
                    player.removeItem(an_item);
                    player.getLocation().addItem(an_item);
                    desc.append( an_item.getKeyword()+" dropped.\n" );
                    items = true;
/*                    break; */
                    /* If "ALL" is given, I want it to keep scanning... */
                    e = player.getItems().elements();

                }				
            } 
            if ( !items ) desc.append( "You don't seem to be carrying that.\n" );
        }
        
        else if ( verb.equalsIgnoreCase("VERBOSE") ) {
            if ( noun==null || noun.equalsIgnoreCase("ON") ) {
                verbose=true;
            } else if ( noun.equalsIgnoreCase("OFF") ) {
                verbose=false;
            }
            if ( verbose==true ) {
                desc.append( "Verbose mode is ON.\n" );
            } else {
                desc.append( "Verbose mode is OFF.\n" );
            }
        }

        else if ( verb.equalsIgnoreCase("LOOK") || verb.equalsIgnoreCase("EXAMINE") ) {
            if ( noun==null ) { /* are we just looking at the room? */
                player.getLocation().beenHere(false); /* kinda a kludge */
                showLocation();
            } else {
                /* Nope, find the item... */
                boolean items = false;
                for (Enumeration e = player.getItems().elements();
                    e.hasMoreElements(); )
                {
                    Item an_item = (Item)e.nextElement();
                    /* Item is in inventory, see if this is what they want to take. */
                    if ( an_item.getKeyword().equalsIgnoreCase(noun) )
                    {
                        desc.append( an_item.getDescription()+"\n" );
                        items = true;
                        break;
                    }
                }
                // Now check for items that are in the room.  (Kinda a hack...)
                for (Enumeration e = player.getLocation().getItems().elements();
                    e.hasMoreElements(); )
                {
                    Item an_item = (Item)e.nextElement();
                    /* Item is in inventory, see if this is what they want to take. */
                    if ( an_item.getKeyword().equalsIgnoreCase(noun) )
                    {
                        desc.append( an_item.getDescription()+"\n" );
                        items = true;
                        break;
                    }
                }
                                        			
                if ( !items ) desc.append( "I don't see that around here.\n" );
            } // end of (noun==null)
        } else {
/*
            // If here, we should see if there are any special items we can do something to.
            moved = false;
            for (Enumeration e = player.getLocation().getItems().elements();
                e.hasMoreElements(); )
            {
                Item an_item = (Item)e.nextElement();

                if ( an_item.isSpecial() ) { // Special item found!
                    if ( an_item.getAction().equalsIgnoreCase(verb) ||
                         an_item.getKeyword().equalsIgnoreCase(noun) ) {
                        // Set location to the location pointed to by exit
                        player.setLocation( an_exit.getLeadsTo() );
                        moved = true;
                    }
                }				
            }
*/            
            if ( moved==false ) desc.append( "I have no idea what you are trying to do.\n" );
        }

        /* See if we have to redisplay the location stuff. */
        if ( moved==true) showLocation();

        input.setText( "" );
    }
    
    void showLocation() {
        boolean flag = false;

        desc.append( "\nLOCATION: "+player.getLocation().getName()+"\n" );
        if ( player.getLocation().beenHere()==false || verbose==true ) {
            desc.append( player.getLocation().getDescription()+"\n" );
            player.getLocation().beenHere(true);
        }
        
        flag = false; /* No exits found yet. */
        for ( Enumeration e = player.getLocation().getExits().elements();
            e.hasMoreElements(); )
        {
            Exit an_exit = (Exit)e.nextElement();
            if ( flag==true ) { /* If we have printed at least one dir... */
                if ( !e.hasMoreElements() ) { /* ...but there are no more after this one, */
                    desc.append( " and " ); /* ...we can print the final "and". */
                } else { /* Else there are more after this one... */
                    desc.append( ", " ); /* ...so just print a comma. */
                }
            }
            if ( flag==false) desc.append( "Obvious exits lead " );
            desc.append( an_exit.getDirectionName() );
            flag = true;
            if ( !e.hasMoreElements() ) desc.append( ".\n" );
        }
        if ( flag==false ) desc.append( "There are no obvious exits.\n" );

        flag = false; /* no items */
        desc.append( "You see " );
        for ( Enumeration e = player.getLocation().getItems().elements();
            e.hasMoreElements(); )
        {
            Item an_item = (Item)e.nextElement();
            if ( flag==true && !e.hasMoreElements() ) desc.append( "and " );
            desc.append( an_item.getName() );
            flag = true;
            if ( e.hasMoreElements() ) { /* More items? */
                desc.append( ", " );
            } else {
                desc.append( ".\n" );
            }
        }
        if ( !flag ) {
            desc.append( "nothing of interest.\n" );
        }
        // HACK
        if ( player.getLocation().getSound()!=null ) {
            desc.append( "[Background sound: "+player.getLocation().getSound()+"]\n" );
            //loop( player.getLocation().getSound() );
            soundPlayer.loop( player.getLocation().getSound() );
        }
    }

    public void init() {
        // Initialize Audio subsystem. Must pass in this Applet context.
        soundPlayer = new SoundPlayer(this);

        // Setup GUI
       	// Create a Grid Bag layout.
        GridBagLayout gridbag = new GridBagLayout();
        GridBagConstraints constraints = new GridBagConstraints();
        setLayout( gridbag );

        // Create a non-editable Text Area for game output.
        buildConstraints( constraints, 0,0, 2,1, 100,100 );
        constraints.fill = GridBagConstraints.BOTH;
	desc = new TextArea( "Welcome, foolish mortal.\n\n", 10, 80, TextArea.SCROLLBARS_VERTICAL_ONLY );
        desc.setEditable( false );
        gridbag.setConstraints( desc, constraints );
        add( desc );

        // Create a Text Label.
        buildConstraints( constraints, 0,1, 1,1, 0,0 );
        constraints.anchor = GridBagConstraints.EAST;
        Label label = new Label( "What do you want to do now? ", Label.LEFT );
        gridbag.setConstraints( label, constraints );
        add( label );
        
        // Create a Text Field for user input.
        buildConstraints( constraints, 1,1, 1,1, 100,0 );
        constraints.fill = GridBagConstraints.HORIZONTAL;
	input = new TextField();
        // And create a Listener to detect when the user types something.
        input.addActionListener( new TextAction() );
        gridbag.setConstraints( input, constraints );
        add( input );
        constraints.fill = GridBagConstraints.BOTH;
        
        // requestFocus();

        desc.append( "Loading game map and items...\n" );
        player = new CreateWorld( getCodeBase() );

        /* Display initial location. */
        showLocation();
    }
    // Another needed convienience function.
    public void buildConstraints( GridBagConstraints gbc, int gx, int gy,
        int gw, int gh, int wx, int wy ) {
        
        gbc.gridx = gx;
        gbc.gridy = gy;
        gbc.gridwidth = gw;
        gbc.gridheight = gh;
        gbc.weightx = wx;
        gbc.weighty = wy;
    }

    public void paint (Graphics g) {
        System.out.println( "paint() called." );
    }

    public void stop() {
        System.out.println( "stop() called." );
        soundPlayer.stopLoop();
    }
/*    
    public static void main(String[] argv) {
        Adventure adventure = new Adventure();
        adventure.init();
        //adventure.show();
    }
*/
}
