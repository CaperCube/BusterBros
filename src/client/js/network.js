const socket = io();

function CreateMyPlayer() {
    socket.emit(`createPlayer`);
}

socket.on(`serverPlayerLeft`, function(data){
    console.log(`Player ${data} has left`);
    
    //console.log(Players);
    //delete Players[Players[data].id];
    //delete Players[data];
    Players[data] = undefined;
    //console.log(Players);
    /*
    for (var p in Players) {
        if (Players[p].id === data) Players.splice(Players[p].id, 1);
    }
    */
});

function startGame(myLevel) {
    // Delete all players except mine
    for (var p in Players) if (Players[p].id != myID) Players.splice(Players[p], 1);
    // Send request to start net game
    socket.emit(`clientStartGame`, {level: myLevel});
}
//Buttons.s.onPress = startGame;

socket.on(`loadServersLevel`, function(data){
    console.log(`Server has given us a new level`);
    Walls = data;
});

socket.on(`ServerPacket`, function(data){
    //
    //console.log(data);
    //console.log(`Client Players: ${Players.length}\nNetwork Players: ${data.players.length}`);

    //
    // ToDo: loop through client players and remove ones that aren't present in ServerPacket
    //
    //for (var nPlayer in data) {
    for (var i = 0; i < data.players.length; i++) {
    //for (var p in data.players) {
        //console.log(data.players[i]);
        let nPlayer = data.players[i];
        //let nPlayer = data.players[p];

        //console.log(Players[nPlayer.socketID]);

        //if (Players[nPlayer.socketID] !== undefined && Players[nPlayer.socketID] !== null) {
        if (nPlayer.socketID !== myID) {
            if (Players[nPlayer.socketID]) {
                Players[nPlayer.socketID].position = nPlayer.position;
                Players[nPlayer.socketID].dir = nPlayer.dir;
                Players[nPlayer.socketID].parry = nPlayer.parry;
            }
            else {
                // if this player does not exist, create them
                Players[nPlayer.socketID] = (new Player(
                    nPlayer.position.x,
                    nPlayer.position.y,
                    playerColors[1],
                    nPlayer.socketID
                ));
            }
        }
        // This is the client, send my movement data to server
        else {
            //
            if (Players[myID]) {
                let playerData = {
                    position: Players[myID].position,
                    dir: Players[myID].dir,
                    parry: Players[myID].parry
                };
                SendPlayerData(playerData);
            }
        }
    }
});

function SendPlayerData(p) {
    socket.emit(`clientMove`, p);
}

// Send and recive tile updates
function SendNewTile(newTile) {
    socket.emit(`clientAddTile`, newTile);
}

function SendRemovedTile(newTile) {
    socket.emit(`clientRemoveTile`, newTile);
}

socket.on(`serverAddTile`, function(data){
    let newTile = new TileWall(
        data.position.x,
        data.position.y,
        data.tileIndex
    );
    Walls.push(newTile);
});

socket.on(`serverRemoveTile`, function(data){
    let tileHere = BlockHere({size: Players[myID].size}, data.position.x, data.position.y);
    let tileIndex = Walls.indexOf(tileHere);
    Walls.splice(tileIndex, 1);
});

// Attack player
function StompPlayer(p) {
    // Senda network message
    socket.emit(`clientStompPlayer`, {
        attackingPlayerID: myID,
        otherPlayerID: p.id
    });
}

// UnStomp self
function UnStompSelf() {
    socket.emit(`clientUnStompPlayer`, {
        playerID: myID
    });
    
    //console.log(`Tyring to unstomp self`);
}

// Server UnStomp
socket.on(`serverUnStompPlayer`, function(data){
    //Players[data.attackingPlayerID]; // the one who stomped
    if (Players[data.playerID]) Players[data.playerID].stomped = false;

    console.log(`Player ${data.playerID} has been unstomped`);
});

// Got Stomped
socket.on(`serverStomped`, function(data){
    //Players[data.attackingPlayerID]; // the one who stomped
    let p = Players[data.otherPlayerID];
    if (p) {
        // Stomp player
        p.stomped = true;
        // Play some fx here
        StompFX({x: p.position.x, y: p.position.y - 1});
    }
});

/*
socket.on(`clientMove`, function(data){
        // Get player with this socket.ID (if they exist)
        if (serverGame != null) {

            let myPlayer = serverGame[socket.ID];
            if (myPlayer != null) {

                // Move net player
                myPlayer.position = data.position;
            }
        }
    });
*/