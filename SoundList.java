/*
* Code is the same in both 1.0 and 1.1.
 */

import java.applet.*;
import java.net.URL;

//Loads and holds a bunch of audio files whose locations are specified
//relative to a fixed base URL.
class SoundList extends java.util.Hashtable {

    public SoundList() {
        super(5); //Initialize Hashtable with capacity of 5 entries.
    }

    public AudioClip getClip(String relativeURL) {
        return (AudioClip)get(relativeURL);
    }

    public void putClip(AudioClip clip, String relativeURL) {
        put(relativeURL, clip);
    }
}
