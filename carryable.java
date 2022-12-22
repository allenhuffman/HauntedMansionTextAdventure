public class Carryable extends Object {

    handleVerb( string verb ) {

        if ( verb.equalsIgnoreCase("GET") || verb.equalsIgnoreCase("TAKE") ) {
            boolean items = false;
            for (Enumeration e = player.getLocation().getObjects().elements();
                e.hasMoreElements(); )
            {
                Object an_object = (Object)e.nextElement();
                /* An object is here, see if this is what they want to take. */
                if ( an_object.getKeyword().equalsIgnoreCase(noun) ||
                    noun.equalsIgnoreCase("ALL") )
                {
                    // Set location to the location pointed to by exit
                    player.getLocation().removeObject(an_object);
                    player.addObject(an_object);
                    desc.append( an_object.getKeyword()+" taken.\n" );
                    items = true;
/*                    break; */
                    /* If "ALL" is given, I want it to keep scanning... */
                    e = player.getLocation().getObjects().elements(); /* HACK */
                }				
            } 
            if ( !items ) desc.append( "I don't see that here.\n" );
        }



        
    }
}
