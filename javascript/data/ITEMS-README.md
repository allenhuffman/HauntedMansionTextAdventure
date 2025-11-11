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

### Action Fields

#### `verb` (string, required)
- Command verb that triggers this action
- Case-insensitive (READ, read, Read all work)
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

#### `newLocation` (number, optional)
- Room ID to transport player to when action succeeds
- Used for teleportation, secret passages, etc.
- Must be a valid room ID from `hm_map.json`

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
      "verb": "READ",
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
      "verb": "OPEN",
      "requiresItem": "brass key",
      "message": "The key fits perfectly! The door creaks open.",
      "newLocation": 15
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
      "verb": "SEARCH",
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
      "verb": "PUSH",
      "message": "The bookshelf swings inward, revealing a hidden passage!",
      "newLocation": 99
    }
  ]
}
```

This system provides rich interactivity while maintaining intuitive player interaction through natural language commands.