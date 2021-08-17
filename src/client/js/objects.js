var gridCellSize = 16;

////////////////////////////////////////////////////////
// Objects
////////////////////////////////////////////////////////
// !! not used !! //
function Wall(iw, ih, ix, iy, ti){//color) {
    this.size = {
        w: iw || gridCellSize,
        h: ih || gridCellSize
    };
    
    this.position = {
        x: ix || 0,
        y: iy || 0
    };
    
    //this.color = color || "#223355";

    this.tIndex = ti || 0;
}

function TileWall(ix, iy, ti, owner = 0){
    this.position = {
        x: ix || 0,
        y: iy || 0
    };
    
    this.tileIndex = ti || 0;
    this.ownerId = owner || 0;
}

function Spawn(ix, iy, color, pId) {
    this.player = pId || 0;
    this.size = {
        w: gridCellSize,
        h: gridCellSize
    };
    
    this.position = {
        x: ix || 0,
        y: iy || 0
    };
    
    this.color = color || "#223355";
}

function Player(ix, iy, color, pid) {
    this.id = pid || 0;
    this.playerName = `Player`;
    this.skin = 0;
    
    this.size = {
        w: gridCellSize * 0.9,
        h: gridCellSize * 0.9
    };
    
    this.position = {
        x: ix || 0,
        y: iy || 0
    };
    
    this.velocity = {
        x: 0,
        y: 0
    };
    
    this.color = color || playerColors[0];

    this.lives = 10;
    this.stomped = false;
    
    // Movement vars
    this.moveSpeed = 0.4;
    this.dir = 1;
    this.look = 0;
    this.parry = false;
    this.canParry = true;
    
    this.jumpSpeed = 1.6; //2.8; //3.2;
    this.jumpCurveTime = 100; // time in ms
    this.allowJumpCurve = false;
    this.totalJumps = 1;
    this.usedJumps = 0;
    
    // Building vars
    this.cursor = {
        x: -2 * gridCellSize,
        y: -2 * gridCellSize
    };
    this.block = 155;

    //Other vars
    this.health = 100;
    
    this.totalAmmo = 8;
    this.usedAmmo = 0;
    this.bulletSpeed = this.moveSpeed * 10;
    this.damage = 5;
}

// !! not used !! //
function networkPlayer(ix, iy, color) {
    this.id = 0;
    this.size = {
        w: gridCellSize * 0.9,
        h: gridCellSize * 0.9
    };
    
    this.position = {
        x: ix || 0,
        y: iy || 0
    };
    
    this.color = color || playerColors[1];
    
    //Other vars
    this.health = 100;
    this.damage = 5;
    this.dir = 1;
}

function Bullet(ix, iy, owner, vx, vy) {
    this.ownerId = owner || 0;
    this.color = "#ffffff";
    
    this.position = {
        x: ix || 0,
        y: iy || 0
    };
    
    this.velocity = {
        x: vx || 0,
        y: vy || 0
    };
    
    this.size = {
        w: gridCellSize/3,
        h: gridCellSize/3
    }
}

var healthBar = {
    size: {w: gridCellSize*2, h: gridCellSize/4}
}
var ammoBar = {
    size: {w: gridCellSize*2, h: gridCellSize/4}
}

////////////////////////////////////////////////////////
// Game Vars
////////////////////////////////////////////////////////
var BGTiles = [];
var Walls = [];
var Spawns = [];
var DeathZones = [];
var Players = [];
var NetPlayers = [];
var Bullets = [];

var playerColors = ["#3366ff", "#ff4400", "#ffee00", "#11ff55"];

////////////////////////////////////////////////////////
// Object Util
////////////////////////////////////////////////////////