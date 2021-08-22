# BusterBros
-----------------------------------------------------------
## Description:

This project is a online multiplayer pvp platformer game inspired by games like [Super Mario War](https://en.wikipedia.org/wiki/Super_Mario_War) and [Jump 'n Bump](https://en.wikipedia.org/wiki/Jump_%27n_Bump).

![Stomping on a player](/social/BasicStomp.gif?raw=true "Stomping on a player")

-----------------------------------------------------------
## Goals:
Use these to help guide the features of this project.

* Simple code: Try to keep things neat and easy to read. As a stretch goal for myself I've been trying to keep my library dependencies to a minimum; this isn't strictly necessary, but I think it's a fun challenge.
* Quick to play: Players should be able to hop in and out on a whim. Think low time commitment (<= 5min)
* Collaborative editors: If you want to make a level (or possibly other things too) you should be able to do this live with friends just as easily as playing the game.
* Fun over all: I believe that games are more fun if you let them be fun. If something is unbalanced, broken, but fun, don't remove it; just allow it to be disabled / enabled or adjusted. I'd like to err on the side of creating a customizable experience rather than a specific one.

-----------------------------------------------------------
## Contribution:
I'm open to colaborating on this project for the most part. I mostly would like to stick pretty close to the project goals (at least on the main branch), but I can also be flexible.

-----------------------------------------------------------
## Hosting a server:

Here's some beginner / intermediate level instructions to get this bot up and running:

1. Install dev environment (I like VSCode).
2. Install Node.js on your system.
3. Create a directory on your system and put the contents of the project here
4. Open VSCode and use *File > Open Folder...* to open this folder.
5. Click *Terminal > New Terminal*.
6. Run the command `npm init` and take note of the app entry name (i.e. `index.js`), make sure it matches the js file in the root folder of the project.
7. Run the command `npm install` in the terminal to install the project's node packages.
8. Create a file called `.env` in the main directory (where `package.json` is located).
9. Edit this file and write `PORT = ` followed by your desired server port (`8080` works fine).
10. Type `node .` in the terminal, and hit enter to start the server.
11. To connect to the game, open a browser and type in your IP address followed by the port the server's running from (example: `192.168.0.1:8080`).
12. Close VSCode or click in the terminal and press `Ctrl + c` to stop the server.

**Note**
- Only the server operator should need to perfor this set-up, all connecting players only need to do step 11.
- You will likely need to port-forward for other off-network players to connect to your server.

-----------------------------------------------------------
## How to play:

- Once you've completed step 11, you should see the game running.
- Type in your name at the bottom and click `Join`. This will spawn your player in the world and join the game if it has been hosted.
- Now you can click `Host Game` to start a muliplayer session. If you cliked host, the server will send your level to all connected players.
- Jump on other player's heads to squash them, last one standing wins!
- To reset the game, just click `Host Game` again
- The default controls are: 
    - Move: **← →**
    - Look: **↑ ↓**
    - X: **Jump**
    - C: **Place / Remove tile**
    - Change tile: **1 - 0** *or* **+ -**
    - Respawn: **P**

-----------------------------------------------------------
## Roadmap:
This is a loose set of features I think would support the goals listed above.

- [ ] Local multiplayer
- [ ] Clean-up tile storage (probably use a 2D array)
- [ ] Collab Level Editor mode (rather than having a seperate editor)
	- [ ] Edit / create levels with friends
	- [ ]Anyone can switch themselves between tesing and editing at any time
- [ ] Item pickups
	- [ ] Block pickups (assuming the player can't always place blocks)
	- [ ] Double jump
	- [ ] Speed up
	- [ ] Killer parry
	- [ ] Extra life
	- [ ] Throwable something
- [ ] Special tiles
	- [ ] Item blocks: Bump to get item
	- [ ] Telleporter / Doorways: Enter one, come out the other
	- [ ] Water: Low gravity & infinite jumps
- [ ] Moving tiles / platforms
- [ ] Animated tiles
- [ ] UI for loading saved levels
- [ ] Custom player sprite sheets
- [ ] Game modes:
    - [ ] Last one standing: Last one alive wins
    - [ ] Kill count: First to a set number of kills wins
    - [ ] Team battle: First team to set number of kills wins
	- [ ] Hoard mode: Fight waves of NPCs with your friends

-----------------------------------------------------------
## Have fun!
