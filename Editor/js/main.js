//======================================//
//======================================//
// Global Vars
//======================================//
//======================================//

//////////////////////////////////////////
// Drawing canvas
//////////////////////////////////////////
const container = $('#MainCanvas');
const ctx = container.getContext("2d");
var cw = container.width = $("#MainCanvas").style.width = 320;
var ch = container.height = $("#MainCanvas").style.height = 256;

//////////////////////////////////////////
// Selection canvas
//////////////////////////////////////////
const containerSel = $('#SelCanvas');
const ctx2 = containerSel.getContext("2d");
var sw = containerSel.width = $("#SelCanvas").style.width = 256;
var sh = containerSel.height = $("#SelCanvas").style.height = 256;

//////////////////////////////////////////
// Grid & Tile vars
//////////////////////////////////////////
var showGrid = true;
var gridColor = "#aaaaaa";

var tileSetImage = new Image();
const tileSize = 16;

var tileSel = 0;
var tileSelX = 0;
var tileSelY = 0;
var tileNumWidth = tileNumWidth = Math.round(cw / tileSize);

var drawMode = 0; // 0 = null, 1 = paint, 2 = erase
var txLast = 0;
var tyLast = 0;

//////////////////////////////////////////
// Layer vars
//////////////////////////////////////////
var layers = [
    new Array(),
    new Array(),
    new Array(),
    new Array()
];

var selLayer = 0;
var hiddenLayers = [false, false, false, false];

//======================================//
//======================================//
// Event Listeners
//======================================//
//======================================//

//////////////////////////////////////////
// On mouse up
// change mode to null
//////////////////////////////////////////

container.addEventListener('mouseup', function(e){
    drawMode = 0;
    container.style.cursor = "default";
});

//////////////////////////////////////////
// On mouse down
// Drawing canvas
//////////////////////////////////////////

container.addEventListener('mousedown', function(e){
    var rect = e.target.getBoundingClientRect();
    var tX = Math.round(((e.clientX - rect.left) - (tileSize/2)) / tileSize) * tileSize;
    var tY = Math.round(((e.clientY - rect.top) - (tileSize/2)) / tileSize) * tileSize;
    // Check if there's a tile there already
    var check = checkTileSpace(tX, tY);
    
    // There IS a tile here
    if (check.bool) {
        
        // The tile IS the same
        if (layers[selLayer][check.index].tsIndex.sX == tileSelX && layers[selLayer][check.index].tsIndex.sY == tileSelY) {
            drawMode = 2;
            container.style.cursor = "not-allowed";
            // Erase tile
            layers[selLayer].splice(check.index, 1);
        }
        // The tile is NOT the same
        else {
            drawMode = 1;
            container.style.cursor = "crosshair";
            // Replace tile
            layers[selLayer][check.index].tsIndex.sX = tileSelX;
            layers[selLayer][check.index].tsIndex.sY = tileSelY;
        }
    }
    
    // There is NOt a tile here
    else {
        drawMode = 1;
        container.style.cursor = "crosshair";
        // Create tile
        if (!check.bool) layers[selLayer].push(createTileHere(tX, tY, tileSelX, tileSelY));
    }
});

//////////////////////////////////////////
// On mouse move
// Drawing canvas
//////////////////////////////////////////

container.addEventListener('mousemove', function(e){
    var rect = e.target.getBoundingClientRect();
    var tX = Math.round(((e.clientX - rect.left) - (tileSize/2)) / tileSize) * tileSize;
    var tY = Math.round(((e.clientY - rect.top) - (tileSize/2)) / tileSize) * tileSize;
    // Check if there's a tile there already
    var check = checkTileSpace(tX, tY);
    
    // There IS a tile here AND mouse is in a differnt grid space
    if (check.bool && (txLast != tX || tyLast != tY)) {
        // Erase Mode
        if (drawMode == 2) {
            // Erase tile
            layers[selLayer].splice(check.index, 1);
        }
        // Paint Mode
        else if (drawMode == 1){
            // Replace tile
            layers[selLayer][check.index].tsIndex.sX = tileSelX;
            layers[selLayer][check.index].tsIndex.sY = tileSelY;
        }
    }
    
    // There is NOt a tile here AND in Paint mode
    else if (drawMode == 1){
        // Create tile
        //if (!check.bool) layers[selLayer].push(createTileHere(tX, tY, tileSelX, tileSelY));
        if (!check.bool) layers[selLayer].push(createTileHere(tX, tY, tileSelX, tileSelY));
    }
    
    txLast = tX;
    tyLast = tY;
});

//////////////////////////////////////////
// On mouse down
// Tile Selection canvas
//////////////////////////////////////////

containerSel.addEventListener('mousedown', function(e){
    var rect = e.target.getBoundingClientRect();
    
    var tX = Math.round(((e.clientX - rect.left) - (tileSize/2)) / tileSize) * tileSize;
    var tY = Math.round(((e.clientY - rect.top) - (tileSize/2)) / tileSize) * tileSize;
    
    tileSelX = tX;
    tileSelY = tY;
    
    tileSel = (tileSelX / tileSize) + ((tileSelY / tileSize) * tileNumWidth);
    console.log(tileSel);
});

//======================================//
//======================================//
// Operation Functions
//======================================//
//======================================//

function checkTileSpace(tlx,tly) {
    var result = {bool: false, index: null};
    // Check if there's a tile there already
    for (var i = 0; i < layers[selLayer].length; i++) {
        if (layers[selLayer][i].position.X == tlx && layers[selLayer][i].position.Y == tly) {
            result.bool = true;
            result.index = i;
        }
    }
    return result;
}

function createTileHere(x,y,tsx,tsy) {
    var tTile = new Tile();
    
    tTile.tsIndex.sX = tsx;
    tTile.tsIndex.sY = tsy;
    tTile.position.X = x;
    tTile.position.Y = y;
    
    return tTile;
}

//======================================//
//======================================//
// UI Functions
//======================================//
//======================================//

function SelectLayer(l,me) {
    selLayer = l;
    var btns = $$(".DOM_LayerButtons");
    btns.forEach(function(i){i.style.backgroundColor = "#FFFFFF";});
    me.style.backgroundColor = "#00FF00";
}

function HideShow(l,me) {
    hiddenLayers[l] = !hiddenLayers[l];
    if (hiddenLayers[l]) me.innerHTML = "Show";
    else me.innerHTML = "Hide";
}

function ToggleGrid(me) {
    showGrid = !showGrid;
    if (showGrid) me.innerHTML = "Hide Grid";
    else me.innerHTML = "Show Grid";
}

function HideShowDOM(o) {
    if (o.style.display != "none") o.style.display = "none";
    else o.style.display = "inline-block";
}

//======================================//
//======================================//
// Drawing Functions
//======================================//
//======================================//

function drawGrid() {
    ctx.strokeStyle = gridColor;
    ctx2.strokeStyle = gridColor;
    for (var i = 0; i <= tileNumWidth; i++) {
        // Vert
        ctx.beginPath();
        ctx.moveTo(tileSize * i, 0);
        ctx.lineTo(tileSize * i, ch);
        ctx.stroke();
        
        ctx2.beginPath();
        ctx2.moveTo(tileSize * i, 0);
        ctx2.lineTo(tileSize * i, ch);
        ctx2.stroke();
        // Horz
        ctx.beginPath();
        ctx.moveTo(0, tileSize * i);
        ctx.lineTo(cw, tileSize * i);
        ctx.stroke();
        
        ctx2.beginPath();
        ctx2.moveTo(0, tileSize * i);
        ctx2.lineTo(cw, tileSize * i);
        ctx2.stroke();
    }
}

function drawRef() {
    ctx2.drawImage(tileSetImage, 0, 0);
    
    //draw selection
    ctx.lineWidth = 1;
    ctx2.strokeStyle = "#ff0000";
    ctx2.strokeRect(tileSelX, tileSelY, tileSize, tileSize);
    ctx2.strokeStyle = "#ffffff";
    ctx2.strokeRect(tileSelX + 1, tileSelY + 1, tileSize - 2, tileSize - 2);
}

//======================================//
//======================================//
// Render Loop
//======================================//
//======================================//

function render() {
    // Clear Screen for next draw
    ctx.clearRect(0, 0, cw, ch);
    ctx2.clearRect(0, 0, sw, sh);
    
    // Draw
    for (var i = 0; i < layers.length; i++) {
        for (var j = 0; j < layers[i].length; j++) {
            if (layers[i][j] && !hiddenLayers[i]) DrawTile(layers[i][j]);
            //if (layers[i][j] && !hiddenLayers[i]) DrawTileID(tileSetImage, container , tileSize, layers[i][j]);
        }
    }
    
    // Draw Grid
    if (showGrid) drawGrid();
    
    // Draw Ref
    drawRef();
    
    // Request next render loop
    requestAnimationFrame(render);
}

//////////////////////////////////////////
// Init Calls
//////////////////////////////////////////

function init() {
    tileSetImage.src = "img/smw_ts1.png";
    sw = containerSel.width = $("#SelCanvas").style.width = tileSetImage.width;
    sh = containerSel.height = $("#SelCanvas").style.height = tileSetImage.height;

    tileNumWidth = Math.round(cw / tileSize);

    render();
}

init();