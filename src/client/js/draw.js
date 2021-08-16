// ToDo: Move all draw functions here
////////////////////////////////////////////////////////
// Draw Functions
////////////////////////////////////////////////////////
// !! not used !! //
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
        //y: Math.floor((indx * tSize) / hc) * tSize
        y: Math.floor((indx * tSize) / wc) * tSize
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
    
    // Flip context when player is facing left
    if (p.dir < 0) {
        cctx.translate(Math.round((p.position.x * 2) + gridCellSize + (camera.position.x * 2)), 0);
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
        else if (Math.sin(frameCount / 3) > 0 && Math.abs(p.velocity.x) > 0.1) {
            framePos = sheet.height;
        }
    }

    // Stomped
    if (p.stomped) framePos = sheet.height * 5;

    // Dead
    //if (p.dead) framePos = sheet.height * 4;

    // Draw the chosen frame
    cctx.drawImage(sheet, framePos, 0, sheet.height, sheet.height,
        Math.round(p.position.x + camera.position.x),
        Math.floor(p.position.y + camera.position.y),
        gridCellSize,
        gridCellSize
    );
    
    // Reset context
    cctx.setTransform(1,0,0,1,0,0);

    // Draw hp bar
    //if (drawHp) DrawHeath(cctx, p);
    //if (p.id == 0)
    //DrawAmmo(cctx, p);

    // Draw nametag
    DrawNameTag(cctx, p);

    // Draw tile selection
    cctx.strokeStyle = '#00FF00';
    cctx.lineWidth = 1;
    cctx.strokeRect(p.cursor.x + 0.5, p.cursor.y + 0.5, gridCellSize - 1, gridCellSize - 1);
    cctx.strokeStyle = '#FFFFFF88';
    cctx.strokeRect(p.cursor.x - 0.5, p.cursor.y - 0.5, gridCellSize + 1, gridCellSize + 1);
}

function DrawNameTag(cctx, p) {
    let tagH = gridCellSize * 0.75;
    let fontSize = tagH * 0.8;
    cctx.font = `${fontSize}px sans-serif`;
    let textSize = cctx.measureText(p.playerName);
    let tagW = textSize.width;

    var px = p.position.x + camera.position.x + (p.size.w/2) - (tagW/2);
    var py = p.position.y + camera.position.y - tagH;
    
    // BG
    cctx.fillStyle = "#222222aa";
    cctx.fillRect(
        px - 2,
        py - fontSize,
        tagW + 4,
        tagH
    );
    
    // Text
    cctx.fillStyle = "#ffffffaa";
    cctx.font = `${fontSize}px sans-serif`;
    cctx.fillText(p.playerName, px, py);
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

    // Draw players items and such
    for (var i = 0; i < 46; i++) {
        let ti = Players[myID]?.block;
        let idx = ti + i;
        let maxTiles = (sheet.width * sheet.height) / gridCellSize;
        if (idx > maxTiles) idx -= maxTiles;

        if (idx) tile = GetPosByIndex(sheet, gridCellSize, idx);
        else tile = GetPosByIndex(sheet, gridCellSize, 0);
        let ty = 0;
        if (i >= 23) ty = 1;
        cctx.drawImage(sheet, tile.x, tile.y, gridCellSize, gridCellSize, (1 + (i % 23)) * gridCellSize, bottomUiY + ((1 + ty) * gridCellSize), gridCellSize, gridCellSize);

        // text
        if (i > 0 && i < 11) {
            cctx.fillStyle = `black`;
            cctx.font = 'bold 10px sans-serif';
            cctx.fillText(`${i%10}`, (i + 1) * gridCellSize + 5, bottomUiY + (1 * gridCellSize) - 3);
        }
    }

    // Selected Tile
    cctx.strokeStyle = '#00FF00';
    cctx.lineWidth = 1;
    cctx.strokeRect((1 * gridCellSize) + 0.5, bottomUiY + (1 * gridCellSize) + 0.5, gridCellSize - 1, gridCellSize - 1);
    cctx.strokeStyle = '#FFFFFF88';
    cctx.strokeRect((1 * gridCellSize) - 0.5, bottomUiY + (1 * gridCellSize) - 0.5, gridCellSize + 1, gridCellSize + 1);
    
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