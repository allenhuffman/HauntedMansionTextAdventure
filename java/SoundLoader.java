import java.applet.*;
import java.net.URL;

class SoundLoader extends Thread {
    Applet	applet;
    SoundList	soundList;
    URL		baseURL;
    String	relativeURL;
    SoundPlayer	soundPlayer;
    
    public SoundLoader( Applet applet, SoundList soundList, URL baseURL, String relativeURL,
                        SoundPlayer soundPlayer ) {
        this.applet = applet;
        this.soundList = soundList;
        this.baseURL = baseURL;
        this.relativeURL = relativeURL;
        this.soundPlayer = soundPlayer;
        setPriority(MIN_PRIORITY);
        start();
    }

    public void run() {
        System.out.println( "Attempting to BACKGROUND load sound file '"+relativeURL+"'." );

        AudioClip audioClip = applet.getAudioClip(baseURL, relativeURL);
        
        if ( audioClip!=null ) { // If it loaded...
            soundList.putClip(audioClip, relativeURL); // Add clip to hash table.
            // snooze(5000);
            System.out.println( "Sound file '"+relativeURL+"' loaded." );
            // Hack?  Or legal?
            // Potential bug here.  Sound could take so long to load that user could enter another
            // zone and load that sound and have it start playing first, then the longer one would
            // complete and start playing.  A check should be done to see if this sound is still
            // supposed to be played.
            // Are we in the zone?
            if ( soundPlayer.zone.equals(relativeURL) ) {
                soundPlayer.stopLoop();
                soundPlayer.loopClip = audioClip;		// This is our current clip.
                soundPlayer.nowPlaying = relativeURL;	// And this is its name.
                soundPlayer.loopClip.loop();
                System.out.println( "Now playing sound file '"+soundPlayer.nowPlaying+"'." );
            }
        } else {
            // If it did not load...
            System.out.println( "Unable to load sound file '"+relativeURL+"'." );
        }
    }

    private void snooze( int zzz ) {
        try {
            Thread.sleep( zzz );
        } catch( InterruptedException e ) {}
    }
}
