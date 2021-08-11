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
    socket.emit('joinConfirm', socket.ID);
    // Add player to game's playerlist
    serverGame.netPlayers.push(socket.player);

    ///////////////////////////////////////
    // Generate and init server-side message listeners from NetGame object
    ///////////////////////////////////////
    socket.on('startGame', function() {
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

    socket.on('clientStompPlayer', function(data){
        // Get player with this socket.ID (if they exist)
        if (serverGame != null) {

            let myPlayer = serverGame.netPlayers[socket.ID];
            if (myPlayer != null) {
                
                // Check if data.otherPlayer exists
                let targetPlayer = serverGame.netPlayers[data.otherPlayerID];
                if (targetPlayer != null){

                    // Try to stomp the other player
                    serverGame.TryStomp(myPlayer, targetPlayer);
                }

            }
        }
    });
    

    // Create listener for this user disconnecting
    socket.on('disconnect', function(){
        // Remove player (if applicable)
        //SOCKET_LIST.splice(socket.ID, 1);
        serverGame.netPlayers.splice(socket.ID, 1);
        delete SOCKET_LIST[socket.ID];

        //console.log(SOCKET_LIST);
    });
});

console.log("Server has started");