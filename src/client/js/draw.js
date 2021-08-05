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

function DrawPlayer(cctx, p) {
    // Draw player
    cctx.fillStyle = p.color;
    cctx.beginPath();
    cctx.arc(
        (p.position.x + p.size.w / 2) + camera.position.x,
        (p.position.y + p.size.h / 2) + camera.position.y,
        p.size.h / 2,
        0, 2 * Math.PI,
        false
    );
    cctx.fill();
    
    // Draw gun
    cctx.fillStyle = "#555555";
    ctx.fillRect(
        (p.position.x + (p.dir * (gridCellSize * 0.5))) + camera.position.x,
        (p.position.y + (p.size.h / 6)) + camera.position.y,
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