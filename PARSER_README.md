# Haunted Mansion Text Adventure - Parser System

## Overview

The Haunted Mansion Text Adventure uses a sophisticated multi-stage parsing system that transforms natural language commands into executable game actions. The parser has evolved from a simple verb-noun system to support multi-word item names, reverse-matching strategies, smart disambiguation, and unified text formatting throughout the game.

## Architecture

### 1. Parse.js - Core Command Parser
The main parser class that handles initial command tokenization and verb-noun extraction with enhanced multi-word support.

### 2. ItemMatcher.js - Smart Item Matching
An intelligent matching system with reverse-matching strategy that finds items based on partial names, word sequences, and contextual clues.

### 3. TextUtils.js - Unified Text Formatting
A shared utility that ensures consistent natural language formatting across room descriptions, item lists, and disambiguation messages.

### 4. Command Router System
A collection of specialized handlers that process different types of commands (movement, inventory, item manipulation, etc.).

## Parsing Pipeline

### Stage 1: Initial Command Processing

When a user types a command like `"get the red key from the table"`, the parser follows these steps:

1. **Input Normalization**
   ```javascript
   Input: "get the red key from the table"
   Normalized: "get the red key from the table" (trimmed, case-preserved)
   ```

2. **Tokenization**
   ```javascript
   Tokens: ["get", "the", "red", "key", "from", "the", "table"]
   ```

3. **Verb Extraction**
   ```javascript
   Verb: "get" (first token becomes the primary verb)
   ```

4. **Noun Extraction with Context**
   ```javascript
   Remaining: ["the", "red", "key", "from", "the", "table"]
   Primary Noun: "the" (traditional approach)
   Full Noun: "the red key from the table" (enhanced approach)
   ```

### Stage 2: Enhanced Noun Processing

The parser now extracts multiple noun representations:

- **Basic Noun**: First word after verb (`"the"`)
- **Full Noun**: Complete remaining text (`"the red key from the table"`)
- **Noun Variations**: Different combinations for matching
  - `"the red key"`
  - `"red key"`
  - `"key"`

### Stage 3: Command Shortcuts and Aliases

Before routing to handlers, the parser processes shortcuts:

```javascript
// Direction shortcuts
"n" → "go north"
"s" → "go south"
"e" → "go east"
"w" → "go west"
"u" → "go up"
"d" → "go down"

// Action shortcuts
"l" → "look"
"i" → "inventory"

// Verb aliases
"take" → "get"
"examine" → "look"
```

### Stage 4: Smart Item Matching with Reverse-Matching Strategy

When the command reaches an ItemHandler, the ItemMatcher uses sophisticated algorithms with a revolutionary reverse-matching approach:

#### Reverse-Matching Strategy (New!)

The system now works backwards from the full input to find the most specific match:

```
Input: "get the blue key from table"
Tries: "table" → "from table" → "key from table" → "blue key from table" → "the blue key from table"
Stops when exactly one high-confidence match is found.
```

This solves the common problem where:
- `"get blue"` works (finds "a blue key")
- `"get blue key"` previously failed with wrong disambiguation
- Now `"get blue key"` works perfectly!

#### Matching Algorithm Priorities

1. **Exact Match (Score: 100)**
   ```
   Input: "red key"
   Item: "a red key"
   Match: EXACT (after article removal)
   ```

2. **Prefix Match (Score: 90)**
   ```
   Input: "red"
   Item: "a red key"
   Match: PREFIX
   ```

3. **Suffix Match (Score: 80)**
   ```
   Input: "key"
   Item: "a red key"
   Match: SUFFIX
   ```

4. **Contains Match (Score: 70)**
   ```
   Input: "ed ke"
   Item: "a red key"
   Match: CONTAINS
   ```

5. **Multi-word Sequence (Score: 85)**
   ```
   Input: "old rusty key"
   Item: "an old rusty key"
   Match: WORD_SEQUENCE
   ```

#### Article Removal
The parser intelligently removes common articles for better matching:
```javascript
"a red key" → "red key"
"an old book" → "old book"
"the crystal ball" → "crystal ball"
"some strange items" → "strange items"
```

### Stage 5: Disambiguation with Unified Text Formatting

When multiple items match, the system provides helpful disambiguation using natural language formatting:

```
> get key

Please be more specific. I see a red key, a blue key, and an old rusty key.
```

**Key Improvements:**
- **Better Phrasing**: "Please be more specific" instead of "Which key do you mean?" (avoids confusing responses like "the red one")
- **Natural Language**: Uses same formatting as room descriptions with proper comma/and placement
- **Unified Formatting**: Powered by `TextUtils.formatItemList()` for consistency across all game text

## Command Flow Examples

### Example 1: Simple Item Pickup
```
User Input: "get book"

1. Parse.js extracts:
   - Verb: "get"
   - Noun: "book"
   - Full Noun: "book"

2. CommandRouter routes to ItemHandler

3. ItemMatcher searches location items:
   - "a book" (Score: 80 - suffix match)
   - "an old notebook" (Score: 0 - no match)

4. ItemHandler executes:
   - Removes "a book" from location
   - Adds to player inventory
   - Displays: "a book taken."
```

### Example 2: Reverse-Matching Success Story
```
User Input: "get blue key"

1. Parse.js extracts:
   - Verb: "get"
   - Noun: "blue"
   - Full Noun: "blue key"

2. ItemMatcher tries reverse-matching:
   - Tries "key" → finds multiple matches (red key, blue key, rusty key)
   - Tries "blue key" → finds exactly one match: "a blue key" (Score: 100)
   - Returns immediately with high confidence

3. ItemHandler executes pickup:
   - "a blue key taken."

Old System: Would have shown disambiguation for "blue key"
New System: Works perfectly on first try!
```

### Example 3: Disambiguation When Needed
```
User Input: "get key"

1. Parse.js extracts:
   - Verb: "get"
   - Noun: "key"
   - Full Noun: "key"

2. ItemMatcher tries reverse-matching:
   - Tries "key" → finds multiple high-confidence matches
   - No single clear winner, falls back to disambiguation

3. System shows natural language disambiguation:
   - "Please be more specific. I see a red key, a blue key, and an old rusty key."

4. User responds: "get red key" → Works perfectly!
```

### Example 3: Multi-word Examine Commands (Recent Fix)
```
User Input: "look stone key"

1. Parse.js extracts:
   - Verb: "look"
   - Noun: "key" 
   - Full Noun: "stone key"

2. CommandRouter routes to ExamineHandler

3. ExamineHandler now uses fullNoun (recent fix):
   - Previously used only "key" (last word)
   - Now uses "stone key" (complete phrase) 
   - Matches "hidden stone key" with 95% confidence

4. Smart matching finds correct item:
   - ItemMatcher processes "stone key"
   - Finds "hidden stone key" 
   - Returns detailed item description

5. Result: "look stone key" works as expected!

Previous Behavior: Only matched items ending in "key"
Fixed Behavior: Matches complete multi-word item names
```

## Backward Compatibility

The parser maintains backward compatibility with the original keyword-based system:

- **Legacy Items**: Still work with single keywords
- **Modern Items**: Use full names for natural interaction
- **Mixed Content**: Both systems coexist seamlessly

## Error Handling

The parser gracefully handles various error conditions:

- **Empty Input**: "I have no idea what you are trying to do."
- **Unknown Verb**: "I don't understand that command."
- **No Object Found**: "I don't see that around here."
- **Ambiguous Input**: Provides disambiguation options
- **Invalid Context**: "You can't do that here."

## Performance Considerations

- **Caching**: Frequently used parsing results are cached
- **Early Exit**: Matching stops at first high-confidence result
- **Lazy Evaluation**: Complex matching only when needed
- **Memory Efficient**: Reuses parser instances across commands

## Extensibility

The parser system is designed for easy extension:

### Adding New Command Types
```javascript
class CustomHandler {
    canHandle(verb, noun, parseResult) {
        return verb.toUpperCase() === "CUSTOM";
    }
    
    handle(verb, noun, parseResult) {
        // Implementation
        return { success: true, moved: false };
    }
}
```

### Adding New Matching Rules
```javascript
// In ItemMatcher.js
calculateMatchScore(input, item) {
    // Add custom scoring logic
    if (customCondition) {
        score += customBonus;
    }
    return score;
}
```

## Advanced Features

### Context-Aware Parsing
The parser considers game state when interpreting commands:
- Location-specific items take precedence
- Recently interacted items get slight bonuses
- Player inventory items are always accessible

### Natural Language Support
The system handles natural language variations:
- "pick up the red key" → "get red key"
- "look at the old book" → "examine old book"
- "drop everything" → "drop all"

### Smart Preposition Handling
Prepositions are intelligently processed:
- "get key from table" → focuses on "key"
- "put book on shelf" → focuses on "book" and "shelf"
- "go through door" → focuses on "door"

## Usage Examples

### Basic Commands
```
> go north
> look around
> get key
> drop lantern
```

### Smart Parsing with Reverse-Matching
```
> get old dusty tome      # Matches "old tome" item
> examine music box       # Matches "crystal music box"  
> drop house key         # Matches "house key" exactly
> get blue key           # Reverse-matches: tries "key" → "blue key" → finds unique match
```

### Natural Language Disambiguation
```
> get key
Please be more specific. I see a blue key and a red key here.

> get blue key           # Reverse-matching finds the specific item
> get blue              # Also works - reverse-matching expands to "blue key"
```

### Unified Text Formatting
```
> look
Foyer
You are in a grand foyer with marble floors.
Exits: north and east
You see a blue key, a red key, and an old lantern here.

# Consistent formatting throughout: commas for lists, "and" for final item
```

## Recent Improvements (November 2025)

### ExamineHandler Multi-word Fix
**Problem**: The ExamineHandler was only using the last word of multi-word commands, causing "look stone key" to be processed as "look key".

**Solution**: Updated ExamineHandler to use the same fullNoun pattern as ItemHandler:
```javascript
// Before (broken):
const searchTerm = noun; // Only "key" from "look stone key"

// After (fixed):
const fullNoun = parseResult && parseResult.getFullNoun ? parseResult.getFullNoun() : noun;
const searchTerm = fullNoun || noun; // Full "stone key" phrase
```

**Impact**: Commands like "look stone key", "examine red key", and "look blue book" now work consistently across all handlers.

**Files Changed**: 
- `ExamineHandler.js` - Added fullNoun extraction and logging
- Added debug logging to track noun vs fullNoun usage

## Future Enhancements

- **Synonym Database**: Expand vocabulary recognition
- **Learning System**: Adapt to player's preferred phrasing
- **Voice Recognition**: Support for spoken commands
- **Multi-language Support**: Parser localization framework
- **Gesture Commands**: Touch/click integration with parsing

## Technical Implementation

### Key Classes
- `Parse.js`: Core tokenization and verb-noun extraction with multi-word support
- `ItemMatcher.js`: Intelligent item matching with reverse-matching strategy and confidence scoring
- `TextUtils.js`: Unified text formatting for natural language lists throughout the game
- `CommandRouter.js`: Routes commands to specialized handlers
- Various `*Handler.js`: Process specific command types with smart matching integration

### Data Structures
- **Parse Result**: Contains verb, noun, fullNoun, and noun variations for flexible matching
- **Match Result**: Item matches with confidence scores and match types
- **Disambiguation Result**: Handles multiple matches with natural language formatting
- **Command Result**: Success/failure with game state changes

### Key Algorithms
- **Reverse-Matching**: Works backwards from full input to find most specific matches
- **Confidence Scoring**: Multi-tier scoring system (100=exact, 90=prefix, 80=suffix, etc.)
- **Natural Language Formatting**: Consistent "item1, item2, and item3" formatting across all game text
- **Unified Multi-word Support**: Both ExamineHandler and ItemHandler use fullNoun for consistent matching behavior

### Integration Points
- Game state through Adventure.js with unified showLocation() formatting
- Item database through CreateWorld.js with name-only item support
- User interface through GUI components
- Audio system through SoundPlayer.js
- Text formatting through TextUtils.js shared across all components

This parser system transforms simple text input into rich, interactive gameplay while maintaining the classic text adventure feel that made the original games so engaging.