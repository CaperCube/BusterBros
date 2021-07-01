////////////////////////////////////////
// Imports (server only)
////////////////////////////////////////
const nGame = require("./src/server/NetGame");

////////////////////////////////////////
// required packages
////////////////////////////////////////
require('dotenv/config');
const express = require('express');
const port = process.env.PORT || 27015;
const app = express();
// Server communication
const serv = require('http').Server(app);
const io = require('socket.io')(serv,{});

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname + '/client'));
app.listen(port);

////////////////////////////////////////
// Socket Connection
////////////////////////////////////////
let SOCKET_LIST = {};

io.sockets.on('connection', function(socket) {
    // When a user connects to the server
    // Give the connection a unique ID and store it
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    // Init user's player (change this bit so the user must make / join a game first)
    socket.player = new nGame.NetPlayer("Player");
    socket.player.socketID = socket.id;

    ///////////////////////////////////////
    // Generate and init server-side message listeners from NetGame object
    ///////////////////////////////////////


    // Create listener for this user disconnecting
    socket.on('disconnect', function(){
        // Remove player (if applicable)

    });
});

////////////////////////////////////////
// Game Init
////////////////////////////////////////

let newPlayer = new nGame.NetPlayer("Stinky");
let newGame = new nGame.NetGame(newPlayer);

newGame.netEntities[1] = newPlayer.name;

////////////////////////////////////////
// Update Tick
////////////////////////////////////////
newGame.serverTickRef = setInterval(newGame.serverTick(SOCKET_LIST), newGame.serverTickTime);

console.log(newGame.netEntities);
console.log(newGame.gameId);