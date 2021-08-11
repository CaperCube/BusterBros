const socket = io();

function CreateMyPlayer() {
    socket.emit(`createPlayer`);
}

function startGame() {
    socket.emit(`startGame`);
}
//Buttons.s.onPress = startGame;

socket.on(`ServerPacket`, function(data){
    //
    //console.log(data);
    //console.log(`Client Players: ${Players.length}\nNetwork Players: ${data.players.length}`);

    //for (var nPlayer in data) {
    for (var i = 0; i < data.players.length; i++) {
        //console.log(data.players[i]);
        let nPlayer = data.players[i];

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
            if (Players[0]) {
                let playerData = {
                    position: Players[0].position,
                    dir: Players[0].dir,
                    parry: Players[0].parry
                };
                SendPlayerData(playerData);
            }
        }
    }
});

function SendPlayerData(p) {
    socket.emit(`clientMove`, p);
}

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