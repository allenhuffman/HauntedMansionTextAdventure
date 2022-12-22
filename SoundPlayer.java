/*
* Code is the same in both 1.0 and 1.1.
 */

import java.applet.*;
import java.net.URL;

class SoundPlayer {
    Applet 	applet;
    SoundList 	soundList;
    URL 	baseURL;
    String 	relativeURL;

    String	nowPlaying;	// Name of sound file currently playing.
    AudioClip	loopClip;	// Clip that is currently playing.
    String	zone;		// Audio clip zone we are in.

    SoundPlayer(Applet applet) {
        this.applet = applet;
        soundList = new SoundList();
        this.baseURL = applet.getCodeBase();
    }
    
    // Play the specified sound (looping). Load it if necessary.
    public void loop( String soundFile ) {
        zone = soundFile; // We are now in this audio zone.
        if ( soundFile.equals(nowPlaying) ) { // Already playing this?
            System.out.println( "Alreadying playing sound file '"+soundFile+"'." );
            return;
        }
        // See if we already have this clip loaded.
        System.out.println( "Checking to see if sound file '"+soundFile+"' has already been loaded." );
        AudioClip audioClip = soundList.getClip( soundFile );
        if ( audioClip==null ) { // Not found, so we need to load it.
            // Create a new background thread to do the loading.
            new SoundLoader( applet, soundList, baseURL, soundFile, this );
            return; 		// We outta here...
        } else {
            System.out.println( "Sound file '"+soundFile+"' already loaded." );
        }
        // If here, soundFile is the name of what we want to be playing,
        // and audioClip is the handle to that audio clip.
        stopLoop();
        loopClip = audioClip;	// This is our current clip.
        nowPlaying = soundFile;	// And this is its name.
        loopClip.loop();
        System.out.println( "Now playing sound file '"+nowPlaying+"'." );
        return;        
    }

    public void stopLoop() {
        if ( loopClip!=null ) {	// Do we have a currently playing sound?
            System.out.println( "Halting current sound file '"+nowPlaying+"'." );
            loopClip.stop();	// Yes.  Make it shhh!
        }        
    }

    private void snooze( int time ) {
        try {
            Thread.sleep( time );
        } catch( InterruptedException e) {}
    }
}
