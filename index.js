////////////////////////////////////////
// Imports (server only)
////////////////////////////////////////
const nGame = require("./src/server/NetGame");

////////////////////////////////////////
// required packages
////////////////////////////////////////
require('dotenv/config');
const express = require('express');
const port = process.env.PORT || 8080;
// Server communication
const app = express();
const serv = require('http').Server(app);
const io = require('socket.io')(serv,{});

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
    // Tell new player their ID
    socket.emit('joinConfirm', {level: serverGame.level, id: socket.ID});
    // Add player to game's playerlist
    //serverGame.netPlayers.push(socket.player);
    serverGame.netPlayers[socket.ID] = socket.player;

    ///////////////////////////////////////
    // Generate and init server-side message listeners from NetGame object
    ///////////////////////////////////////
    socket.on('clientStartGame', function(data) {
        // Init the level from the start game request
        serverGame.level = data.level;

        // Send to all players the server level
        for (var sID in SOCKET_LIST) {
            if (sID != socket.ID) SOCKET_LIST[sID].emit('loadServersLevel', serverGame.level);
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
                    console.log(`Tile removed at x: ${data.position.x}, y: ${data.position.y}`);
                    serverGame.level[tileIndex] = null;
                }
            }

            // Tell other players that a tile has been placed
            for (var sID in SOCKET_LIST) {
                if (sID != socket.ID) SOCKET_LIST[sID].emit('serverRemoveTile', data);
            }
        }
    });

    socket.on('clientStompPlayer', function(data){
        // Get player with this socket.ID (if they exist)
        if (serverGame != null) {

            let myPlayer = serverGame.netPlayers[socket.ID];
            if (myPlayer != null) {
                
                // Check if data.otherPlayer exists
                let targetPlayer = serverGame.netPlayers[data.otherPlayerID];
                if (targetPlayer != null){

                    // Try to stomp the other player
                    //serverGame.TryStomp(myPlayer, targetPlayer);

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
    });

    socket.on(`clientUnStompPlayer`, function(data){
        // Tell all players that a has been stomped
        for (var sID in SOCKET_LIST) {
            SOCKET_LIST[sID].emit('serverUnStompPlayer', {
                playerID: data.playerID
            });
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

console.log("Server has started");