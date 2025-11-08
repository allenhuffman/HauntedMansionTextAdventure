# Haunted Mansion Text Adventure - JavaScript Version

This is a modern JavaScript conversion of the original Java applet Haunted Mansion Text Adventure game. The conversion maintains identical gameplay and behavior to the original while making it compatible with modern web browsers.

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
├── test.html           # Debug/testing page
├── audio-test.html     # Audio system testing page
├── js/                 # JavaScript source files
│   ├── Adventure.js    # Main game engine
│   ├── CreateWorld.js  # World loading and management
│   ├── Location.js     # Location data model
│   ├── SpecialLocation.js # Special locations with custom exits
│   ├── Exit.js         # Exit/movement system
│   ├── SpecialExit.js  # Special exits with custom actions
│   ├── Item.js         # Item data model
│   ├── ActionItem.js   # Special items that transport player
│   ├── Inventory.js    # Player inventory
│   ├── Player.js       # Player class (alternative to CreateWorld player)
│   ├── World.js        # Alternative world management class
│   ├── Parse.js        # Command parsing
│   ├── CSVTokenizer.js # CSV file parsing
│   ├── SoundPlayer.js  # Audio system
│   ├── SoundList.js    # Audio management
│   ├── Carryable.js    # Early command handling (unused)
│   ├── GUI.js          # GUI helper class (unused in web)
│   └── Display.js      # Display management (unused in web)
├── data/               # Game data files
│   ├── hm_map.csv     # Room definitions and connections
│   └── hm_items.csv   # Item locations and properties
└── audio/              # Audio files
    ├── foyer.au       # Original Sun Audio files
    ├── foyer.mp3      # Converted MP3 files
    ├── ballroom.au
    ├── ballroom.mp3
    └── ...
```

## Game Commands

The JavaScript version supports all original commands:

### Movement
- `N`, `NORTH` - Move north
- `S`, `SOUTH` - Move south  
- `E`, `EAST` - Move east
- `W`, `WEST` - Move west
- `U`, `UP` - Go upstairs
- `D`, `DOWN` - Go downstairs

### Interaction
- `LOOK` or `L` - Examine current location
- `EXAMINE [item]` - Look at specific item
- `GET [item]` or `TAKE [item]` - Pick up items
- `GET ALL` or `TAKE ALL` - Pick up all items
- `DROP [item]` - Drop items from inventory
- `DROP ALL` - Drop all items
- `INVENTORY` or `I` - Show carried items
- `VERBOSE ON/OFF` - Toggle detailed descriptions

## Technical Notes

### Conversion Approach
- **Direct translation**: Each Java class converted to equivalent JavaScript class
- **Identical logic**: Command processing, world loading, and game mechanics preserved exactly
- **Modern features**: Uses `fetch()` for CSV loading, HTML5 Audio API, ES6 classes
- **Browser compatibility**: Works in modern browsers (Chrome, Firefox, Safari, Edge)

### Key Differences from Java Original
- **Asynchronous loading**: CSV and audio files load asynchronously
- **No applet container**: Runs directly in browser without Java plugin
- **Modern audio**: HTML5 Audio API instead of Java AudioClip
- **Responsive UI**: CSS-styled interface instead of GridBagLayout
- **Complete class conversion**: All Java classes converted, including unused ones
- **Enhanced functionality**: Supports ActionItems and SpecialLocations for future features

### Debugging
- Open browser Developer Tools (F12) to see console messages
- Audio loading and zone changes are logged to console
- CSV parsing errors and game state logged for debugging

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Full support (may need user interaction for audio)
- **Edge**: Full support
- **Mobile browsers**: Works but keyboard interaction may vary

## Development

The JavaScript version maintains the same architecture as the original:
- Data-driven world system using CSV files
- Hardcoded audio zones in CreateWorld.js
- Single large command processing method in Adventure.js
- Vector-like array operations for inventory and location management

Modifications should follow the same patterns as the Java original for consistency.