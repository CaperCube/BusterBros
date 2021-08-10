// ToDo: Move all draw functions here
////////////////////////////////////////////////////////
// Draw Functions
////////////////////////////////////////////////////////
function DrawWall(cctx, o) {
    cctx.fillStyle = o.color;
    cctx.fillRect(
        o.position.x + camera.position.x,
        o.position.y + camera.position.y,
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
    /*
    cctx.drawImage(
        tMap,
        sampleTile.x, sampleTile.y, tSize, tSize,
        x, y, tSize, tSize
    );
    */
    cctx.drawImage(
        tMap,
        sampleTile.x, sampleTile.y, tSize, tSize,
        x + camera.position.x, y + camera.position.y, tSize, tSize
    );
}

function DrawPlayer(cctx, sheet, p) {
    // Draw player
    cctx.fillStyle = p.color;
    /*
    cctx.beginPath();
    cctx.arc(
        (p.position.x + p.size.w / 2) + camera.position.x,
        (p.position.y + p.size.h / 2) + camera.position.y,
        p.size.h / 2,
        0, 2 * Math.PI,
        false
    );
    cctx.fill();
    */
    
    // Flip context when player is facing left
    if (p.dir < 0) {
        cctx.translate(Math.round((p.position.x * 2) + gridCellSize - 1), 0);
        cctx.scale(-1,1);
    }

    // Frame Index
    let framePos = 0;
    
    // if parrying
    if (p.parry) framePos = sheet.height * 6;
    else {
        // if no tile below player, show "jumping" frame
        if (PlaceFree(p, p.position.x, p.position.y + gridCellSize/2) && (p.position.y + (p.size.h/2) + p.velocity.y) < worldBounds.y) framePos = sheet.height * 2;
        // else if player is moving laterally, alternate "walking" frames
        else if (Math.sin(frameCount / 3) > 0 && Math.abs(p.velocity.x) > 0.1) framePos = sheet.height;
    }

    // Draw the chosen frame
    cctx.drawImage(sheet, framePos, 0, sheet.height, sheet.height,
        Math.round(p.position.x + camera.position.x),
        Math.floor(p.position.y + camera.position.y),
        gridCellSize,
        gridCellSize
    );
    
    // Draw gun
    /*
    cctx.fillStyle = "#555555";
    ctx.fillRect(
        (p.position.x + (p.dir * (gridCellSize * 0.5))) + camera.position.x,
        (p.position.y + (p.size.h / 6)) + camera.position.y,
        gridCellSize * 0.8,
        gridCellSize/3
    );
    */
    
    // Reset context
    cctx.setTransform(1,0,0,1,0,0);

    // Draw hp bar
    if (drawHp) DrawHeath(cctx, p);
    //if (p.id == 0)
    DrawAmmo(cctx, p);
}

function DrawHeath(cctx, p) {
    var px = p.position.x + (p.size.w/2);
    var yPoint = p.position.y - (healthBar.size.h*2) + camera.position.y
    var sPoint = px - (healthBar.size.w/2) + camera.position.x;
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
    var yPoint = p.position.y - (ammoBar.size.h*2) - healthBar.size.h - ammoBar.size.h + camera.position.y;
    var sPoint = px - (ammoBar.size.w/2) + camera.position.x;
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
        (b.position.x + b.size.w / 2) + camera.position.x,
        (b.position.y + b.size.h) + camera.position.y,
        b.size.h / 2,
        0, 2 * Math.PI,
        false
    );
    cctx.fill();
}

//
// UI
//
let inGameUI = new Image();
function InitUI(callback) {
    // draw ui tiles for the first time and store the resulting image in inGameUI;

    // Save layer to comp
    callback(cctx.canvas.toDataURL("image/png"));
}

function DrawUI(cctx, sheet, worldB) {
    //let uiHeight = (cctx.canvas.height - worldB.y);
    let bottomUiY = worldB.y;// + uiHeight;
    let rightMostTileX = cctx.canvas.width - gridCellSize;

    cctx.fillStyle = "black";
    // Top
    //cctx.fillRect(0, 0, worldB.x, uiHeight);
    // Bottom
    cctx.fillRect(0, bottomUiY, worldB.x, gridCellSize * 4);

    // Bottom

    // Top Left
    tile = GetPosByIndex(sheet, gridCellSize, uiTiles.tl);
    cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, 0, bottomUiY, gridCellSize, gridCellSize);
    // Top Right
    tile = GetPosByIndex(sheet, gridCellSize, uiTiles.tr);
    cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, rightMostTileX, bottomUiY, gridCellSize, gridCellSize);
    // Mid Left
    tile = GetPosByIndex(sheet, gridCellSize, uiTiles.ml);
    cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, 0, bottomUiY + gridCellSize, gridCellSize, gridCellSize);
    cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, 0, bottomUiY + (2 * gridCellSize), gridCellSize, gridCellSize);
    // Mid Right
    tile = GetPosByIndex(sheet, gridCellSize, uiTiles.mr);
    cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, rightMostTileX, bottomUiY + gridCellSize, gridCellSize, gridCellSize);
    cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, rightMostTileX, bottomUiY + (2 * gridCellSize), gridCellSize, gridCellSize);
    // Bottom Left
    tile = GetPosByIndex(sheet, gridCellSize, uiTiles.bl);
    cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, 0, bottomUiY + (3 * gridCellSize), gridCellSize, gridCellSize);
    // Bottom Right
    tile = GetPosByIndex(sheet, gridCellSize, uiTiles.br);
    cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, rightMostTileX, bottomUiY + (3 * gridCellSize), gridCellSize, gridCellSize);

    // Horizontal
    tile = GetPosByIndex(sheet, gridCellSize, uiTiles.t);
    for (var i = 1; i < (cctx.canvas.width / gridCellSize) - 1; i++) {
        cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, (i * gridCellSize), bottomUiY, gridCellSize, gridCellSize);
    }
    tile = GetPosByIndex(sheet, gridCellSize, uiTiles.m);
    for (var i = 1; i < (cctx.canvas.width / gridCellSize) - 1; i++) {
        cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, (i * gridCellSize), bottomUiY + gridCellSize, gridCellSize, gridCellSize);
    }
    for (var i = 1; i < (cctx.canvas.width / gridCellSize) - 1; i++) {
        cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, (i * gridCellSize), bottomUiY + (2 * gridCellSize), gridCellSize, gridCellSize);
    }
    tile = GetPosByIndex(sheet, gridCellSize, uiTiles.b);
    for (var i = 1; i < (cctx.canvas.width / gridCellSize) - 1; i++) {
        cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, (i * gridCellSize), bottomUiY + (3 * gridCellSize), gridCellSize, gridCellSize);
    }
}

//
// Background
//

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

function CompositLayer(cctx, tSheet, tiles, callback) {
    // Draw layer
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i] != null && tiles[i] != undefined) DrawTile(cctx, tSheet, gridCellSize, tiles[i].tileIndex, tiles[i].position.x, tiles[i].position.y);
    }

    // Save layer to comp
    callback(cctx.canvas.toDataURL("image/png"));
}