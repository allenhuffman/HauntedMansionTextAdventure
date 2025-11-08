class SoundPlayer {
    constructor() {
        this.soundList = new SoundList();
        this.baseURL = "audio/";
        this.nowPlaying = null;    // Name of sound file currently playing.
        this.loopClip = null;      // Audio element that is currently playing.
        this.zone = null;          // Audio clip zone we are in.
        this.audioEnabled = false; // Track if user has interacted with page
    }

    // Enable audio after user interaction
    enableAudio() {
        this.audioEnabled = true;
        console.log("Audio enabled after user interaction");
        
        // If we're in a zone but not playing, try to start the audio
        if (this.zone && !this.nowPlaying) {
            console.log(`Attempting to start queued audio: ${this.zone}`);
            this.loop(this.zone);
        }
    }

    // Play the specified sound (looping). Load it if necessary.
    async loop(soundFile) {
        this.zone = soundFile; // We are now in this audio zone.
        if (soundFile === this.nowPlaying) { // Already playing this?
            console.log(`Already playing sound file '${soundFile}'.`);
            return;
        }

        // Check if audio is enabled (user has interacted)
        if (!this.audioEnabled) {
            console.log(`Audio not enabled yet. Sound '${soundFile}' will play after user interaction.`);
            return;
        }

        // See if we already have this clip loaded.
        console.log(`Checking to see if sound file '${soundFile}' has already been loaded.`);
        let audioClip = this.soundList.getClip(soundFile);
        
        if (audioClip === undefined) { // Not found, so we need to load it.
            // Load the audio file
            audioClip = await this.loadAudio(soundFile);
            if (audioClip) {
                this.soundList.putClip(audioClip, soundFile);
            } else {
                console.log(`Unable to load sound file '${soundFile}'.`);
                return;
            }
        } else {
            console.log(`Sound file '${soundFile}' already loaded.`);
        }

        // Check if we're still in the same zone (user might have moved)
        if (this.zone === soundFile) {
            this.stopLoop();
            this.loopClip = audioClip;    // This is our current clip.
            this.nowPlaying = soundFile;  // And this is its name.
            
            try {
                this.loopClip.loop = true;
                await this.loopClip.play();
                console.log(`Now playing sound file '${this.nowPlaying}'.`);
            } catch (error) {
                console.log(`Error playing sound file '${soundFile}': ${error.message}`);
            }
        }
    }

    async loadAudio(soundFile) {
        return new Promise((resolve) => {
            console.log(`Attempting to load sound file '${soundFile}'.`);
            
            const audio = new Audio();
            
            audio.oncanplaythrough = () => {
                console.log(`Sound file '${soundFile}' loaded.`);
                resolve(audio);
            };
            
            audio.onerror = () => {
                console.log(`Unable to load sound file '${soundFile}'.`);
                resolve(null);
            };
            
            // Try multiple formats - convert .au to more common formats
            const baseName = soundFile.replace('.au', '');
            
            // Try common web audio formats
            const formats = ['.mp3', '.ogg', '.wav'];
            let formatIndex = 0;
            
            const tryNextFormat = () => {
                if (formatIndex < formats.length) {
                    audio.src = this.baseURL + baseName + formats[formatIndex];
                    formatIndex++;
                } else {
                    console.log(`No compatible audio format found for '${soundFile}'.`);
                    resolve(null);
                }
            };
            
            audio.onerror = () => {
                tryNextFormat();
            };
            
            tryNextFormat();
        });
    }

    stopLoop() {
        if (this.loopClip !== null) { // Do we have a currently playing sound?
            console.log(`Halting current sound file '${this.nowPlaying}'.`);
            this.loopClip.pause();
            this.loopClip.currentTime = 0;
        }
    }
}