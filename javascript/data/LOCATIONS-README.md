# Haunted Mansion Locations System

This document describes the location/room system for the Haunted Mansion Text Adventure, including file format, navigation, and room design principles.

## File Format: `hm_map.json`

The location database is stored in JSON format with the following structure:

```json
{
  "rooms": [
    {
      "id": 1,
      "name": "Foyer",
      "description": "You are standing in the foyer of the Mansion...",
      "exits": {
        "north": 2,
        "south": 0,
        "west": 0,
        "east": 0,
        "up": 0,
        "down": 0
      }
    }
  ]
}
```

## Required Fields

### `id` (number)
- Unique identifier for the room
- Must be unique across all rooms
- Used for navigation, item placement, and action targeting
- **Special Value**: `0` = no exit (blocked/wall)

### `name` (string)
- Short, descriptive name for the room
- Appears in room headers and navigation messages
- Should be evocative and memorable
- Examples: "Foyer", "Portrait Gallery", "Ballroom", "Attic"

### `description` (string)
- Full atmospheric description shown when player enters or looks
- Should establish mood, describe key features, and hint at interactions
- Can include sensory details (sounds, smells, temperatures)
- Should match the haunted mansion theme

### `exits` (object)
- Defines all possible movement directions from this room
- Required directions: `north`, `south`, `west`, `east`, `up`, `down`
- Each direction maps to a room ID number
- **Value `0`**: No exit in that direction (wall/blocked)
- **Value `> 0`**: Room ID to move to in that direction

## Exit System

### Direction Values
```json
"exits": {
  "north": 5,    // Player can go north to room 5
  "south": 3,    // Player can go south to room 3  
  "west": 0,     // No exit west (wall)
  "east": 0,     // No exit east (wall)
  "up": 12,      // Player can go up to room 12 (stairs/ladder)
  "down": 0      // No exit down (no basement access)
}
```

### Movement Commands
Players can use various commands to navigate:
- **Full directions**: `go north`, `move south`, `walk east`
- **Short directions**: `north`, `south`, `east`, `west`, `up`, `down`
- **Abbreviations**: `n`, `s`, `e`, `w`, `u`, `d`

### Exit Validation
- All exit values must be valid room IDs or `0`
- Rooms should generally have reciprocal exits (if room 1 goes north to room 2, room 2 should go south to room 1)
- Consider logical layout and mansion architecture

## Room Design Principles

### Atmospheric Description
Create immersive descriptions that:
- Establish the haunted mansion mood
- Describe visual elements players might reference
- Include atmospheric details (sounds, lighting, temperature)
- Hint at interactive elements without being obvious
- Maintain consistent tone and style

### Example: Well-Designed Room
```json
{
  "id": 7,
  "name": "Ballroom",
  "description": "This once-grand ballroom stretches before you, its marble floor now cracked and stained. Ghostly waltzes seem to echo from the walls as tattered curtains flutter in impossible breezes. A massive crystal chandelier hangs precariously overhead, several crystals missing. Along the east wall, oil paintings watch you with eyes that seem to follow your movement. French doors to the north lead to a moonlit balcony.",
  "exits": {
    "north": 8,    // Balcony
    "south": 6,    // Return to Portrait Gallery
    "west": 0,     // Wall
    "east": 0,     // Wall (paintings are items, not exits)
    "up": 0,       // Can't reach ceiling
    "down": 0      // No basement access
  }
}
```

### Navigation Logic
- **Logical Layout**: Rooms should connect in architecturally sensible ways
- **Reciprocal Connections**: If room A connects north to room B, room B should connect south to room A
- **Vertical Movement**: Use `up`/`down` for stairs, ladders, elevators
- **Dead Ends**: Some rooms may have only one exit for dramatic effect
- **Hub Rooms**: Central areas (foyer, hallways) with multiple exits

## Special Room Types

### Entry Room
```json
{
  "id": 1,
  "name": "Foyer", 
  "description": "The grand entrance to the haunted mansion...",
  "exits": {
    "north": 2,    // Main hallway
    "south": 0,    // Locked front door (no return)
    "west": 15,    // Side corridor
    "east": 16,    // Another side area
    "up": 20,      // Grand staircase
    "down": 0      // No basement from here
  }
}
```

### Hub/Hallway Room
```json
{
  "id": 2,
  "name": "Grand Hallway",
  "description": "A long corridor stretches in both directions...",
  "exits": {
    "north": 3,    // Continue deeper
    "south": 1,    // Back to foyer
    "west": 4,     // Side room
    "east": 5,     // Another side room  
    "up": 21,      // Upper floor
    "down": 30     // Basement stairs
  }
}
```

### Dead End Room
```json
{
  "id": 25,
  "name": "Tower Room",
  "description": "You've reached the highest point of the mansion...",
  "exits": {
    "north": 0,    // Wall
    "south": 0,    // Wall
    "west": 0,     // Wall
    "east": 0,     // Wall
    "up": 0,       // Ceiling
    "down": 24     // Only way out - stairs down
  }
}
```

### Secret/Hidden Room
```json
{
  "id": 99,
  "name": "Hidden Chamber",
  "description": "This secret room was clearly meant to be hidden...",
  "exits": {
    "north": 0,
    "south": 0, 
    "west": 0,
    "east": 7,     // Secret passage back to ballroom
    "up": 0,
    "down": 0
  }
}
```

## Room Numbering Conventions

### Suggested Organization
- **1-10**: Ground floor main areas
- **11-20**: Ground floor side rooms and wings  
- **21-30**: Second floor
- **31-40**: Third floor/attic areas
- **41-50**: Basement/cellar areas
- **51-60**: Tower rooms
- **61-70**: Special/outdoor areas
- **80-99**: Secret/hidden rooms

### Example Layout
```
Ground Floor:
1: Foyer (entry)
2: Grand Hallway (hub)
3: Portrait Gallery  
4: Library
5: Dining Room
6: Kitchen
7: Ballroom
8: Conservatory

Second Floor:
21: Upper Hallway
22: Master Bedroom
23: Guest Bedroom
24: Bathroom
25: Study

Basement:
41: Wine Cellar
42: Storage Room
43: Boiler Room

Secret Areas:
99: Hidden Chamber
98: Secret Passage
```

## Integration with Items

### Room-Item Relationships
Items in `hm_items.json` reference rooms via `startLocation`:
```json
// Item placed in Ballroom (room 7)
{
  "id": 15,
  "startLocation": 7,
  "name": "a crystal shard",
  "description": "A piece of the chandelier that has fallen to the floor."
}
```

### Invisible Items for Secret Navigation
Use invisible items to create secret passages:
```json
// In items file - secret exit from Library
{
  "id": 88,
  "startLocation": 4,  // Library
  "name": "bookshelf",
  "invisible": true,
  "carryable": false,
  "actions": [
    {
      "verb": "PUSH",
      "message": "The bookshelf swings open, revealing a hidden passage!",
      "newLocation": 99  // Hidden Chamber
    }
  ]
}
```

## Testing and Validation

### Connection Testing
Verify all room connections:
```bash
# Check for orphaned rooms (no connections in)
# Check for one-way connections  
# Verify all exit IDs reference valid rooms
```

### Navigation Flow
- Test that players can navigate logically
- Ensure no unreachable rooms
- Verify escape routes from dead ends
- Test vertical navigation makes sense

### Description Consistency
- Ensure exit descriptions match actual exits
- Verify mentioned features have corresponding items
- Check that atmospheric elements are consistent

## Best Practices

### Writing Descriptions
1. **Set the Scene**: Establish atmosphere immediately
2. **Visual Details**: Describe what players see first
3. **Sensory Elements**: Include sounds, smells, temperature
4. **Interactive Hints**: Subtly mention examinable objects
5. **Exit Cues**: Naturally reference obvious exits
6. **Consistent Tone**: Maintain haunted mansion atmosphere

### Designing Layout
1. **Logical Architecture**: Rooms should make physical sense
2. **Navigation Flow**: Create natural exploration paths
3. **Landmark Rooms**: Include memorable hub areas
4. **Dead Ends**: Use sparingly for dramatic effect
5. **Secrets**: Hide some rooms behind puzzles or items
6. **Scale**: Balance mansion size with playability

### Exit Design
1. **Reciprocal Connections**: Most exits should go both ways
2. **Clear Blocking**: Use walls/doors logically
3. **Vertical Movement**: Make stairs/ladders obvious
4. **One-Way Passages**: Use occasionally for story effect
5. **Secret Exits**: Hide behind item interactions

This system creates an immersive, navigable mansion that feels both mysterious and architecturally coherent.