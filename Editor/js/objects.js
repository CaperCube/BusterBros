//////////////////////////////////////////
// Project
//////////////////////////////////////////

function Project() {
    // all project settings and tiles go here
    // save this to save project
    
    this.tileSize = 16; // (unused)
    this.tileSheet = 0; // (unsued) (index of a list of the game's tile sheets)

    this.layers = {
        back: [],   // (int array)
        mid: [],    // (int array)
        front: [],  // (int array)
        actions: [] // (int array)
    };
}

//////////////////////////////////////////
// Tile
//////////////////////////////////////////

function Tile() {
    this.id = 0; // not used yet
    this.color = "#000000";
    this.position = {X: 0, Y: 0};
    this.tsIndex = {sX: 0, sY: 0};

    //New Tile structure
    //this.tsIndex = 0 // the index of the tile sheet position from left to right, top to bottom (i.e. 0 = x:0 y:0)
}

// Draw Tile function
function DrawTile(t) {
    ctx.drawImage(tileSetImage, t.tsIndex.sX, t.tsIndex.sY, tileSize, tileSize, t.position.X, t.position.Y, tileSize, tileSize);
}

function GetPosByIndex(area, tSize, indx) {
    //let wc = Math.round(area.width / tSize);
    //let hc = Math.round(area.height / tSize);

    let wc = area.width;
    let hc = area.height;

    return {
        //x: tSize * (indx % wc),
        //y: tSize * Math.floor(indx / hc)
        x: (indx * tSize) % wc,
        y: Math.floor((indx * tSize) / hc)
    };
}

function DrawTileID(sheet, canvas, ts, id) {
    let sampleTile = GetPosByIndex(sheet, ts, id);
    let tileDest = GetPosByIndex(canvas, ts, id);

    //ctx.drawImage(img, sample x, sample y, sample w, sample h, draw x, draw y, draw w, draw h);
    ctx.drawImage(sheet, sampleTile.x, sampleTile.y, ts, ts, tileDest.x, tileDest.y, ts, ts);
    //ctx.drawImage(sheet, 0, 0, ts, ts, tileDest.x, tileDest.y, ts, ts);
}