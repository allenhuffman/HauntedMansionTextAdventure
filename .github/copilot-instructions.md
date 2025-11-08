# Haunted Mansion Text Adventure - AI Coding Guide

## Project Overview
This is a Java applet-based text adventure game (circa 2002) recreating Disney's Haunted Mansion. The architecture uses CSV-driven world generation, command parsing, and atmospheric audio integration.

## Core Architecture

### Game Engine Flow
1. **Adventure.java** - Main applet controller with UI and command processing
2. **CreateWorld.java** - Initializes world from CSV files, manages player state
3. **Parse.java** - Simple verb/noun command parser
4. **Player movement/inventory** - Handled directly in Adventure.java's `textEntered()` method

### Data-Driven World System
- **hm_map.csv**: Room definitions with 6-directional exits (N,S,W,E,U,D), names, descriptions
- **hm_items.csv**: Item placement, properties, carryability flags
- **Sound zones**: Hardcoded in CreateWorld.java constructor (see tempLocation[].setSound() calls)

### CSV Format Patterns
```java
// Map: RoomID,N,S,W,E,U,D,Name,Description
// Items: LocationID,Keyword,Name,Description,Carryable(true/false)
// Audio zones are hardcoded by room number in CreateWorld.java
```

## Critical Implementation Details

### Command Processing Architecture
- All command logic lives in `Adventure.textEntered()` - a single large method
- Direction shortcuts (N→GO NORTH, L→LOOK, I→INVENTORY) transformed early
- Movement uses `Enumeration` loops over location exits
- Inventory operations iterate through Vector collections

### Audio System Pattern
```java
// Audio is location-based, managed by SoundPlayer class
// Files: foyer.au, ballroom.au, attic.au, storm.au, etc.
// Zones hardcoded in CreateWorld constructor by room number
tempLocation[1].setSound("foyer.au");  // Room 1 = foyer music
```

### Vector-Based Collections
- Pre-generics Java: `Vector` instead of `ArrayList<>`
- `Enumeration` iteration pattern used throughout
- No modern collection utilities - manual loops everywhere

## Development Patterns

### File Organization
- No packages - all classes in default package
- Separate concerns: Location/Exit/Item as data objects, Adventure as controller
- CSV parsing via custom `CSVTokenizer` class
- Sound loading via background `SoundLoader` threads

### Memory Management
- Temporary arrays cleared via scope blocks (see CreateWorld constructor)
- Audio clips cached in `SoundList` to avoid reloading
- Location/Item relationships managed through Vector references

### Command Verb Handling
```java
// Main verbs: GO, LOOK/EXAMINE, GET/TAKE, DROP, INVENTORY, VERBOSE
// All implemented as if/else chain in textEntered()
// Movement checks exits first, then special items (commented out)
```

## Key Files for Understanding

### Core Engine
- `Adventure.java` - UI, command processing, game loop
- `CreateWorld.java` - World loading, player state, sound zone mapping
- `Location.java`/`Exit.java`/`Item.java` - Data model objects

### Data Files
- `hm_map.csv` - Room layout and connections (54 rooms)
- `hm_items.csv` - Item placement and properties (25 items)
- `audiolist.txt` - Sound design notes (not programmatically used)

### Audio System
- `SoundPlayer.java` - Audio playback controller with background loading
- `SoundLoader.java` - Threaded audio file loading
- `*.au` files - Sun Audio format for Java applet compatibility

## Development Environment Notes
- Java 1.4.1 era code - no generics, older AWT/Swing patterns
- Applet-based - requires `getCodeBase()` for resource loading
- GridBagLayout for UI positioning
- Manual memory management patterns

## Testing & Debugging
- Use `System.out.println()` for debug output (no modern logging)
- Audio loading happens in background threads - check console for load status
- Room navigation issues often stem from CSV exit number mismatches
- Item interaction requires exact keyword matching (case-insensitive)

## Common Modification Patterns
- **New rooms**: Add to hm_map.csv, update exit connections
- **New items**: Add to hm_items.csv with location ID
- **Audio zones**: Hardcode in CreateWorld constructor
- **Commands**: Extend if/else chain in Adventure.textEntered()
- **UI changes**: Modify GridBagLayout constraints in Adventure.init()

## Disney Haunted Mansion Fidelity
The game recreates specific attraction rooms: Portrait Gallery (stretching room), Foyer, Ballroom, Attic, Seance Circle, Graveyard. Room descriptions and item placement follow attraction storyline and visual elements.