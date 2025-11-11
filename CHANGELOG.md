# Changelog

All notable changes to the Haunted Mansion Text Adventure JavaScript version.

## [2.0.0] - 2025-11-11

### 🎯 Major Refactoring - Command Pattern Implementation

#### Architecture Changes
- **BREAKING**: Complete refactoring of Adventure.js command processing
- **Reduced code size**: Adventure.js from 768 lines to 240 lines (68.7% reduction)
- **Modular design**: 8 specialized command handlers replace monolithic textEntered() method
- **Command Pattern**: Clean separation of concerns with CommandRouter dispatch system

#### New Command Handlers
- `MovementHandler.js` - Handles N/S/E/W/U/D movement commands
- `InventoryHandler.js` - Handles INVENTORY display
- `ItemHandler.js` - Handles GET/DROP item commands
- `ExamineHandler.js` - Handles LOOK/EXAMINE commands
- `SystemHandler.js` - Handles SOUND/VERBOSE system commands
- `GameControlHandler.js` - Handles HELP/QUIT/RESTART commands
- `ActionItemHandler.js` - Handles custom ActionItem interactions
- `SearchHandler.js` - Provides fallback for SEARCH commands

### 🎮 ActionItem System Enhancement

#### JSON-Driven Actions
- **NEW**: Complete ActionItem system powered by JSON definitions
- **Data-driven**: All game logic moved from code to `hm_items.json`
- **Zero hard-coding**: No game-specific logic in JavaScript code
- **Extensible**: New puzzles and interactions via data files only

#### ActionItem Features
- **Multiple verbs**: Items support multiple action verbs (move/push/slide/search)
- **Requirements**: Actions can require specific items in inventory
- **State management**: `onceOnly` actions with custom repeat messages
- **Item transformation**: Actions change item names and descriptions
- **World modification**: Actions reveal items, add exits, modify audio
- **Location-specific**: Actions can be restricted to specific rooms

#### Implemented Puzzles
- **Clock puzzle**: Search clock → find crank → wind clock → activate seance
- **Hidden safe**: Search/move paintings → reveal safe → open with bookmark → get amulet
- **Master Gracey's door**: Find key → unlock door → create east exit
- **Discovery system**: Search panel/book to find required items

### 🎵 Audio System Improvements

#### Persistent Audio
- **Fixed**: Room audio now persists when re-entering rooms after ActionItem effects
- **Dynamic**: ActionItems can modify audio for multiple rooms simultaneously
- **JSON configuration**: Room-specific audio overrides via data files

#### Audio Data Format
- **Migrated**: Audio configuration to JSON format (`hm_audio.json`)
- **Enhanced**: Support for action-triggered sounds and persistent room changes

### 🔧 Technical Improvements

#### Modern JavaScript
- **ES6 Classes**: Clean object-oriented structure throughout
- **Async/Await**: Proper asynchronous file loading with error handling
- **Error Collection**: Comprehensive error reporting during world loading
- **Console Logging**: Detailed debugging output for ActionItem execution

#### Data Format Migration
- **JSON adoption**: Enhanced data files using JSON where appropriate
- **Backward compatibility**: Original CSV loading maintained where needed
- **Error handling**: Graceful fallbacks and user-friendly error messages

### 🐛 Bug Fixes

#### Movement System
- **Fixed**: Movement commands now work properly with refactored handlers
- **Enhanced**: Support for "GO NORTH" style commands in addition to single directions

#### ActionItem Execution
- **Fixed**: Item requirement checking now works correctly
- **Fixed**: ActionItem handlers properly check for verb support before claiming commands
- **Fixed**: Exit creation now uses proper Location objects instead of room IDs
- **Fixed**: Door unlock actions are now properly `onceOnly` to prevent repeated unlocking

#### Audio System
- **Fixed**: Sound effects from actions now persist across room transitions
- **Fixed**: Action-triggered audio properly configures room-based persistent sound

### 📝 Documentation

#### Comprehensive Updates
- **Updated**: Complete README with new architecture documentation
- **Added**: ActionItem system documentation with JSON examples
- **Added**: Command handler development guide
- **Added**: Migration notes and best practices

## [1.0.0] - 2024

### Initial JavaScript Conversion
- Direct conversion from Java applet to JavaScript
- Maintained identical gameplay and behavior
- Modern web browser compatibility
- HTML5 Audio API integration
- CSV-based data loading system
- Basic ActionItem and SpecialLocation framework

---

## Development Notes

### Code Quality Metrics
- **Lines of code reduced**: 68.7% reduction in main Adventure.js
- **Cyclomatic complexity**: Dramatically reduced through modular handlers
- **Maintainability**: Clean separation of engine code from game data
- **Testability**: Each handler can be tested independently

### Performance Improvements
- **Faster command routing**: Efficient handler selection vs. large if/else chains
- **Reduced memory usage**: Smaller main game loop
- **Better caching**: Optimized resource loading and management

### Future Enhancements
The new architecture enables easy addition of:
- Save/load functionality
- New command verbs via handlers
- Complex multi-step puzzles via JSON
- Dynamic world generation
- Multiplayer capabilities