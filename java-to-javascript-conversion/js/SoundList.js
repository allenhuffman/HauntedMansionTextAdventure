class SoundList {
    constructor() {
        this.clips = new Map(); // Use Map instead of Hashtable
    }

    getClip(relativeURL) {
        return this.clips.get(relativeURL);
    }

    putClip(clip, relativeURL) {
        this.clips.set(relativeURL, clip);
    }
}