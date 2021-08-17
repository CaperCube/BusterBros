const socket = io();

function EnterJoin(o) {
    if (event.key === 'Enter') {
        o.blur();
        JoinWithName(o);
    }
}

function JoinWithName(o) {
    console.log(`sending name to server`);
    socket.emit(`clientChangeName`, o.value);
    o.blur();
    $('#DOM_join_options').style.display = 'none';
}

function ChangeSkin(o) {
    console.log(`sending skin to server`);
    socket.emit(`clientChangeSkin`, o);
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
    //for (var p in Players) if (Players[p].id != myID) Players.splice(Players[p], 1);
    // Send request to start net game
    if (Players[myID]) RespawnPlayer(Players[myID]);
    socket.emit(`clientStartGame`, {level: myLevel});
}
//Buttons.s.onPress = startGame;

socket.on(`resetGame`, function(data) {
    winningPlayer = null;
});

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
        
        // If this is not the client player...
        if (nPlayer.socketID !== myID) {
            // Update this player
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
        // Either way, update the name
        Players[nPlayer.socketID].playerName = nPlayer.name;
        Players[nPlayer.socketID].skin = nPlayer.skin;
        Players[nPlayer.socketID].lives = nPlayer.lives;
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
    BUILD_SFX.Play();
});

socket.on(`serverRemoveTile`, function(data){
    let tileHere = BlockHere({size: Players[myID].size}, data.position.x, data.position.y);
    let tileIndex = Walls.indexOf(tileHere);
    Walls.splice(tileIndex, 1);
    REMOVE_SFX.Play();
});

// Attack player
function StompPlayer(p) {
    // Send a network message
    socket.emit(`clientStompPlayer`, {
        attackingPlayerID: myID,
        otherPlayerID: p.id
    });
}

// UnStomp self
function UnStompSelf() {
    // Send network message
    socket.emit(`clientUnStompPlayer`, {
        playerID: myID
    });
    
    //console.log(`Tyring to unstomp self`);
}

// Server UnStomp
socket.on(`serverUnStompPlayer`, function(data){
    // Play sound
    //POP_SFX.Play();
    //Players[data.attackingPlayerID]; // the one who stomped
    //let thisPlayer = Players[data.playerID];
    //if (thisPlayer) thisPlayer.stomped = false;

    RespawnPlayer(Players[data.playerID]);

    console.log(`Player ${data.playerID} has been unstomped`);
});

// Got Stomped
socket.on(`serverStomped`, function(data){
    //Players[data.attackingPlayerID]; // the one who stomped
    let p = Players[data.otherPlayerID];
    // Stomp player
    GetStomped(p);
});

// Got Deflected
socket.on(`serverDeflected`, function(data) {
    // boost into the air
    Players[myID].velocity.y = -4;
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

//#region Network sounds
function TriggerNetworkSound(type) {
    socket.emit(`clientTriggerSound`, type);
}

socket.on(`serverTriggerSound`, function(data){
    switch (data) {
        case `jump`:
            JUMP_SFX.Play();
            break;
        case `land`:
            LAND_SFX.Play();
            break;
        default:
            //
            break;
    }
});
//#endregion

let winningPlayer = null;
socket.on(`serverPlayerWon`, function(data){
    // Display message that player data was won
    if (Players[data]) winningPlayer = Players[data].playerName;
});