var gridCellSize = 16;

////////////////////////////////////////////////////////
// Objects
////////////////////////////////////////////////////////
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

function TileWall(ix, iy, ti){
    this.position = {
        x: ix || 0,
        y: iy || 0
    };
    
    this.tileIndex = ti || 0;
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
    
    // Movement vars
    this.moveSpeed = 0.5;
    this.dir = 1;
    
    this.jumpSpeed = 3;
    this.totalJumps = 2;
    this.usedJumps = 0;
    
    //Other vars
    this.health = 100;
    
    this.totalAmmo = 8;
    this.usedAmmo = 0;
    this.bulletSpeed = this.moveSpeed * 10;
    this.damage = 5;
}

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
    size: {w: gridCellSize*2, h: gridCellSize/2}
}
var ammoBar = {
    size: {w: gridCellSize*2, h: gridCellSize/4}
}

////////////////////////////////////////////////////////
// Draw Functions
////////////////////////////////////////////////////////
function DrawWall(cctx, o) {
    cctx.fillStyle = o.color;
    cctx.fillRect(
        o.position.x,
        o.position.y,
        o.size.w,
        o.size.h
    );
}

//https://www.creativebloq.com/html5/build-tile-based-html5-game-31410992
/*
function(sprite, singleTileSpec, x, y) {
    sprite,
    singleTileSpec.x, singleTileSpec.y, this.tileSize, this.tileSize, // source coords
    Math.floor(x * this.tileSize), Math.floor(y * this.tileSize), this.tileSize, this.tileSize // destination coords
  );
}
*/

function GetPosByIndex(area, tSize, indx) {
    let wc = area.width;
    let hc = area.height;

    return {
        x: (indx * tSize) % wc,
        y: Math.floor((indx * tSize) / hc) * tSize
    };
}

function DrawTile(cctx, tMap, tSize, idx, x, y) {
    const sampleTile = GetPosByIndex(tMap, tSize, idx);
    cctx.drawImage(
        tMap,
        sampleTile.x, sampleTile.y, tSize, tSize,
        x, y, tSize, tSize
    );
}

function DrawPlayer(cctx, p) {
    // Draw player
    cctx.fillStyle = p.color;
    cctx.beginPath();
    cctx.arc(
        p.position.x + p.size.w / 2,
        p.position.y + p.size.h / 2,
        p.size.h / 2,
        0, 2 * Math.PI,
        false
    );
    cctx.fill();
    
    // Draw gun
    cctx.fillStyle = "#555555";
    ctx.fillRect(
        p.position.x + (p.dir * (gridCellSize * 0.5)),
        p.position.y + (p.size.h / 6),
        gridCellSize * 0.8,
        gridCellSize/3
    );
    
    // Draw hp bar
    if (drawHp) DrawHeath(cctx, p);
    //if (p.id == 0)
    DrawAmmo(cctx, p);
}

function DrawHeath(cctx, p) {
    var px = p.position.x + (p.size.w/2);
    var yPoint = p.position.y - (healthBar.size.h*2)
    var sPoint = px - (healthBar.size.w/2);
    var gWidth = healthBar.size.w * (p.health/100);
    
    // BG
    cctx.fillStyle = "#ff000066";
    cctx.fillRect(
        sPoint + gWidth,
        yPoint,
        healthBar.size.w - gWidth,
        healthBar.size.h
    );
    
    // Fill
    cctx.fillStyle = "#00ff0066";
    cctx.fillRect(
        sPoint,
        yPoint,
        gWidth,
        healthBar.size.h
    );
}

function DrawAmmo(cctx, p) {
    var px = p.position.x + (p.size.w/2);
    var yPoint = p.position.y - (ammoBar.size.h*2) - healthBar.size.h - ammoBar.size.h;
    var sPoint = px - (ammoBar.size.w/2);
    var gWidth = ammoBar.size.w * (p.usedAmmo/p.totalAmmo);
    
    // BG
    cctx.fillStyle = "#bbbbff44";
    cctx.fillRect(
        sPoint,
        yPoint,
        gWidth,
        ammoBar.size.h
    );
    
    // Fill
    cctx.fillStyle = "#ffffff66";
    cctx.fillRect(
        sPoint + gWidth,
        yPoint,
        ammoBar.size.w - gWidth,
        ammoBar.size.h
    );
}

function DrawBullet(cctx, b) {
    cctx.fillStyle = b.color;
    cctx.beginPath();
    cctx.arc(
        b.position.x + b.size.w / 2,
        b.position.y + b.size.h,
        b.size.h / 2,
        0, 2 * Math.PI,
        false
    );
    cctx.fill();
}

////////////////////////////////////////////////////////
// Game Vars
////////////////////////////////////////////////////////
var Walls = [];
var Spawns = [];
var DeathZones = [];
var Players = [];
var NetPlayers = [];
var Bullets = [];

var playerColors = ["#3366ff", "#ff4400", "#ffee00", "#11ff55"];