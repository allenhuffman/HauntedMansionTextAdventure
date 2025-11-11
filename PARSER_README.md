# Haunted Mansion Text Adventure - Parser System

## Overview

The Haunted Mansion Text Adventure uses a sophisticated two-stage parsing system that transforms natural language commands into executable game actions. The parser has evolved from a simple verb-noun system to support multi-word item names, smart matching, and disambiguation.

## Architecture

### 1. Parse.js - Core Command Parser
The main parser class that handles initial command tokenization and verb-noun extraction.

### 2. ItemMatcher.js - Smart Item Matching
An intelligent matching system that finds items based on partial names, synonyms, and contextual clues.

### 3. Command Router System
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

### Stage 4: Smart Item Matching

When the command reaches an ItemHandler, the ItemMatcher uses sophisticated algorithms:

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

### Stage 5: Disambiguation

When multiple items match, the system provides helpful disambiguation:

```
> get key

I found multiple items that could match "key":
1. a red key
2. a blue key  
3. an old rusty key

Please be more specific, or use "get red key", "get blue key", etc.
```

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

### Example 2: Multi-word Item with Disambiguation
```
User Input: "get key"

1. Parse.js extracts:
   - Verb: "get"
   - Noun: "key"
   - Full Noun: "key"

2. ItemMatcher finds multiple matches:
   - "a red key" (Score: 80)
   - "a blue key" (Score: 80)
   - "an old rusty key" (Score: 80)

3. ItemMatcher triggers disambiguation:
   - Shows list of matching items
   - Requests more specific input

User Input: "get red key"

4. ItemMatcher finds single match:
   - "a red key" (Score: 100 - exact match after article removal)

5. ItemHandler executes pickup
```

### Example 3: Complex Multi-word Command
```
User Input: "examine the old portrait carefully"

1. Parse.js extracts:
   - Verb: "examine"
   - Noun: "the"
   - Full Noun: "the old portrait carefully"

2. CommandRouter routes to ExamineHandler

3. ItemMatcher processes "the old portrait":
   - Removes articles: "old portrait"
   - Searches for matches
   - Ignores context words like "carefully"

4. Finds match: "an old portrait"

5. ExamineHandler shows item description
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

## Future Enhancements

- **Synonym Database**: Expand vocabulary recognition
- **Learning System**: Adapt to player's preferred phrasing
- **Voice Recognition**: Support for spoken commands
- **Multi-language Support**: Parser localization framework
- **Gesture Commands**: Touch/click integration with parsing

## Technical Implementation

### Key Classes
- `Parse.js`: Core tokenization and verb-noun extraction
- `ItemMatcher.js`: Intelligent item matching with scoring
- `CommandRouter.js`: Routes commands to specialized handlers
- Various `*Handler.js`: Process specific command types

### Data Structures
- **Parse Result**: Contains verb, noun, fullNoun, and variations
- **Match Result**: Item matches with confidence scores  
- **Command Result**: Success/failure with game state changes

### Integration Points
- Game state through Adventure.js
- Item database through CreateWorld.js
- User interface through GUI components
- Audio system through SoundPlayer.js

This parser system transforms simple text input into rich, interactive gameplay while maintaining the classic text adventure feel that made the original games so engaging.