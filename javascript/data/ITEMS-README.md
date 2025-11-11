# Haunted Mansion Items System

This document describes the item system for the Haunted Mansion Text Adventure, including file format, capabilities, and advanced features.

## File Format: `hm_items.json`

The item database is stored in JSON format with the following structure:

```json
{
  "items": [
    {
      "id": 1,
      "startLocation": 9,
      "name": "a book",
      "description": "It appears to be a collection of stories by Edgar Allan Poe.",
      "carryable": true,
      "invisible": false,
      "actions": [
        {
          "verb": "READ",
          "useInRoom": "*",
          "message": "You read several spine-chilling tales...",
          "alreadyPerformedMessage": "You have already read the book.",
          "onceOnly": true
        }
      ]
    }
  ]
}
```

## Required Fields

### `id` (number)
- Unique identifier for the item
- Must be unique across all items
- Used for internal references and item revelation

### `startLocation` (number)
- Room ID where the item initially appears
- Must correspond to a valid room ID in `hm_map.json`
- Set to `-1` for items that start in player inventory

### `name` (string)
- Display name of the item as it appears in the game
- Used for player commands and room descriptions
- Should include articles ("a", "an", "the") for natural language
- **Matching System**: Players can reference items by any whole word in the name

## Optional Fields

### `description` (string)
- Text shown when player examines the item
- If missing or empty, defaults to "You see nothing special."
- Can contain detailed descriptions, lore, or hints

### `carryable` (boolean)
- `true`: Item can be picked up and carried by player
- `false`: Item is fixed in place (furniture, walls, etc.)
- Default: `true`

### `invisible` (boolean)
- `true`: Item exists but doesn't appear in room descriptions
- `false`: Item appears normally in room listings
- Default: `false`
- **Use Cases**: Secret passages, hidden items, special triggers

### `actions` (array)
- Array of special action objects that define custom behaviors
- Each action responds to specific verbs and can trigger various effects
- See "Action System" section below for details

## Action System

Actions allow items to respond to player commands with custom behavior beyond the default examine/take/drop actions.

### Action Object Structure

```json
{
  "verb": "READ",
  "useInRoom": "*",
  "requiresItem": "a lit candle",
  "message": "Response text shown to player",
  "alreadyPerformedMessage": "Text for repeat attempts",
  "onceOnly": true,
  "revealsItemId": 25,
  "newLocation": 42
}
```

### Multiple Verbs Example

```json
{
  "verb": "PUSH,PULL,MOVE",
  "message": "The heavy bookshelf slides aside, revealing a secret passage!",
  "newLocation": 99
}
```

### Action Fields

#### `verb` (string, required)
- Command verb(s) that trigger this action
- Case-insensitive (READ, read, Read all work)
- **Multiple verbs**: Use comma-separated list: `"PUSH,PULL,MOVE"`
- Common verbs: READ, SEARCH, USE, PUSH, PULL, OPEN, CLOSE

#### `useInRoom` (string or number, optional)
- Restricts action to specific room(s)
- `"*"`: Works in any room (default)
- `42`: Only works in room 42
- `"1,5,9"`: Works in rooms 1, 5, and 9

#### `requiresItem` (string, optional)
- Item that must be in player inventory for action to work
- Uses smart matching - can specify any part of item name
- Example: `"candle"` matches `"a lit candle"`
- If not possessed, shows default "You need X to do that" message

#### `message` (string, required)
- Text displayed when action succeeds
- Can be multi-line or contain story elements
- This is the primary feedback to the player

#### `alreadyPerformedMessage` (string, optional)
- Custom message for repeat attempts when `onceOnly: true`
- If not specified, uses default "You have already done that"

#### `onceOnly` (boolean, optional)
- `true`: Action can only be performed once
- `false`: Action can be repeated (default)
- Useful for one-time discoveries or story progression

#### `revealsItemId` (number, optional)
- ID of another item to add to the current room when action succeeds
- Used for revealing hidden items, dropping objects, etc.
- The revealed item must exist in the items database

#### `hidesItemId` (number, optional)
- ID of an item to remove from the game world when action succeeds
- Item is automatically searched for and removed from any room
- Used for making items disappear, solving puzzles, etc.
- The item must exist somewhere in the world to be hidden

#### `newLocation` (number, optional)
- Room ID to transport player to when action succeeds
- Used for teleportation, secret passages, etc.
- Must be a valid room ID from `hm_map.json`

#### `modifyLocation` (object or array, optional)
- Comprehensive room modification system for advanced interactions
- Can modify single room or multiple rooms simultaneously
- Supports adding exits, changing descriptions, and hiding items
- See "Room Modification System" section below for details

## Item Matching System

The game uses intelligent whole-word matching for item references:

### Matching Rules (in priority order)
1. **Exact match**: `"red key"` matches `"red key"` exactly
2. **Exact match (ignore articles)**: `"red key"` matches `"a red key"`
3. **Multi-word sequence**: `"blue key"` matches `"a blue key"`
4. **Single word exact**: `"key"` matches any item containing the word "key"
5. **All words match**: `"red key"` matches `"the red key from chest"`
6. **Partial word match**: `"red door"` vs `"a red key"` (only "red" matches)

### What Players Can Type
- `"look book"` → finds `"a book"`
- `"get red key"` → finds `"a red key"`  
- `"examine east wall"` → finds `"paintings along the east wall"`
- `"use candle"` → finds `"a lit candle"`

### What WON'T Match
- Partial words: `"boo"` won't match `"book"`
- Single letters: `"k"` won't match `"key"`
- Substrings: `"ed"` won't match `"red key"`

## Special Item Types

### Carryable Items
```json
{
  "name": "a red key",
  "carryable": true,
  "description": "A small red key that looks important."
}
```

### Fixed/Furniture Items
```json
{
  "name": "a grandfather clock",
  "carryable": false,
  "description": "An ornate clock that has stopped at midnight."
}
```

### Invisible/Secret Items
```json
{
  "name": "west wall",
  "invisible": true,
  "carryable": false,
  "actions": [
    {
      "verb": "GO",
      "message": "You discover a secret passage!",
      "newLocation": 42
    }
  ]
}
```

### Interactive Items with Requirements
```json
{
  "name": "a dark scroll",
  "actions": [
    {
      "verb": "READ,EXAMINE,STUDY",
      "requiresItem": "candle",
      "message": "By candlelight, you can make out ancient runes...",
      "onceOnly": true,
      "revealsItemId": 50
    }
  ]
}
```

## Best Practices

### Naming
- Use natural language with articles: `"a book"`, `"the old door"`
- Include descriptive words players might use: `"red key"` not just `"key"`
- Consider synonyms players might try

### Descriptions
- Always provide descriptions for important items
- Use atmospheric language fitting the haunted mansion theme
- Include hints for interactive items

### Actions
- Use clear, evocative response messages
- Consider what items players might logically need
- Use `onceOnly` for story progression moments
- Test action sequences for logical flow

### Room Integration
- Consider how items fit the room's theme and description
- Use invisible items sparingly for special effects
- Balance carryable vs. fixed items for gameplay

## Room Modification System

The `modifyLocation` system provides comprehensive room modification capabilities for advanced puzzle mechanics and world changes. This system replaces older scattered approaches with a unified, powerful interface.

### Basic Structure

```json
{
  "verb": "PLAY",
  "modifyLocation": {
    "roomId": 17,
    "addExit": {
      "direction": "east",
      "destination": 18,
      "description": "east to the Conservatory"
    },
    "changeRoomDescription": "The music echoes through the mansion as a new doorway opens to the east.",
    "hidesItemId": 45
  }
}
```

### Multiple Room Modifications

```json
{
  "verb": "ACTIVATE",
  "modifyLocation": [
    {
      "roomId": 10,
      "addExit": {
        "direction": "up",
        "destination": 20
      }
    },
    {
      "roomId": 15,
      "changeRoomDescription": "The room transforms as ancient magic awakens."
    }
  ]
}
```

### ModifyLocation Fields

#### `roomId` (number, required)
- ID of the room to modify
- Must be a valid room ID from `hm_map.json`
- Can target any room, not just the current player location

#### `addExit` (object, optional)
- Adds a new exit to the specified room
- **`direction`** (string): "north", "south", "east", "west", "up", "down"
- **`destination`** (number): Target room ID for the new exit
- **`description`** (string, optional): Description text for the exit

#### `changeRoomDescription` (string, optional)
- Updates the room's description text
- Replaces the existing description entirely
- Use for dramatic story moments or puzzle solutions

#### `hidesItemId` (number, optional)
- ID of an item to remove from the game world
- Item is automatically found and removed from any room
- Useful for making ghosts disappear, removing obstacles, etc.

### Usage Examples

#### Simple Exit Addition
```json
{
  "name": "a crystal orb",
  "actions": [
    {
      "verb": "TOUCH,ACTIVATE",
      "message": "The orb glows brightly, opening a passage to the north!",
      "modifyLocation": {
        "roomId": 12,
        "addExit": {
          "direction": "north",
          "destination": 25
        }
      }
    }
  ]
}
```

#### Complex Puzzle Solution
```json
{
  "name": "the pipe organ",
  "actions": [
    {
      "verb": "PLAY,USE",
      "message": "As you play the haunting melody, ghostly music echoes through the mansion. You hear a door opening in the distance, and the ghost of the organist fades away.",
      "onceOnly": true,
      "modifyLocation": {
        "roomId": 17,
        "addExit": {
          "direction": "east",
          "destination": 18,
          "description": "east to the Conservatory"
        },
        "changeRoomDescription": "The ballroom's pipe organ sits silent now, its ghostly organist finally at peace. A new doorway has opened to the east.",
        "hidesItemId": 52
      }
    }
  ]
}
```

#### Multi-Room Transformation
```json
{
  "name": "master switch",
  "actions": [
    {
      "verb": "PULL,ACTIVATE",
      "message": "The master switch activates, transforming the entire mansion!",
      "modifyLocation": [
        {
          "roomId": 1,
          "addExit": {
            "direction": "up",
            "destination": 50
          },
          "changeRoomDescription": "The foyer now has a grand staircase leading upward."
        },
        {
          "roomId": 10,
          "hidesItemId": 30
        },
        {
          "roomId": 15,
          "changeRoomDescription": "This room has been completely transformed by ancient magic."
        }
      ]
    }
  ]
}
```

### Legacy Support

For backward compatibility, the following individual properties are still supported but should be avoided in new implementations:

- `revealsItemId` - Use `modifyLocation.revealsItemId` instead
- `hidesItemId` - Use `modifyLocation.hidesItemId` instead  
- `newLocation` - For player teleportation only (not room modification)

### Best Practices

1. **Use descriptive messages** - Explain what's happening to the player
2. **Consider room context** - Make sure new exits make sense spatially
3. **Test modifications** - Verify room IDs and connections work correctly
4. **Plan puzzle sequences** - Use `onceOnly` to prevent repeated modifications
5. **Provide exit descriptions** - Help players understand new navigation options

## Common Patterns

### Key-Door Pattern
```json
// The key
{
  "name": "a brass key",
  "description": "An ornate brass key with mysterious engravings."
}

// The door  
{
  "name": "a locked door",
  "carryable": false,
  "actions": [
    {
      "verb": "OPEN,UNLOCK",
      "requiresItem": "brass key",
      "message": "The key fits perfectly! The door creaks open.",
      "newLocation": 15
    },
    {
      "verb": "PUSH,FORCE,SHOVE",
      "message": "The door is firmly locked. You'll need to find a key."
    }
  ]
}
```

### Search and Reveal Pattern
```json
{
  "name": "an old desk",
  "carryable": false,
  "actions": [
    {
      "verb": "SEARCH,EXAMINE,OPEN",
      "message": "You find a hidden compartment with something inside!",
      "onceOnly": true,
      "revealsItemId": 33
    }
  ]
}
```

### Secret Passage Pattern
```json
{
  "name": "bookshelf",
  "invisible": true,
  "carryable": false,
  "actions": [
    {
      "verb": "PUSH,PULL,MOVE",
      "message": "The bookshelf swings inward, revealing a hidden passage!",
      "newLocation": 99
    }
  ]
}
```

### Modern Puzzle Pattern (Using modifyLocation)
```json
{
  "name": "ancient lever",
  "carryable": false,
  "actions": [
    {
      "verb": "PULL,USE,ACTIVATE",
      "message": "The lever clicks into place. You hear stone grinding against stone as hidden mechanisms activate throughout the mansion!",
      "onceOnly": true,
      "modifyLocation": [
        {
          "roomId": 5,
          "addExit": {
            "direction": "down",
            "destination": 42,
            "description": "down into a newly revealed cellar"
          },
          "changeRoomDescription": "The library now has a trapdoor in the floor that has opened to reveal stairs leading down."
        },
        {
          "roomId": 20,
          "hidesItemId": 35,
          "changeRoomDescription": "The blocking stone has disappeared, and the room feels more open."
        }
      ]
    }
  ]
}
```

### Ghost Banishment Pattern
```json
{
  "name": "holy relic",
  "actions": [
    {
      "verb": "USE,RAISE,HOLD",
      "useInRoom": "13",
      "message": "The holy relic glows with divine light! The malevolent spirit shrieks and vanishes into the ethereal realm.",
      "onceOnly": true,
      "modifyLocation": {
        "roomId": 13,
        "hidesItemId": 66,
        "changeRoomDescription": "The chapel feels peaceful now, free from the malevolent presence that once haunted it."
      }
    }
  ]
}
```

This system provides rich interactivity while maintaining intuitive player interaction through natural language commands. The `modifyLocation` system enables complex puzzle mechanics that can transform multiple rooms simultaneously, creating dynamic storytelling opportunities.