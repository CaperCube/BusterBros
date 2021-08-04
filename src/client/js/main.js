// This tutorial helped:
// https://www.mvcode.com/lessons/javascript-platformer

////////////////////////////////////////////////////////
// Canvas and draw variables
////////////////////////////////////////////////////////
var canvas = $("#my_canvas");
var ctx = canvas.getContext("2d");
var cWidth = canvas.width = 400;
var cHeight = canvas.height = 400;
var bgColor = "#ffffff";

function setCanvasSize(w,h) {
    cWidth = canvas.width = w;
    cHeight = canvas.height = h;
}

var renderInterval;
var fps = 90;
var isPaused = true;

////////////////////////////////////////////////////////
// Game vars
////////////////////////////////////////////////////////
var gravity = 0.1;
var friction = 0.8;
var bounce = 0.2;

var drawHp = true;

////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////
function UpdatePlayer(p) {
    
    if (p) ControlLoopPlatformer(p);
}

function UpdateBullet(b, i) {
    
    if (b) {
        // Check x
        if (PlaceFree(b, b.position.x + b.velocity.x, b.position.y)) {
            b.position.x += b.velocity.x;
        }
        else {
            // Destroy
            delete b;
            Bullets.splice(i,1);
            return;
        }

        // Check y
        if (PlaceFree(b, b.position.x, b.position.y + b.velocity.y)) {
            b.position.y += b.velocity.y;
        }
        else {
            // Destroy
            delete b;
            Bullets.splice(i,1);
            return;
        }
    }
}

////////////////////////////////////////////////////////
// Init
////////////////////////////////////////////////////////
function LoadLevel(l) {
    // Clear old level
    Walls = [];
    
    // Load new one
    for (var i = 0; i < l.walls.length; i++) {
        Walls[i] = new Wall(
            l.walls[i].w * gridCellSize,
            l.walls[i].h * gridCellSize,
            l.walls[i].x * gridCellSize,
            l.walls[i].y * gridCellSize
        );
    }
    
    // Spawns
    for (var i = 0; i < l.spawns.length; i++) {
        Spawns[i] = new Spawn(
            l.spawns[i].x * gridCellSize,
            l.spawns[i].y * gridCellSize,
            playerColors[l.spawns[i].player] + "66",
            l.spawns[i].player
        );
    }
}
function Init() {
    // Setup room
    //LoadLevel(Level2);
    Walls = [];
    for (var i = 0; i < tileMapLevel.length; i++) {
        for (var j = 0; j < tileMapLevel[i].length; j++) {
            Walls.push(new TileWall(
                gridCellSize * j,
                gridCellSize * i,
                tileMapLevel[i][j]
            ));
        }
    }
    
    // Setup Players
    for (var i = 0; i < Spawns.length; i++) {
        if (Spawns[i].player == 0) {
            Players[0] = new Player(
                Spawns[i].position.x,
                Spawns[i].position.y,
                playerColors[0],
                0
            );
        }
    }
    
    // Start rendering
    //RenderCanvas();
    console.log(Walls[0]);
    PlayPause();
}

////////////////////////////////////////////////////////
// Render
////////////////////////////////////////////////////////
function RenderCanvas() {
    // Clear canvas
    //ctx.clearRect(0,0,cWidth,cHeight);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,cWidth,cHeight);
    
    // Draw Walls
    for (var i = 0; i < Walls.length; i++) {
        //DrawWall(ctx, Walls[i]);
        //DrawTile(cctx, tMap, tSize, idx, x, y)
        DrawTile(ctx, tileSheet, gridCellSize, Walls[i].tileIndex, Walls[i].position.x, Walls[i].position.y);
    }
    // Draw Spawns
    /*
    for (var i = 0; i < Spawns.length; i++) {
        DrawWall(ctx, Spawns[i]);
    }
    */
    /*
    // Draw DeathZones
    for (var i = 0; i < DeathZones.length; i++) {
        DrawWall(ctx, DeathZones[i]);
    }
    */
    // Draw Bullets
    for (var i = 0; i < Bullets.length; i++) {
        UpdateBullet(Bullets[i], i);
        if (Bullets[i] != null) DrawBullet(ctx, Bullets[i]);
    }
    // Draw Players
    for (var i = 0; i < Players.length; i++) {
        UpdatePlayer(Players[i]);
        DrawPlayer(ctx, Players[i]);
    }
    // Draw NetPlayers
    for (var i = 0; i < NetPlayers.length; i++) {
        DrawPlayer(ctx, NetPlayers[i]);
    }
    
    // Render again again (change this to a setInterval())
}

function PlayPause() {
    isPaused = !isPaused;
    if (isPaused) clearInterval(renderInterval);
    else renderInterval = setInterval(RenderCanvas, (1/fps)*1000);
}

Init();