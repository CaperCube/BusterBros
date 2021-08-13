// ID Generator
function GenerateID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'
    return s4() + s4();
}

module.exports.NetGame = NetGame;
function NetGame() {
    // Keep track of an active game's state and data here
    this.serverTickRef; // This will hold the setInterval reference for the server updates
    this.gameID = GenerateID();

    this.gridCellSize = 16; // This should be a constant
    this.level = null; // The level that's served to each player when a game is started
    this.netEntities = []; // powerups, hazards, etc.
    this.netPlayers = []; // players only
    //this.host = "";

    this.gameOptions = {
        serverTickTime: 1000/60, // 1000/fps (this is the time between messages sent to connected players)
        stompsToWin: 10,
        stompThreshhold: 10
    };

    // Server packet data to be sent
    this.serverPacket = {
        serverMessageFlag: false,
        serverMessage: "",
    };

    /////////////////////////////////////
    // Game function
    /////////////////////////////////////
    this.StartGame = function(sList) {
        // Init the serverTick
        console.log(`A new Net game has been started!\nGame ID: ${this.gameID}`);

        var intervalGameRef = this;

        // Create interval
        this.serverTickRef = setInterval(function(){
            intervalGameRef.serverTick(sList);
        }, this.gameOptions.serverTickTime);
    }

    // Client tries to stomp a player
    this.TryStomp = function(attacker, target) {
        // Check if attacker is above target
        // if (dist < this.gameOptions.stompThreshhold)

        // If stomp succeeds: 
        // * Edit server players with changes
        // * Set game message alert
        //      this.serverPacket.serverMessageFlag = true;
        //      this.serverPacket.serverMessage = `${this.netPlayers[attacker]} has killed ${this.netPlayers[target]}`;
        // * Players will be informed on the next server tick
        // 
    }

    //
    // Server update function
    //
    this.serverTick = function(socketList) {

        ////////////////////////////
        // Update NetEntities
        ////////////////////////////
        /*
        for (var i = 0; i < this.netEntities.length; i++) {
            //if (this.netEntities[i].type)
            this.netEntities[i].update();
        }
        */

        ////////////////////////////
        // Assemble server packet
        ////////////////////////////
        this.serverPacket.players = [];
        for (var p in this.netPlayers) {
            this.serverPacket.players.push(this.netPlayers[p]);
        }
        //this.serverPacket.players = this.netPlayers;
        //console.log(this.serverPacket.players);
        //this.serverPacket.entities = this.netEntities;

        ////////////////////////////
        // Send updates to connected players
        ////////////////////////////

        for (var sID in socketList) {
            // Send packets
            // movement changes of authors should be ignored on client-side

            socketList[sID].emit('ServerPacket', this.serverPacket);
            //console.log(`Data has been sent to a user\nUser: ${sID}`);
        }

        ////////////////////////////
        // Reset server packet 1-frame data
        ////////////////////////////

        this.serverPacket.serverMessageFlag = false;
        this.serverPacket.serverMessage = "";

        //console.log(`Tick`);
    }
}

module.exports.NetEntity = NetEntity;
function NetEntity() {
    this.name = "Entity";
    this.type = "Entity";
    this.position = {x: 0, y: 0};

    this.update = function() {
        //
        console.log("**** " + this.name + " updated! ****");
    }
}

module.exports.NetPlayer = NetPlayer;
function NetPlayer(ID) {
    NetEntity.call(this);

    //
    // Identifying data
    //
    this.socketID = ID || 0;
    this.name = "Player " + this.socketID;
    this.type = "Player";
    
    //
    // Player state data
    //
    this.spawned = false;

    //
    // Player data
    //
    this.score = 0;
    this.position = {x: 0, y: 0};
    this.dir = 1;
    this.parry = false;

    this.update = function() {
        //
        console.log("**** " + this.name + " updated! ****");
    }
}

module.exports.Utils = Utils;
function Utils() {
    // ToDo: this is broken somehow :(
    this.BlockHere = function(util, sGame, p, xNew, yNew) {
        var temp = {
            x: xNew + 2,
            y: yNew + 4,
            w: p.size.w - 4,
            h: p.size.h - 4
        };
        for (var i = 0; i < sGame.level.length; i++) {
            var wallTemp = null;
            if (sGame.level[i] != null) {
                wallTemp = {
                    x: sGame.level[i].position.x,
                    y: sGame.level[i].position.y,
                    w: sGame.gridCellSize,
                    h: sGame.gridCellSize
                };
            }
            if (wallTemp !== null && util.Collision(temp, wallTemp)) {
                console.log(`Gotcha!`);
                return sGame.level[i];
            }
        }
        return null;
    }

    this.GetTileByPosition = function (sGame, pos) {
        for (var i = 0; i < sGame.level.length; i++) {
            var tileTemp = null;
            if (sGame.level[i] != null) {
                tileTemp = {
                    x: sGame.level[i].position.x,
                    y: sGame.level[i].position.y,
                };
            }
            if (tileTemp !== null && tileTemp.x == pos.x && tileTemp.y == pos.y) {
                console.log(`Gotcha!`);
                return sGame.level[i];
            }
        }
        return null;
    }

    this.Collision = function(r1, r2) {
        if (r1.x + r1.w > r2.x &&
            r1.x < r2.x + r2.w &&
            r2.y + r2.h > r1.y &&
            r2.y < r1.y + r1.h) {
            return true;
        } else {
            return false;
        }
    };
}