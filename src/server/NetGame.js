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
function NetGame(host) {
    // Keep track of an active game's state and data here
    this.serverTickTime = 1000/30; // 1000/fps (this is the time between messages sent to connected players)
    this.serverTickRef; // This will hold the setInterval reference for the server updates

    this.level = null; // The level that's served to each player when a game is started
    this.netEntities = []; // players, powerups, hazards, etc.
    this.host = "";

    this.Constructor = function() {
        this.netEntities = [host];
        this.gameID = GenerateID();

        console.log(`A new Net game has been created!\nID: ${this.gameId}\nHost: ${host}`);
    }
    this.Constructor();

    //
    // Server update function
    //
    this.serverTick = function(socketList) {
        ////////////////////////////
        // Update NetEntities
        ////////////////////////////
        for (var i = 0; i < this.netEntities.length; i++) {
            //if (this.netEntities[i].type)
            this.netEntities[i].update();
        }

        ////////////////////////////
        // Send updates to connected players
        ////////////////////////////
        for (var i in socketList) {
            // Send packets
            // movement changes of authors should be ignored on client-side
            
            //let pack = this.netEntities;
            //socketList[i].emit('ServerPacket', pack);
        }
    }
}

module.exports.NetEntity = NetEntity;
function NetEntity(ix, iy) {
    this.name = "Entity";
    this.type = "Entity";
    this.position = {x: 0, y:0};

    this.Constructor = function() {
        this.position = {x: ix, y: iy};
    }
    this.Constructor();

    this.update = function() {
        //
        console.log(this.name + " updated!");
    }
}

module.exports.NetPlayer = NetPlayer;
function NetPlayer(pName, ix, iy) {
    NetEntity.call(this);

    this.Constructor = function() {
        this.name = pName;
        this.type = "Player";
        this.position = {x: ix, y: iy};
    }
    this.Constructor();
}