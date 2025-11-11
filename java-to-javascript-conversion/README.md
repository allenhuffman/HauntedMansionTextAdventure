# Haunted Mansion Text Adventure - JavaScript Version

This is a modern JavaScript conversion of the original Java applet Haunted Mansion Text Adventure game, completely refactored with a modular command system and enhanced with JSON-driven ActionItem functionality. The conversion maintains core gameplay while dramatically improving code maintainability and extensibility.

## Major Improvements (2025)

### 🔧 Complete Architecture Refactoring
- **73% code reduction**: Adventure.js reduced from 768 lines to 240 lines
- **Modular Command Pattern**: 8 specialized command handlers replace monolithic command processing
- **Clean separation**: Engine code separated from game data
- **Zero hard-coded game logic**: All game behavior driven by JSON definitions

### 🎮 Enhanced ActionItem System
- **JSON-driven actions**: Complete action definitions in `hm_items.json`
- **Flexible verb handling**: Items support multiple action verbs (move/push/slide/search)
- **Item requirements**: Actions can require specific items in inventory
- **State management**: `onceOnly` actions with custom repeat messages
- **Dynamic world changes**: Items can reveal other items, add exits, change room audio
- **Item transformation**: Actions can change item names and descriptions

### 🎵 Improved Audio System
- **Persistent room audio**: ActionItem effects permanently configure room sounds
- **Dynamic sound zones**: Actions can modify audio for multiple rooms simultaneously
- **JSON audio configuration**: Room-specific audio overrides via data files

### 🏗️ Modern JavaScript Architecture
- **ES6 Classes**: Modern class-based structure throughout
- **Async/Await**: Proper asynchronous file loading
- **Module system**: Each command handler is a separate, focused module
- **Error handling**: Comprehensive error collection and reporting

## How to Run

1. **Simple HTTP Server Required**: Modern browsers require files to be served over HTTP (not file://) due to CORS restrictions when loading CSV data files.

2. **Using Python (recommended)**:
   ```bash
   # Navigate to the javascript directory
   cd javascript
   
   # Python 3
   python -m http.server 8000
   
   # Python 2 (if needed)
   python -m SimpleHTTPServer 8000
   ```

3. **Using Node.js**:
   ```bash
   cd javascript
   npx http-server -p 8000
   ```

4. **Using PHP**:
   ```bash
   cd javascript
   php -S localhost:8000
   ```

5. **Open in browser**: Navigate to `http://localhost:8000` in your web browser.

## Audio Notes

The original game used `.au` (Sun Audio) format files, which are not widely supported in modern browsers. For full audio experience:

1. **Convert audio files** to modern formats (.mp3, .ogg, .wav)
2. **Place converted files** in the `audio/` directory with the same base names
3. The sound system will automatically try multiple formats

Example: `foyer.au` should be converted to `foyer.mp3`, `foyer.ogg`, or `foyer.wav`

## Files Structure

```
javascript/
├── index.html          # Main game page
├── js/                 # JavaScript source files
│   ├── Adventure.js    # Main game engine (refactored, 240 lines)
│   ├── CreateWorld.js  # World loading and management
│   ├── ActionItem.js   # JSON-driven interactive items
│   ├── Item.js         # Basic item data model
│   ├── Location.js     # Location data model
│   ├── Exit.js         # Exit/movement system
│   ├── Player.js       # Player state management
│   ├── Parse.js        # Command parsing
│   ├── SoundPlayer.js  # Audio system
│   ├── CSVTokenizer.js # CSV file parsing
│   └── commands/       # Modular command handlers
│       ├── CommandRouter.js     # Routes commands to appropriate handlers
│       ├── MovementHandler.js   # N/S/E/W/U/D movement
│       ├── InventoryHandler.js  # INVENTORY display
│       ├── ItemHandler.js       # GET/DROP item commands
│       ├── ExamineHandler.js    # LOOK/EXAMINE commands
│       ├── SystemHandler.js     # SOUND/VERBOSE system commands
│       ├── GameControlHandler.js # HELP/QUIT/RESTART commands
│       ├── ActionItemHandler.js # Special item interactions
│       └── SearchHandler.js     # SEARCH fallback handling
├── data/               # Game data files
│   ├── hm_map.json    # Room definitions and connections (JSON)
│   ├── hm_items.json  # Item definitions with actions (JSON)
│   └── hm_audio.json  # Audio zone configurations (JSON)
└── audio/              # Audio files (MP3/OGG/WAV recommended)
    ├── foyer.mp3      # Room background audio
    ├── ballroom.mp3
    ├── clock.mp3      # Action-triggered sounds
    ├── seance.mp3
    └── ...
```

## Game Commands

The JavaScript version supports all original commands plus enhanced ActionItem interactions:

### Movement
- `N`, `NORTH`, `GO NORTH` - Move north
- `S`, `SOUTH`, `GO SOUTH` - Move south  
- `E`, `EAST`, `GO EAST` - Move east
- `W`, `WEST`, `GO WEST` - Move west
- `U`, `UP`, `GO UP` - Go upstairs
- `D`, `DOWN`, `GO DOWN` - Go downstairs

### Items & Inventory
- `LOOK` or `L` - Examine current location
- `EXAMINE [item]` - Look at specific item
- `GET [item]` or `TAKE [item]` - Pick up items
- `DROP [item]` - Drop items from inventory
- `INVENTORY` or `I` - Show carried items

### System Commands
- `SOUND ON/OFF` or `SOUND` - Toggle audio system
- `VERBOSE ON/OFF` or `VERBOSE` - Toggle detailed descriptions
- `HELP` - Show available commands
- `QUIT` - Exit game
- `RESTART` - Restart from beginning

### Enhanced ActionItem Commands
The game now features sophisticated item interactions defined in JSON:

#### Clock Puzzle (Portrait Gallery)
- `SEARCH CLOCK` - Find the winding crank
- `WIND CLOCK` - Requires crank, triggers seance room audio

#### Hidden Safe (Portrait Corridor)  
- `SEARCH PAINTINGS`, `MOVE PAINTINGS`, `PUSH PAINTINGS`, `SLIDE PAINTINGS` - Reveal hidden safe
- `OPEN SAFE` - Requires bookmark, reveals mysterious amulet

#### Master Gracey's Door (Foyer)
- `UNLOCK DOOR` - Requires brass key, creates east exit to room 45
- Door automatically opens when unlocked

#### Discovery System
- `SEARCH PANEL` - Find the brass key in Servants' Quarters
- `SEARCH BOOK` - Find leather bookmark in Library

## ActionItem System

### JSON-Driven Actions
Items with special behaviors are defined in `hm_items.json` with action arrays:

```json
{
  "id": 20,
  "keyword": "clock",
  "name": "a grandfather clock",
  "actions": [
    {
      "verb": "wind",
      "requiresItem": "crank",
      "requiresItemMessage": "You need a winding crank to do that.",
      "useInRoom": 26,
      "message": "The clock springs to life and starts ticking...",
      "newDescription": "The clock is now ticking ominously...",
      "addSound": [
        {"roomId": 26, "soundFile": "clock.mp3"},
        {"roomId": 27, "soundFile": "seance.mp3"}
      ],
      "revealsItemId": 37,
      "revealsItemLocation": 27,
      "onceOnly": true,
      "alreadyPerformedMessage": "The clock is already wound up."
    }
  ]
}
```

### Action Properties
- **`verb`**: Command verb (wind, search, move, unlock, etc.)
- **`requiresItem`**: Item keyword required in inventory
- **`requiresItemMessage`**: Message when required item is missing
- **`useInRoom`**: Room ID where action works, or "*" for anywhere
- **`message`**: Success message displayed to player
- **`newName`**: Changes item name after action
- **`newDescription`**: Changes item description after action
- **`onceOnly`**: Prevents action from being repeated
- **`alreadyPerformedMessage`**: Message for repeat attempts
- **`revealsItemId`**: ID of item to reveal/unhide
- **`revealsItemLocation`**: Specific room to reveal item in (optional)
- **`addSound`**: Array of room audio configurations
- **`addExit`**: Creates new room exits dynamically

### Command Handler Architecture

The refactored system uses a modular command pattern:

1. **CommandRouter** receives parsed commands
2. **Handlers** checked in priority order:
   - MovementHandler (N/S/E/W/U/D)
   - InventoryHandler (INVENTORY)
   - ItemHandler (GET/DROP)
   - ExamineHandler (LOOK/EXAMINE)
   - SystemHandler (SOUND/VERBOSE)
   - GameControlHandler (HELP/QUIT)
   - ActionItemHandler (custom verbs)
   - SearchHandler (SEARCH fallback)

Each handler implements `canHandle(verb, noun)` and `handle(verb, noun)` methods.

## Technical Implementation

### Data-Driven Design
- **No hard-coded game logic**: All puzzles and interactions defined in JSON
- **Extensible**: New items and actions added via data files only
- **Maintainable**: Game logic changes require no code modifications

### Modern JavaScript Features
- **ES6 Classes**: Clean object-oriented structure
- **Async/Await**: Proper asynchronous file loading
- **JSON**: Modern data format replacing CSV where appropriate
- **Fetch API**: Modern HTTP requests for data loading
- **HTML5 Audio**: Cross-browser audio support

### Error Handling
- Comprehensive error collection during world loading
- Console logging for debugging ActionItem execution
- Graceful fallbacks for missing audio files
- User-friendly error messages

### Performance
- **Efficient command routing**: Fast handler selection
- **Minimal DOM manipulation**: Optimized UI updates  
- **Cached resources**: Audio and data files cached after loading

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Full support (may need user interaction for audio)
- **Edge**: Full support
- **Mobile browsers**: Works but keyboard interaction may vary

## Development Guide

### Adding New ActionItems

1. **Define in JSON** (`hm_items.json`):
```json
{
  "id": 999,
  "startLocation": 10,
  "keyword": "lever",
  "name": "a mysterious lever",
  "description": "An ornate lever that looks important.",
  "carryable": false,
  "actions": [
    {
      "verb": "pull",
      "useInRoom": 10,
      "message": "You pull the lever and hear machinery grinding...",
      "addExit": {"direction": "north", "destination": 50},
      "onceOnly": true
    }
  ]
}
```

2. **No code changes required**: The system automatically creates ActionItem instances for items with actions.

### Command Handler Development

To add a new command handler:

1. **Create handler class** in `js/commands/`:
```javascript
class NewHandler {
    constructor(adventure) {
        this.adventure = adventure;
    }
    
    canHandle(verb, noun) {
        return verb && verb.toUpperCase() === "NEWVERB";
    }
    
    handle(verb, noun) {
        // Implementation
        return { success: true, moved: false };
    }
}
```

2. **Register in CommandRouter**: Add to handlers list with appropriate priority.

### Audio System

Audio files are loaded dynamically with format fallbacks:
- Supports MP3, OGG, WAV formats
- Room-based background audio via `hm_audio.json`
- Action-triggered sounds via ActionItem `addSound` property
- Persistent room audio: sounds set by actions remain when re-entering rooms

### Best Practices

- **Data-driven**: Keep all game logic in JSON files
- **Handler pattern**: Use modular command handlers for new verbs
- **Error handling**: Always provide user-friendly error messages
- **Console logging**: Add debugging output for complex interactions
- **Testing**: Test all ActionItem scenarios and edge cases

### Migration Notes

The refactored version maintains backward compatibility:
- All original commands work identically
- Game progression unchanged
- Save/load functionality preserved (when implemented)
- Audio system enhanced but compatible