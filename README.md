This document was created by GitHub A.I. Read with caution...

# Haunted Mansion Text Adventure

A text adventure game inspired by Disney's Haunted Mansion attraction, featuring atmospheric audio and faithful recreation of the mansion's iconic locations and mysteries. Originally built as a Java applet in 2002, now modernized with JavaScript ES6 and enhanced with advanced interactive features.

## Project Structure

- **`java/`** - Original 2002 Java applet implementation with CSV data and .au audio files
- **`javascript/`** - Modern 2025 JavaScript version with JSON data, MP3 audio, and enhanced features
- **`java-to-javascript-conversion/`** - Development notes and conversion documentation

## Game Map

### Visual References
- **[`HauntedMansionMap.png`](HauntedMansionMap.png)** - Original visual layout of the mansion
- **[`GameMap.md`](GameMap.md)** - Detailed ASCII art map with room connections and analysis
- **[`InteractiveMap.html`](InteractiveMap.html)** - Interactive web-based map with clickable rooms

The mansion contains **52 rooms** across **3 floors** (plus attic), with complex vertical connections via staircases. Key areas include the Grand Ballroom complex, mysterious Seance Room, hidden Secret Rooms, and the final Attic confrontation with the Ghostly Bride.

## Overview

This interactive text adventure allows players to explore a virtual version of Disney's Haunted Mansion, complete with the famous rooms, supernatural encounters, and eerie atmosphere that makes the attraction so memorable. Originally built as a Java applet in 2002, the game has been modernized with JavaScript ES6, featuring enhanced interactive systems, data-driven configuration, and improved user experience.

## Features

### Faithful Location Recreation
- **Portrait Gallery** - Watch portraits age before your eyes
- **Foyer** - Experience the flickering candles and organ music
- **Grand Ballroom** - Witness the ghostly dancing and hear the phantom organ
- **Attic** - Explore the mansion's mysterious upper levels  
- **Seance Circle** - Encounter supernatural phenomena
- **Graveyard** - Navigate the outdoor cemetery areas
- **And many more iconic locations from the attraction**

### Interactive Gameplay
- **Text-based Commands** - Traditional adventure game interface with modern enhancements
- **ActionItem System** - Advanced item interactions with verb/noun combinations
- **Dynamic World** - Items can unlock doors, reveal secrets, and modify the game world
- **Hidden Item System** - Pre-defined items revealed through searching and exploration
- **Inventory System** - Collect and use items throughout the mansion
- **Atmospheric Audio** - Location-specific background sounds and music with user control
- **Puzzle Elements** - Solve mysteries, unlock doors, and uncover secrets
- **Exploration** - Navigate freely between connected rooms with dynamic exits

### Multimedia Integration
- **Background Audio** - Authentic atmospheric sounds for each location with MP3 support
- **Audio Control** - Player-controlled sound on/off with dynamic zone management
- **Silent Rooms** - Strategic audio design with dramatic silence for atmospheric effect
- **Modern Web Interface** - JavaScript-based game running in modern browsers
- **Error Handling** - In-game feedback for configuration issues and loading errors

## Technical Architecture

### Modern JavaScript Implementation
- **`javascript/js/Adventure.js`** - Main game engine with enhanced command processing and ActionItem integration
- **`javascript/js/CreateWorld.js`** - World generation, JSON data loading, and hidden item management
- **`javascript/js/Item.js`** - Enhanced item class with ActionItem functionality and action tracking
- **`javascript/js/Location.js`** - Room management with dynamic exit modification support
- **`javascript/js/Parse.js`** - Command parsing and natural language processing

### Legacy Java Implementation
- **`java/Adventure.java`** - Original applet class and game controller
- **`java/CreateWorld.java`** - World generation and data loading system
- **`java/Player.java`** - Player state and inventory management
- **`java/Parse.java`** - Command parsing and natural language processing

### World System
- **`java/Location.java`** - Individual room/area implementation
- **`java/Exit.java`** - Movement connections between locations
- **`java/SpecialLocation.java`** - Locations with unique behaviors
- **`java/SpecialExit.java`** - Exits with special conditions or effects

### Item System
- **`java/Item.java`** - Base item class for objects in the game
- **`java/Inventory.java`** - Player inventory management
- **`java/ActionItem.java`** - Items with special behaviors
- **`java/carryable.java`** - Items that can be picked up

### Audio System (JavaScript)
- **`javascript/js/SoundPlayer.js`** - Modern web audio controller with MP3 support and user interaction compliance
- **`javascript/js/SoundList.js`** - Audio resource management and caching
- **Data-driven Audio** - JSON configuration for flexible audio zone management

### Audio System (Legacy Java)
- **`java/SoundPlayer.java`** - Audio playback controller
- **`java/SoundLoader.java`** - Sound file loading and caching
- **`java/SoundList.java`** - Audio resource management

### User Interface
- **`java/Display.java`** - Text output and formatting
- **`java/GUI.java`** - Graphical user interface components

## Game Data

### Modern JSON Configuration
- **`javascript/data/hm_map.json`** - Room definitions, connections, and descriptions in structured JSON
- **`javascript/data/hm_items.json`** - Enhanced item system with ActionItem support, hidden items, and complex interactions
- **`javascript/data/hm_audio.json`** - Data-driven audio zone configuration with silent room support

### Developer Documentation
- **[`javascript/data/ITEMS-README.md`](javascript/data/ITEMS-README.md)** - Complete guide to the item system, ActionItem capabilities, and smart matching
- **[`javascript/data/LOCATIONS-README.md`](javascript/data/LOCATIONS-README.md)** - Room design guide, navigation system, and best practices

### Legacy CSV Configuration  
- **`java/hm_map.csv`** - Original room definitions, connections, and descriptions
- **`java/hm_items.csv`** - Original item locations, properties, and descriptions
- **`java/audiolist.txt`** - Original sound assignments documentation

### Map Structure (Sample)
```csv
RoomID,N,S,W,E,U,D,Name,Description
2,0,0,0,0,0,0,Foyer,"You are standing in the foyer of the Mansion..."
3,1,0,12,0,0,Portrait Gallery,"You are in a large portrait gallery..."
```

### Item Format
```csv
LocationID,ItemName,ShortDesc,LongDesc,Carryable
9,"book","a hardback book","Edgar Allan Poe collection...",true
```

## Audio Experience

### Location-Specific Sounds
- **Foyer** - Haunting organ music
- **Ballroom** - Mad waltz and phantom dancing
- **Attic** - Creaking floorboards and mysterious sounds
- **Graveyard** - Ghostly choir and supernatural effects
- **Loading Zone** - Spectral winds and ghostly bells

### Audio Files (Modern MP3 format)
- `javascript/audio/foyer.mp3` - Foyer background music
- `javascript/audio/ballroom.mp3` - Ballroom dancing music  
- `javascript/audio/attic.mp3` - Attic ambient sounds
- `javascript/audio/atticledge.mp3` - Attic ledge overlook atmosphere
- `javascript/audio/storm.mp3` - Thunder and lightning effects
- `javascript/audio/doors.mp3` - Creaking door sounds
- `javascript/audio/load.mp3` - Loading area atmosphere

### Legacy Audio Files (`.au` format)
- `java/foyer.au` - Original foyer background music
- `java/ballroom.au` - Original ballroom dancing music  
- `java/attic.au` - Original attic ambient sounds
- `java/atticledge.au` - Original attic ledge atmosphere
- `java/storm.au` - Original thunder and lightning effects
- `java/doors.au` - Original door sound effects
- `java/load.au` - Original loading area atmosphere

## Commands & Controls

### Movement Commands
```
N, NORTH     - Move north
S, SOUTH     - Move south  
E, EAST      - Move east
W, WEST      - Move west
U, UP        - Go upstairs
D, DOWN      - Go downstairs
```

### Interaction Commands
```
LOOK         - Examine current location
EXAMINE item - Look at specific item (fallback support for any item)
SEARCH item  - Search items for hidden objects (fallback support for any item)
GET/TAKE     - Pick up items (supports GET ALL)
DROP item    - Drop items from inventory (supports DROP ALL)
INVENTORY (I)- Show carried items
VERBOSE ON/OFF - Toggle detailed descriptions
SOUND ON/OFF - Control atmospheric audio
HELP         - Display command reference
QUIT         - Exit game with confirmation (YES/NO/RESTART options)
```

### Enhanced ActionItem Commands
```
READ book    - Read books and documents
SEARCH book  - Find hidden bookmarks and secrets
UNLOCK door  - Use keys to unlock doors  
LOCK door    - Lock doors with keys
CLIMB ladder - Use ladder in specific rooms
MOVE/PUSH painting - Reveal hidden safes
OPEN safe    - Open safes with required items
LISTEN door/raven - Atmospheric audio interactions
```

### Debug Commands
```
GOTO <room>  - Teleport to any room by number (debug mode)
```

### Shortcuts
- **L** - LOOK
- **I** - INVENTORY  
- **N/S/E/W/U/D** - Direction shortcuts

## Development History

### Version Information
- **Created**: November 22, 2002
- **Language**: Java (J2SE 1.4.1 era)
- **Platform**: Java Applet for web browsers
- **Author**: Allen Huffman
- **Technical Assistance**: Vaughn Cato

### Implementation Notes
- Uses CSV data files for easy content modification
- Implements classic text adventure parsing
- Includes multimedia capabilities rare for text adventures of the era
- Designed for cross-platform web deployment

## Technical Requirements

### Development Environment
- Java Development Kit (JDK 1.4.1 or later)
- Web browser with Java applet support
- Audio system for `.au` file playback

### File Structure
```
Adventure.jar        - Compiled applet archive
adventure.html       - Game launcher page
HauntedMansionMap.png - Visual map reference
*.java              - Source code files
*.csv               - Game data files  
*.au                - Audio assets
```

## Running the Game

### Modern JavaScript Version (Recommended)
1. Start a local web server in the JavaScript directory:
   ```bash
   cd javascript
   python3 -m http.server 8080
   ```
2. Open `http://localhost:8080` in any modern web browser
3. Click anywhere to enable atmospheric audio
4. Type commands in the text field and explore the mansion!

### Legacy Java Applet Version
1. Navigate to the Java directory and open `adventure.html` in a Java-enabled web browser (legacy browsers only)
   ```bash
   cd java
   # Open adventure.html in legacy browser
   ```
2. Wait for the applet to load
3. Type commands in the text field
4. Explore the mansion!

### Modern Enhancements
- ✅ **No Java required** - Runs in any modern web browser
- ✅ **MP3 audio support** - Compatible with current audio standards  
- ✅ **Enhanced error handling** - In-game feedback for configuration issues
- ✅ **Improved user experience** - Better command fallbacks and help system
- ✅ **Data-driven design** - Easy content modification through JSON files

## Modern Enhancements (2025)

### ActionItem System
- **Multiple Verb Support** - Single actions respond to multiple verbs: `"PUSH,PULL,MOVE"`
- **Complex Interactions** - Items can respond to multiple verbs (READ, SEARCH, UNLOCK, CLIMB, etc.)
- **Room-Specific Actions** - Items behave differently in different locations
- **Requirement System** - Actions can require specific items in inventory
- **Once-Only Actions** - Prevent repetition with custom messages for already-performed actions
- **Dynamic World Changes** - Items can unlock doors, reveal hidden items, and modify descriptions

### Enhanced Command Processing
- **Smart Item Matching** - Whole-word matching system finds items by any word in their name
- **Fallback Support** - EXAMINE and SEARCH work on any item, even without custom actions
- **Grammar Intelligence** - Automatic article stripping for better message grammar
- **Command Shortcuts** - Single-letter shortcuts (N, S, E, W, U, D, I, L)
- **Comprehensive Help** - Built-in HELP command with complete command reference
- **Graceful Quit** - QUIT command with confirmation options (YES/NO/RESTART)

### Hidden Item System
- **Pre-defined Secrets** - Items stored in "limbo" (room 0) awaiting discovery
- **Search Mechanics** - Find hidden bookmarks, keys, and mysterious objects
- **Debug Support** - Hidden items visible with GOTO 0 command for testing
- **Reveal Tracking** - Items properly move from hidden state to active locations

### Audio Management
- **Data-Driven Configuration** - JSON-based audio zone assignments
- **User Control** - SOUND ON/OFF command with immediate feedback
- **Silent Rooms** - Strategic silence for dramatic atmospheric effect
- **Modern Format Support** - MP3 audio instead of deprecated .au format
- **Smart Stopping** - Audio stops in silent rooms, resumes with new zones

### Error Handling & User Experience
- **In-Game Error Messages** - JSON parsing errors displayed to players
- **Graceful Degradation** - Game continues even with configuration errors
- **Real-Time Validation** - Console feedback for debugging and development
- **User-Friendly Messages** - Clear instructions and helpful feedback

## Game Features

### Puzzle Elements
- **Secret Items** - Hidden objects that advance the story
- **Portrait Mystery** - Dueling gentlemen paintings  
- **Seance Circle** - Supernatural communication
- **Birthday Cake** - Dining room mysteries
- **Cryptic Scroll** - Navigation puzzles with directional clues

### Atmospheric Details
- **Dynamic Descriptions** - Portraits that age and change
- **Environmental Storytelling** - Each room tells part of the mansion's story
- **Interactive Objects** - Examine furniture, paintings, and mansion details
- **Supernatural Events** - Ghostly manifestations and mysterious occurrences

## Disney Inspiration

This game faithfully recreates many elements from Disney's Haunted Mansion attraction:
- **999 Happy Haunts** theme and atmosphere
- **Portrait Gallery** stretching room concept
- **Ballroom** dancing ghosts scene
- **Attic** mysterious bride storyline
- **Graveyard** singing busts and ghostly residents

---

*Experience the chills and thrills of Disney's most beloved haunted attraction from the comfort of your computer. Will you uncover all the mansion's mysteries, or will you become its 1000th happy haunt?*
