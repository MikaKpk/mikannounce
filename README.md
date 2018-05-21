# mikannounce
a simple announcement tool for train games

This was created with MetroSim from sim.bemined.nl in mind, but really, this works for any train or bus sim game.
For MetroSim specifically this supports displaying a image of the current train and line withint the chat service Discord.


I have kind of lost interest in continuing developement on this so I encourage you to contribute to the project.

Currently on the Todo list:
\> Use electron for a graphical interface
\> better keypress detection
\> establish activity file format (which overall will just contain a collection of routes for a mappack and a associated train)
\> clean up some spaghetti (Mario will be sad :( )

**Usage**

Usage is very simple, however currently only terminal based

Commands
**/trains**: List available trains (for display in Discord)
**/train x**: Select a train by ID (for display in Discord)
**/maps**: List available mappacks
**/map load x**: Loads a map (with safety check)
**/map load force x**: Loads a map (ignores safety check)
**/routes**: List available routes in the selected map
**/route x**: selects a route by number
**Just hitting enter**: Play next announcement

**Developement**

For reference, a commented mapfile can be found, which is the U4 Berlin. That line exists in reality, but not in the game. However, since it only has 5 stations it was chosen as a example and test line.

**Dependencies**
Mikannounce requires discord-rpc to be installed using `npm install discord-rpc`
To play any sound, mpg123 is needed https://www.mpg123.de/download.shtml, but technically it can be used with any command line based media player, if you find a better one, message me.
And most importantly you need Node JS to be installed for this to run.
