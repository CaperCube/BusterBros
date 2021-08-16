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
let networkInterval;
let fps = 90;
let networkFps = 30;
let isPaused = true;
let frameCount = 0;

////////////////////////////////////////////////////////
// Draw vars
////////////////////////////////////////////////////////
let bgLayerComp;

////////////////////////////////////////////////////////
// Game vars
////////////////////////////////////////////////////////
let myID = 0;

let gravity = 0.08;//0.1;
let terminalVel = 15;
let friction = 0.8;
let bounce = 0.2;

let drawHp = true;
let editorMode = false; // Not implemented yet
let cameraMove = false;
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
    if (Buttons.i.pressed) c.position.y += c.speed;
    if (Buttons.k.pressed) c.position.y -= c.speed;
    if (Buttons.j.pressed) c.position.x += c.speed;
    if (Buttons.l.pressed) c.position.x -= c.speed;
    if (Buttons.o.pressed) c.position = {x: 0, y: 0};
}

function SaveLevel() {
    //let k = 0;
    let saveArray = [];
    let worldWidth = Math.round(worldBounds.x / gridCellSize);
    let worldHeight = Math.round(worldBounds.y / gridCellSize);

    for (let i = 0; i < worldHeight; i++) {
        saveArray[i] = [];
        for (let j = 0; j < worldWidth; j++) {
            // Check if there's a block in this spot
            let thisTile = BlockHere({ size: {w: gridCellSize, h: gridCellSize} }, j*gridCellSize, i*gridCellSize);
            if (thisTile) saveArray[i][j] = thisTile.tileIndex; // null if no block here
            else saveArray[i][j] = null;
        }
    }

    console.log(saveArray);

    socket.emit(`clientSaveLevel`, saveArray);
}

////////////////////////////////////////////////////////
// Init
////////////////////////////////////////////////////////
function LoadLevel(bgToLoad, levelToLoad) { // ToDo: store levels as 2D array
    // Load BG tiles
    BGTiles = [];
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

    // Flatten background
    CompositLayer(ctx, loadedImages[MAIN_SHEET], BGTiles, (data) => {
        bgLayerComp = new Image(canvas.width, canvas.height);
        bgLayerComp.src = data;
    });

    // Setup room
    if (Walls.length === 0) {
        Walls = [];
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
    }
    
    /*
    // Spawns
    for (var i = 0; i < l.spawns.length; i++) {
        Spawns[i] = new Spawn(
            l.spawns[i].x * gridCellSize,
            l.spawns[i].y * gridCellSize,
            playerColors[l.spawns[i].player] + "66",
            l.spawns[i].player
        );
    }
    */
}

function Init() {
    // Setup level
    LoadLevel(tileBG2, tileMapLevel4);
    
    // Start rendering
    PlayPause();
}

socket.on(`joinConfirm`, function(data){
    // Load server's leve
    if (data.level?.length > 1) {
        Walls = data.level;
        //Walls = [];
        console.log(`Level loaded from server`);
    }
    else {
        console.log(`Using default level`);
    }

    // Set my ID on connect to network
    myID = data.id;
    console.log(myID);

    // Temporary player spawn override
    Players[myID] = new Player(
        0,
        0,
        playerColors[0],
        myID
    );
    RespawnPlayer(Players[myID]);
});

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
        if (Walls[i] != null && Walls[i] != undefined) DrawTile(ctx, loadedImages[MAIN_SHEET], gridCellSize, Walls[i].tileIndex, Walls[i].position.x, Walls[i].position.y);
    }
    // Draw Bullets
    for (var i = 0; i < Bullets.length; i++) {
        if (!isPaused) UpdateBullet(Bullets[i], i);
        if (Bullets[i] != null) DrawBullet(ctx, Bullets[i]);
    }
    // Draw Players
    if (!isPaused) UpdatePlayer(Players[myID]);
    for (var p in Players) {
        if (Players[p] != undefined) {
            // If drawing client player, use default skin
            //if (Players[p].id === myID) DrawPlayer(ctx, loadedImages[Players[p].skin + PLAYER_SPRITE], Players[p]);
            // else use alternate skin
            //else DrawPlayer(ctx, loadedImages[Players[p].skin + PLAYER_SPRITE], Players[p]);

            // Draw players with chosen skin
            DrawPlayer(ctx, loadedImages[Players[p].skin + PLAYER_SPRITE], Players[p]);
        }
    }

    //FX layer
    DrawFX(ctx);
    
    // UI layer
    DrawUI(ctx, loadedImages[MAIN_SHEET], worldBounds);

    // Draw winner text
    if (winningPlayer) DrawWinner(ctx);

    // Render again again (change this to a setInterval())
}

function NetworkSendTick() {
    // Send client's data to network
    if (Players[myID]) SendPlayerData(Players[myID]);
}

function PlayPause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(renderInterval);
        //clearInterval(networkInterval);
    }
    else {
        renderInterval = setInterval(RenderCanvas, (1/fps)*1000);
        //networkInterval = setInterval(NetworkSendTick, (1/networkFps)*1000);
    }
}

// Preload images and init stage when done
PreloadImages(imageSRC, Init);
//Init();