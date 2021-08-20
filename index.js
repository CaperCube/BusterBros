////////////////////////////////////////
// Imports (server only)
////////////////////////////////////////
const nGame = require("./src/server/NetGame");

////////////////////////////////////////
// required packages
////////////////////////////////////////
require('dotenv/config');
const express = require('express');
const { SocketAddress } = require("net");
const port = process.env.PORT || 8080;
// Server communication
const app = express();
const serv = require('http').Server(app);
const io = require('socket.io')(serv,{});
var fs = require('fs');

////////////////////////////////////////
// Constants
////////////////////////////////////////
const fExt = `.json`;
const levelPath = `levels/`;

////////////////////////////////////////
// Server setup
////////////////////////////////////////
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname + '/src/client'));

// listen for requests
serv.listen(port);

////////////////////////////////////////
// Game Init
////////////////////////////////////////

//let newPlayer = new nGame.NetPlayer("Stinky");
let netUtils = new nGame.Utils();
let serverGame = new nGame.NetGame();
//newGame.netEntities[0] = newPlayer;

////////////////////////////////////////
// Socket Connection
////////////////////////////////////////
let SOCKET_LIST = {};

io.sockets.on('connection', function(socket) {
    // When a user connects to the server
    // Give the connection a unique ID and store it
    socket.ID = Math.random();
    socket.player = new nGame.NetPlayer(socket.ID);
    SOCKET_LIST[socket.ID] = socket;

    console.log(`Welcome ${socket.ID}!`);

    ///////////////////////////////////////
    // Client join
    ///////////////////////////////////////
    // Add player to game's playerlist
    //serverGame.netPlayers.push(socket.player);
    serverGame.netPlayers[socket.ID] = socket.player;

    // If no game started, start one when a player connects
    /*
    if (!serverGame.isRunning) {
        // Init the level from the start game request
        //serverGame.level = data.level;

        // Send to all players the server level
        for (var sID in SOCKET_LIST) {
            if (sID != socket.ID) SOCKET_LIST[sID].emit('loadServersLevel', serverGame.level);
        }

        // Start the game!
        serverGame.StartGame(SOCKET_LIST);
    }
    */

    ///////////////////////////////////////
    // Generate and init server-side message listeners from NetGame object
    ///////////////////////////////////////
    function EvalWinner() {
        let playerCount = Object.keys(serverGame.netPlayers).length;
        let lostPlayers = 0;
        let wonPlayer = null;
        for (var p in serverGame.netPlayers) {
            if (serverGame.netPlayers[p].lives <= 0) lostPlayers++;
            else wonPlayer = serverGame.netPlayers[p];
        }
        if (playerCount > 1 && lostPlayers === playerCount-1) {
            // Tell all players that someone has won
            for (var sID in SOCKET_LIST) {
                SOCKET_LIST[sID].emit('serverPlayerWon', wonPlayer.socketID);
            }
        }
    }

    // Player updates
    socket.on('clientChangeSkin', function(data) {
        // Set network player's skin
        if (serverGame.netPlayers[socket.ID]) serverGame.netPlayers[socket.ID].skin = data;
        console.log(`${socket.ID} has changed their skin to ${data}`);
    });

    socket.on('clientChangeName', function(data) {
        // Set network player's name
        if (serverGame.netPlayers[socket.ID]) serverGame.netPlayers[socket.ID].name = data;
        console.log(`${socket.ID} has changed their name to ${data}`);

        // Join the player to the game
        socket.emit('joinConfirm', {level: serverGame.level, id: socket.ID});
    });

    socket.on('clientStartGame', function(data) {
        // Init the level from the start game request
        serverGame.level = data.level;

        // Send to all players the server level
        for (var sID in SOCKET_LIST) {
            // Reset lives
            serverGame.netPlayers[sID].lives = 10;
            // Set level to hosts
            if (sID != socket.ID) SOCKET_LIST[sID].emit('loadServersLevel', serverGame.level);

            // Tell players to reset game
            SOCKET_LIST[sID].emit('resetGame');
        }

        // Start the game!
        serverGame.StartGame(SOCKET_LIST);
    });

    socket.on('clientMove', function(data){
        // Get player with this socket.ID (if they exist)
        if (serverGame != null) {

            //let myPlayer = serverGame[socket.ID];
            if (socket.player != null) {
                // Move net player
                socket.player.position = data.position;
                socket.player.dir = data.dir;
                socket.player.parry = data.parry;
                //console.log(socket.player.position);
            }
        }
    });

    // Level listeners
    socket.on('clientAddTile', function(data){
        // Is the game running?
        //if (serverGame != null) {
        if (serverGame && serverGame.serverTickRef) {
            // Add tile to server level
            if (serverGame.level) serverGame.level.push(data);

            // Tell other players that a tile has been placed
            for (var sID in SOCKET_LIST) {
                if (sID != socket.ID) SOCKET_LIST[sID].emit('serverAddTile', data);
            }
        }
    });

    socket.on('clientRemoveTile', function(data){
        // Is the game running?
        //if (serverGame != null) {
        if (serverGame && serverGame.serverTickRef) {
            // Remove tile from server level
            if (serverGame.level) {
                //let tileHere = netUtils.BlockHere(netUtils, serverGame, { size: {x: serverGame.gridCellSize, y: serverGame.gridCellSize} }, data.position.x, data.position.y);
                //let tileIndex = serverGame.level.indexOf(tileHere);
                let tileIndex = serverGame.level.indexOf(netUtils.GetTileByPosition(serverGame, data.position));

                //console.log(serverGame.level);
                //console.log(data);
                //console.log(tileIndex);

                //serverGame.level.splice(tileIndex, 1);
                //console.log(serverGame.level);
                if (tileIndex) {
                    //console.log(`Tile removed at x: ${data.position.x}, y: ${data.position.y}`);
                    serverGame.level[tileIndex] = null;
                }
            }

            // Tell other players that a tile has been placed
            for (var sID in SOCKET_LIST) {
                if (sID != socket.ID) SOCKET_LIST[sID].emit('serverRemoveTile', data);
            }
        }
    });

    socket.on(`clientUpdateTile`, function(data) {
        if (serverGame && serverGame.serverTickRef) {
            // Update tile in server level
            if (serverGame.level) {

                let tileIndex = serverGame.level.indexOf(netUtils.GetTileByPosition(serverGame, data.position));
                if (tileIndex) {
                    //serverGame.level[tileIndex] = null;
                    serverGame.level[tileIndex].tileIndex = data.tileIndex;
                }
            }
            // Tell other players that a tile has been placed
            for (var sID in SOCKET_LIST) {
                if (sID != socket.ID) SOCKET_LIST[sID].emit('serverUpdateTile', data);
            }
        }
    });

    socket.on(`clientSaveLevel`, function(data) {
        // Save the level in the server's level directory
        //let fName = (`level_${Math.random().toString()}`).replace(/\./g,'');
        let fName = (`level_temp`);
        ExportFile(JSON.stringify(data), fName+fExt, levelPath);
    });

    socket.on(`clientLoadLevel`, function(data) {
        if (serverGame) {
            // Load the temp saved level if it exists
            let levelF = `${levelPath}level_temp${fExt}`;
            // Read from file
            let loadedLevel = LoadFile(levelF, function(data) {
                // Convert index array into tile array
                serverGame.level = ParseLevel(data);

                // Send to all players the server level
                for (var sID in SOCKET_LIST) {
                    // Reset lives
                    serverGame.netPlayers[sID].lives = 10;
                    // Set level to hosts
                    SOCKET_LIST[sID].emit('loadServersLevel', serverGame.level);
                    // Tell players to reset game
                    SOCKET_LIST[sID].emit('resetGame');
                }
            });
        }
    });

    // Player death
    socket.on('clientStompPlayer', function(data){
        // Get player with this socket.ID (if they exist)
        if (serverGame != null) {

            let myPlayer = serverGame.netPlayers[socket.ID];
            if (myPlayer != null) {
                
                // Check if data.otherPlayer exists
                let targetPlayer = serverGame.netPlayers[data.otherPlayerID];
                if (targetPlayer != null) {

                    // If target is parrying, deflect stomp
                    if (targetPlayer.parry) {
                        // Deflect
                        SOCKET_LIST[data.attackingPlayerID].emit('serverDeflected');
                    }
                    else {
                        // Try to stomp the other player
                        //serverGame.TryStomp(myPlayer, targetPlayer);

                        // Remove a life from this player
                        targetPlayer.lives--;
                        //If all lives are gone, tell the losing player
                        EvalWinner();

                        // Tell all players that a has been stomped
                        for (var sID in SOCKET_LIST) {
                            //if (sID != socket.ID)
                            SOCKET_LIST[sID].emit('serverStomped', {
                                attackingPlayerID: data.attackingPlayerID,
                                otherPlayerID : data.otherPlayerID
                            });
                        }
                    }
                }

            }
        }
    });

    socket.on(`clientUnStompPlayer`, function(data){
        // Tell all players that a has been stomped
        let p = serverGame.netPlayers[data.playerID];
        if (p && p.lives > 0) {
            for (var sID in SOCKET_LIST) {
                SOCKET_LIST[sID].emit('serverUnStompPlayer', {
                    playerID: data.playerID
                });
            }
        }
    });

    // Sound triggers
    socket.on(`clientTriggerSound`, function(data){
        // Tell all clients to play the sound
        for (var sID in SOCKET_LIST) {
            SOCKET_LIST[sID].emit('serverTriggerSound', data);
        }
    });

    // Create listener for this user disconnecting
    socket.on('disconnect', function(){
        // Remove player (if applicable)
        //SOCKET_LIST.splice(socket.ID, 1);
        // Tell others that I left
        for (var sID in SOCKET_LIST) {
            if (sID != socket.ID) SOCKET_LIST[sID].emit(`serverPlayerLeft`, socket.ID);
        }
        //serverGame.netPlayers.splice(socket.ID, 1);
        delete serverGame.netPlayers[socket.ID];
        delete SOCKET_LIST[socket.ID];

        //console.log(SOCKET_LIST);
    });
});

// Exports the given array as a text file 
function ExportFile(saveData, fName, dir) {
    // Get dir
    var fileDir = dir || "";

    // Save file
    if (fileDir != "") {
        // Create directory if it doesn't exist
        if (!fs.existsSync(fileDir)){
            fs.mkdirSync(fileDir);
        }
        // Write file to directory
        fs.writeFile(`${fileDir}${fName}`, saveData, function(err, data){
            if (err) {
                return console.log(err);
            }
        });
    }
    else {
        // Write file
        fs.writeFile(`./${fName}`, saveData, function(err, data){
            if (err) {
                return console.log(err);
            }
        });
    }
}

// Imports the given file as a string array
function LoadFile(fName, callback) {
    // Read entire file and split it up
    if (fs.existsSync(fName)){
        fs.readFile(fName, function(err, data) {
            if(err) throw err;
            // Convert data to js array
            let loadedData = JSON.parse(data.toString());

            console.log(`File ${fName} has finished loading.`);
            //console.log(loadedData);

            callback(loadedData);
        });
    }
    else console.log(`${fName} does not exist.`);
}

function ParseLevel(l) {
    let parsedLevel = [];
    let gridCellSize = serverGame ? serverGame.gridCellSize : 16;

    // Loop through 2D array and create tiles from it
    for (var i = 0; i < l.length; i++) {
        for (var j = 0; j < l[i].length; j++) {
            if (l[i][j] != null) {
                parsedLevel.push(new nGame.TileWall(
                    gridCellSize * j,
                    gridCellSize * i,
                    l[i][j]
                ));
            }
            else parsedLevel.push(null);
        }
    }

    console.log(`Level has been parsed.`);

    return parsedLevel;
}

console.log("Server has started");