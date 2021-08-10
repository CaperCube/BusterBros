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

function setCanvasSize(w,h) {
    cWidth = canvas.width = w;
    cHeight = canvas.height = h;
}

let renderInterval;
let fps = 90;
let isPaused = true;
let frameCount = 0;

////////////////////////////////////////////////////////
// Draw vars
////////////////////////////////////////////////////////
let bgLayerComp;

////////////////////////////////////////////////////////
// Game vars
////////////////////////////////////////////////////////
let gravity = 0.08;//0.1;
let friction = 0.8;
let bounce = 0.2;

let drawHp = true;
let editorMode = false; // Not implemented yet
let cameraMove = true;
let debugMode = false; // Not implemented yet

let worldBounds = {
    x: 25 * gridCellSize,
    y: 16 * gridCellSize
}

// Game camera
let camera = {
    zoom: 1, // Does nothing right now
    //position: {x: 0, y: 2 * gridCellSize},
    position: {x: 0, y: 0},
    speed: 2
}

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

function CameraControl(c) {
    if (Buttons.i.pressed) c.position.y -= c.speed;
    if (Buttons.k.pressed) c.position.y += c.speed;
    if (Buttons.j.pressed) c.position.x -= c.speed;
    if (Buttons.l.pressed) c.position.x += c.speed;
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
    // Load BG tiles
    BGTiles = [];
    let bgToLoad = tileBG2;

    for (var i = 0; i < bgToLoad.length; i++) {
        for (var j = 0; j < bgToLoad[i].length; j++) {
            if (bgToLoad[i][j] != null) {
                BGTiles.push(new TileWall(
                    gridCellSize * j,
                    gridCellSize * i,
                    bgToLoad[i][j]
                ));
            }
            else BGTiles.push(null);
        }
    }

    // Set up background
    CompositLayer(ctx, loadedImages[MAIN_SHEET], BGTiles, (data) => {
        bgLayerComp = new Image(canvas.width, canvas.height);
        bgLayerComp.src = data;
    });

    // Setup room
    //LoadLevel(Level2);
    Walls = [];
    let levelToLoad = tileMapLevel4;

    for (var i = 0; i < levelToLoad.length; i++) {
        for (var j = 0; j < levelToLoad[i].length; j++) {
            if (levelToLoad[i][j] != null) {
                Walls.push(new TileWall(
                    gridCellSize * j,
                    gridCellSize * i,
                    levelToLoad[i][j]
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
    //console.log(Walls);
    PlayPause();
}

Buttons.r.onPress = TempSpawnPlayer;

function TempSpawnPlayer() {
    // Temporary player spawn override
    Players[0] = new Player(
        4 * gridCellSize,
        6 * gridCellSize,
        playerColors[0],
        0
    );
}

////////////////////////////////////////////////////////
// Render
////////////////////////////////////////////////////////
function RenderCanvas() {
    // Frame count
    frameCount++;

    // Clear canvas
    //ctx.clearRect(0,0,cWidth,cHeight);
    ctx.fillStyle = "grey";//"#000000";
    ctx.fillRect(0,0,cWidth,cHeight);

    // Draw tiled BG
    //DrawBGCheckers();
    ctx.drawImage(bgLayerComp, 0, 0, canvas.width, canvas.height);
    
    // Move camera
    if (cameraMove) CameraControl(camera);

    // Draw Walls
    for (var i = 0; i < Walls.length; i++) {
        //DrawWall(ctx, Walls[i]);
        //DrawTile(cctx, tMap, tSize, idx, x, y)
        if (Walls[i] != null && Walls[i] != undefined) DrawTile(ctx, loadedImages[MAIN_SHEET], gridCellSize, Walls[i].tileIndex, Walls[i].position.x, Walls[i].position.y);
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
        if (!isPaused) UpdateBullet(Bullets[i], i);
        if (Bullets[i] != null) DrawBullet(ctx, Bullets[i]);
    }
    // Draw Players
    for (var i = 0; i < Players.length; i++) {
        if (!isPaused) UpdatePlayer(Players[i]);
        DrawPlayer(ctx, loadedImages[PLAYER_SPRITE], Players[i]);
    }
    // Draw NetPlayers
    for (var i = 0; i < NetPlayers.length; i++) {
        DrawPlayer(ctx, loadedImages[PLAYER_SPRITE], NetPlayers[i]);
    }
    
    // UI layer
    DrawUI(ctx, loadedImages[MAIN_SHEET], worldBounds);

    // Render again again (change this to a setInterval())
}

function PlayPause() {
    isPaused = !isPaused;
    if (isPaused) clearInterval(renderInterval);
    else renderInterval = setInterval(RenderCanvas, (1/fps)*1000);
}

PreloadImages(imageSRC, Init);
//Init();