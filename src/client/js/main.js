// This tutorial helped:
// https://www.mvcode.com/lessons/javascript-platformer

////////////////////////////////////////////////////////
// Canvas and draw variables
////////////////////////////////////////////////////////
const canvas = $("#my_canvas");
const ctx = canvas.getContext("2d");
var cWidth = canvas.width = 400;
var cHeight = canvas.height = 320;
const bgColor = "#ffffff";
const checkerColor1 = "#252627";
const checkerColor2 = "#202122";

const LevelOffset = {x: 0 * gridCellSize, y: 0 * gridCellSize};

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
            if (tileMapLevel[i][j] != null) {
                Walls.push(new TileWall(
                    gridCellSize * j,
                    gridCellSize * i,
                    tileMapLevel[i][j]
                ));
            }
            else Walls.push(null);
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

Buttons.r.onPress = TempSpawnPlayer;

function TempSpawnPlayer() {
    // Temporary player spawn override
    Players[0] = new Player(
        4 * gridCellSize,
        3 * gridCellSize,
        playerColors[0],
        0
    );
}

function DrawBGCheckers() {
    let gCount = 0;
    for (var i = 0; i < cHeight/gridCellSize; i++) {
        for (var j = 0; j < cWidth/gridCellSize; j++) {
            if (gCount % 2 == 0) ctx.fillStyle = checkerColor1;
            else ctx.fillStyle = checkerColor2;
            ctx.fillRect(j*gridCellSize, i*gridCellSize, gridCellSize, gridCellSize);
            gCount++
        }
    }
}

////////////////////////////////////////////////////////
// Render
////////////////////////////////////////////////////////
function RenderCanvas() {
    // Clear canvas
    //ctx.clearRect(0,0,cWidth,cHeight);
    ctx.fillStyle = "grey";//"#000000";
    ctx.fillRect(0,0,cWidth,cHeight);

    DrawBGCheckers();
    
    // Draw Walls
    for (var i = 0; i < Walls.length; i++) {
        //DrawWall(ctx, Walls[i]);
        //DrawTile(cctx, tMap, tSize, idx, x, y)
        if (Walls[i] != null && Walls[i] != undefined) DrawTile(ctx, tileSheet, gridCellSize, Walls[i].tileIndex, Walls[i].position.x + LevelOffset.x, Walls[i].position.y + LevelOffset.y);
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