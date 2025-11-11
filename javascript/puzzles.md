# Haunted Mansion Adventure Game Ideas #

Here are some ideas for the types of puzzles that might end up in the game. It might be fun to have thirteen puzzles to solve to win the game.

The new game engine has actions that can do things like make an object appear in the room ("search bushes", "you found a sneaker!"), make a new exit appear ("unlock door"), or teleport to new locations ("climb tree"). They can have requirements ("open door" requires "key").

**Advanced Features (2025)**: The game now includes a comprehensive `modifyLocation` system that allows puzzles to:
- Add exits to any room in the mansion (not just current location)
- Change room descriptions dynamically for story progression
- Hide items/ghosts from the world (`hideItem` functionality)  
- Modify multiple rooms simultaneously for complex puzzle solutions
- See `javascript/data/ITEMS-README.md` for full technical documentation

# Objectives #
1. One "win" would simply be to find 13 specific Haunted Mansion-related items in the game, like a treasure hunt. Special objects could have a description like "it is warm to the touch" or "it vibrates with energy". These items would all be in accessible areas without needing to solve any puzzles. "Congratulations, you have collected all the special items. There are still puzzles to be solved, if you want to continue playing."
2. More advanced would be trying to solve a series of puzzles that allow the player to "escape" the Mansion. Ideally, there would be several ways to do this so if a player got stuck, they could try another approach. It would also offer a bit of replyability.

# Puzzles - TO IMPLEMENT #
1. Make the Stretching Room Stretch - A gargoyle is missing a candle. Find a candle in the Grand Hall (birthday cake) and PUT it in the garoyle. This will make the stretching room convert into the stretched room, exposing the cupola. (Clue: "On of the gargoyles seems to be missing a candle.")
2. Access Master Gracey's Bedchamber - The door is locked. A key can be found by searching the key holder panel in the Servant's Chamber. (Clue: bell board mentions only one bell is not covered in dust.)
3. Make the Seance Begin (Grandfather Clock) - The clock is stopped. Searching it will find a winding crank, which can be used to start the clock. It will advance to 13 o'clock and the seance will begin. (Clue: Seance Cirlce has a sign "be back at 13 o'clock" or a calendar can be found with "Seance 13 o'clock").
4. Access the Graveyard from the Attic Ledge - A rope is needed to get down to the graveyard. The rope can be found by taking a ladder from the Library into the stretched stretching room and climbing it up to the cupola where the hanging body is. (Dependent on Stretching Room) (Clue: "You need something long to lower yourself down.")
5. ✅ **IMPLEMENTED** - Access the Grand Hall Alcove (Pipe Organ) - Playing the pipe organ in the ballroom causes haunting music to echo through the mansion, opening a new doorway to the east and causing the ghostly organist to fade away peacefully. (Commands: PLAY ORGAN, USE ORGAN) - Uses advanced `modifyLocation` system to add exit from room 17 to 18 and hide the organist ghost.
6. Hat Box Ghost - In the attic is a headless figure blocking the ledge/window. Giving him Madame Leota's head in the crystal ball will make him happy and move out of the way, allowing access to the ledge. (Clue: "You'd be angry too if you were missing a head.")
7. TBD
8. TBD
9. TBD
10. TBD
11. TBD
12. TBD
13. TBD


# Puzzles - More Ideas #

## Music ##
Game should not play music until that puzzle is solved.

## Bride Puzzle? ##
Give her an axe?

## Ravens ##
The raven appears in the conservatory, seance room, attic, and cemetery, but is missing from the ballroom.

## Graveyard Band ##
Missing an instrument, must be retrieved from Seance Circle. Requires: Clock puzzle to start the seance.

## Knock on Door ##
Door will open (corridor of doors).

## Madame Leota crystal ball ##
Empty on the table, but starting the clock to 13 begins the seance. Need a way to tell that. Spellbook says "Be back at 13"? Or have a calendar somewhere that has this written on it? "Seance: 13 o'clock"

## Graveyard Band ##
One will be missing an instructment. You can find an instrument in the Seance Circle and give it to the ghost later.

## Secret Entrance ##
A Secret Entrance in the crypt area leads directly to the Portrait Corridor, bypassing the foryer and stretching room. This could use something from the comic. "In the comic story "The Pickwick Capers", the Pun Crypts contain a secret entrance into the Mansion that opens when pressing a button on the "M.T. Tomb" crypt."

## Stretching Room ##
Upon entering from the foyer, there is no way out ("no windows, and no doors".) Some puzzle can "activate" the stretch room (teleport to a separate location) that then has the exits available.

## Master Gracey's Bedchamber ##
A locked door with a key needed.

## Spellbook ##
Madame Leota's spellbook can be used to...

## Bookmark ##
Found in a book from the library, the bookmark can be used to...

## Portraits ##
A hidden safe behind a portrait. Some clue to know which portrait it will be. "April" is a good once, since there can be a calendar somewhere with a not on it, and April circled on the page or something. The safe can contain some item needed elsewhere.

## Rope to the Cemetary ##
A ladder can be used to get to the rafters of the stretch room (the one where the ceiling has disappeared and the body is hanging). There could be extra rope there which could be used to lower down from the ledge in the attic to the cemetary.

## Alcove in the Grand Hall ##
The area behind the curtain (only open during Haunted Mansion Holiday) can be a secret location revealed with some kind of Christmas-related puzzle.

## Chicken ##
The rubber chicken could be taken to the "exit" to win the game or at least get something special needed elsewhere ;-) Chicken Exit.

## Rose ##
The rose always left on the tombstone outside the WDW mansion could be an item. Maybe the conservatory flowers could be removed and a fresh rose placed there, which would make something happen.

## Bright Lights ##
The famous spiel mention ghosts are "frightfully sensative to bright lights." There should be a room full of ghosts, but bringing in a source of bright light causes them to stop, then you can go somewhere from there. Graveyard caretaker has a lantern! (KT)

## Madame Leota can help... ##
The dialog that was restored, then removed, mentioned that "they all have trouble getting through. Perhaps Madame Leota can help..." Something tied to that line where you use her crystal ball?

## 1969 and 1971 ##
Perhaps some calendar reference to the year each haunted mansion opened? Could be the combination to the safe behind the portrait.

## Playful spirits... ##
It would be fun to do something related to the breakdown spiel.


# EASY mode #
Carry unlmited objects.
Show "un-takable" objects in rooms so you know you can do something with them. Non-easy would not show them and you'd hav eto figure it out from the description.