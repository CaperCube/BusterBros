# BusterBros
-----------------------------------------------------------
## Description:

This project is a online multiplayer pvp platformer game inspired by games like [Super Mario War](https://en.wikipedia.org/wiki/Super_Mario_War) and [Jump 'n Bump](https://en.wikipedia.org/wiki/Jump_%27n_Bump).

Some goals for this project include but are not limited to:
1. Tons of customization
2. Live collaborative level editor
3. Fun game

-----------------------------------------------------------
## Contribution:

I'm somewhat open to colaborating on this project... idk, just ask I guess.

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
## Have fun!