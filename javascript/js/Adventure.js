class Adventure {
    constructor() {
        this.desc = null;          // TextArea equivalent
        this.input = null;         // TextField equivalent
        this.verbose = false;
        this.soundEnabled = true;  // Sound enabled by default
        this.player = null;        // CreateWorld instance
        this.soundPlayer = null;
        this.awaitingQuitConfirmation = false; // Track quit confirmation state
        this.commandRouter = null; // Command routing system
    }

    async init() {
        // Initialize Audio subsystem
        this.soundPlayer = new SoundPlayer();

        // Get references to HTML elements
        this.desc = document.getElementById('desc');
        this.input = document.getElementById('input');

        // Add event listener for input
        this.input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.textEntered();
            }
        });

        // Add click event to enable audio (browser autoplay policy)
        document.addEventListener('click', () => {
            if (this.soundPlayer) {
                this.soundPlayer.enableAudio();
            }
        }, { once: true });

        // Focus on input field
        this.input.focus();

        this.desc.value = "Welcome, foolish mortal, to the Haunted Mansion Adventure Game.\n\nLoading game map and items...\n\n(Type 'sound on/off' to enable/disable atmospheric audio.)\n";
        
        // Initialize the world
        this.player = new CreateWorld();
        const initResult = await this.player.init();
        
        // Initialize command routing system (only if CommandRouter is available)
        if (typeof CommandRouter !== 'undefined') {
            // Small delay to ensure all handler classes are loaded
            setTimeout(() => {
                console.log("Delayed CommandRouter initialization...");
                console.log("MovementHandler available:", typeof window.MovementHandler !== 'undefined');
                this.commandRouter = new CommandRouter(this);
                console.log("CommandRouter initialized with", this.commandRouter.handlers.length, "handlers");
            }, 100);
        }
        
        // Show any initialization errors in the game
        if (initResult && initResult.errors && initResult.errors.length > 0) {
            this.desc.value += "\n⚠️ GAME LOADING ISSUES:\n";
            for (const error of initResult.errors) {
                this.desc.value += "• " + error + "\n";
            }
            this.desc.value += "\nThe game may not function properly. Check the browser console for details.\n\n";
        }

        // Display initial location
        this.showLocation();
    }

    /**
     * Streamlined command processing using the new command handler system
     */
    textEntered() {
        let line = this.input.value;
        if (line.length === 0) return; // Ignore NULL lines...
        line = line.trim(); // Remove leading and trailing whitespace.
        
        // Parse the input
        const parser = new Parse();
        parser.parse(line);
        let verb = parser.getVerb();
        let noun = parser.getNoun();
        
        // Handle shortcuts using MovementHandler for direction shortcuts
        console.log("Original verb/noun:", verb, noun);
        
        // Process direction shortcuts (N->GO NORTH, etc.)
        const directionResult = MovementHandler.processDirectionShortcuts(verb, noun);
        verb = directionResult.verb;
        noun = directionResult.noun;
        
        // Handle other shortcuts
        if (verb && verb.toUpperCase() === "L") { verb = "LOOK"; noun = null; }
        if (verb && verb.toUpperCase() === "I") { verb = "INVENTORY"; noun = null; }
        console.log("After conversion verb/noun:", verb, noun);

        // Echo the command
        this.desc.value += ">" + line + "\n";
        
        let moved = false;
        
        // Try the new command routing system first
        if (this.commandRouter) {
            console.log("Router exists, checking canHandle for:", verb, noun);
            if (this.commandRouter.canHandle(verb, noun)) {
                console.log("Router can handle command, routing...");
                const result = this.commandRouter.route(verb, noun);
                console.log("Router result:", result);
                if (result.success) {
                    moved = result.moved;
                    // Command was handled successfully, skip fallback logic
                    if (moved) this.showLocation();
                    this.input.value = "";
                    this.desc.scrollTop = this.desc.scrollHeight;
                    return;
                }
                // If result.success is false, fall through to fallback logic
            } else {
                console.log("Router cannot handle command:", verb, noun);
            }
        } else {
            console.log("No command router available");
        }
        
        // Fallback for truly unhandled commands
        if (verb && noun) {
            this.desc.value += "I don't understand that command. Type HELP for available commands.\n";
        } else if (verb) {
            this.desc.value += "I don't understand that command. Type HELP for available commands.\n";
        } else {
            this.desc.value += "I have no idea what you are trying to do.\n";
        }
        
        // Show location if player moved
        if (moved) {
            this.showLocation();
        }
        
        this.input.value = "";
        
        // Auto-scroll to bottom
        this.desc.scrollTop = this.desc.scrollHeight;
    }

    showLocation() {
        let flag = false;

        this.desc.value += "\nLOCATION: " + this.player.getLocation().getName() + "\n";
        
        if (this.player.getLocation().beenHere() === false || this.verbose === true) {
            this.desc.value += this.player.getLocation().getDescription() + "\n";
            this.player.getLocation().beenHere(true);
        }

        flag = false; // No exits found yet.
        const allExits = this.player.getLocation().getExits();
        // Filter out exits that point to room 0 or null (blocked exits)
        const exits = allExits.filter(exit => exit.getLeadsTo() && exit.getLeadsTo().getId && exit.getLeadsTo().getId() !== 0);
        
        for (let i = 0; i < exits.length; i++) {
            const anExit = exits[i];
            if (flag === true) { // If we have printed at least one dir...
                if (i === exits.length - 1) { // ...but there are no more after this one,
                    this.desc.value += " and "; // ...we can print the final "and".
                } else { // Else there are more after this one...
                    this.desc.value += ", "; // ...so just print a comma.
                }
            }
            if (flag === false) this.desc.value += "Obvious exits lead ";
            this.desc.value += anExit.getDirectionName();
            flag = true;
            if (i === exits.length - 1) this.desc.value += ".\n";
        }
        if (flag === false) this.desc.value += "There are no obvious exits.\n";

        flag = false; // no items
        this.desc.value += "You see ";
        const items = this.player.getLocation().getItems();
        
        for (let i = 0; i < items.length; i++) {
            const anItem = items[i];
            if (flag === true && i === items.length - 1) this.desc.value += "and ";
            this.desc.value += anItem.getName();
            flag = true;
            if (i < items.length - 1) { // More items?
                this.desc.value += ", ";
            } else {
                this.desc.value += ".\n";
            }
        }
        if (!flag) {
            this.desc.value += "nothing of interest.\n";
        }
        
        // Location-based audio system
        if (this.soundEnabled) {
            if (this.player.getLocation().getSound() !== null) {
                // this.desc.value += "[Background sound: " + this.player.getLocation().getSound() + "]\n";
                this.soundPlayer.loop(this.player.getLocation().getSound());
            } else {
                // Stop audio in silent rooms
                this.soundPlayer.stopLoop();
            }
        }
        
        // Auto-scroll to bottom
        this.desc.scrollTop = this.desc.scrollHeight;
    }
}