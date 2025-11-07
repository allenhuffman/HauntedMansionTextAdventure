This document was created by GitHub A.I. Read with caution...

# Haunted Mansion Text Adventure

A Java-based text adventure game inspired by Disney's Haunted Mansion attraction, featuring atmospheric audio and faithful recreation of the mansion's iconic locations and mysteries.

## Overview

This interactive text adventure allows players to explore a virtual version of Disney's Haunted Mansion, complete with the famous rooms, supernatural encounters, and eerie atmosphere that makes the attraction so memorable. Built as a Java applet in 2002, it demonstrates classic adventure game mechanics with modern multimedia integration.

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
- **Text-based Commands** - Traditional adventure game interface
- **Inventory System** - Collect and use items throughout the mansion
- **Atmospheric Audio** - Location-specific background sounds and music
- **Puzzle Elements** - Solve mysteries and uncover secrets
- **Exploration** - Navigate freely between connected rooms

### Multimedia Integration
- **Background Audio** - Authentic atmospheric sounds for each location
- **Visual Elements** - Includes mansion map and GUI prototype
- **Java Applet Interface** - Web-browser playable experience

## Technical Architecture

### Core Game Engine
- **`Adventure.java`** - Main applet class and game controller
- **`CreateWorld.java`** - World generation and data loading system
- **`Player.java`** - Player state and inventory management
- **`Parse.java`** - Command parsing and natural language processing

### World System
- **`Location.java`** - Individual room/area implementation
- **`Exit.java`** - Movement connections between locations
- **`SpecialLocation.java`** - Locations with unique behaviors
- **`SpecialExit.java`** - Exits with special conditions or effects

### Item & Inventory
- **`Item.java`** - Base item class for objects in the game
- **`Inventory.java`** - Player inventory management
- **`ActionItem.java`** - Items with special behaviors
- **`carryable.java`** - Items that can be picked up

### Audio System
- **`SoundPlayer.java`** - Audio playback controller
- **`SoundLoader.java`** - Sound file loading and caching
- **`SoundList.java`** - Audio resource management

### User Interface
- **`Display.java`** - Text output and formatting
- **`GUI.java`** - Graphical user interface components

## Game Data

### World Configuration
- **`hm_map.csv`** - Room definitions, connections, and descriptions
- **`hm_items.csv`** - Item locations, properties, and descriptions
- **`audiolist.txt`** - Sound assignments for each location

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

### Audio Files (`.au` format)
- `foyer.au` - Foyer background music
- `ballroom.au` - Ballroom dancing music  
- `attic.au` - Attic ambient sounds
- `storm.au` - Thunder and lightning effects
- `doors.au` - Creaking door sounds
- `load.au` - Loading area atmosphere

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
EXAMINE item - Look at specific item
GET/TAKE     - Pick up items
DROP item    - Drop items from inventory
INVENTORY (I)- Show carried items
VERBOSE ON/OFF - Toggle detailed descriptions
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

### Web Browser (Original Method)
1. Open `adventure.html` in a Java-enabled web browser
2. Wait for the applet to load
3. Type commands in the text field
4. Explore the mansion!

### Modern Compatibility Notes
- Java applets are deprecated in modern browsers
- Consider converting to standalone Java application
- Audio format may need updating for current systems

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
