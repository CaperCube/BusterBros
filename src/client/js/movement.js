////////////////////////////////////////////////////////
// Platformer controller
////////////////////////////////////////////////////////
function UpdatePositionX(p) {
    function Bounce() {
        p.velocity.x *= -bounce;
    }

    function KeepMoving() {
        p.position.x += p.velocity.x;
    }

    // Check x
    if (PlaceFree(p, p.position.x + p.velocity.x, p.position.y)) {
        // Wrap
        if ((p.position.x + (p.size.w/2) + p.velocity.x) < 0) {
            let testPos = {x: worldBounds.x - (gridCellSize/2), y: p.position.y};
            if (PlaceFree(p, testPos.x, testPos.y)) {
                //wrap to Right
                p.position = {x: worldBounds.x - (p.size.h/2), y: p.position.y};
            }
            else {
                // Bounce
                //Bounce();
                let thisTile = BlockHere(p, worldBounds.x - (gridCellSize/2), p.position.y);
                if (thisTile) CheckAllTileTypes(p, thisTile, Bounce, function() {
                    p.position = {x: worldBounds.x - (p.size.h/2), y: p.position.y};
                }, false);
            }
        }
        else if ((p.position.x + (p.size.w/2) + p.velocity.x) >= worldBounds.x) {
            let testPos = {x: 0, y: p.position.y};
            if (PlaceFree(p, testPos.y, testPos.y)) {
                //wrap to Left
                p.position = {x: (p.size.h/-2), y: p.position.y};
            }
            else {
                // Bounce
                //Bounce();
                let thisTile = BlockHere(p, 0, p.position.y);
                if (thisTile) CheckAllTileTypes(p, thisTile, Bounce, KeepMoving, false);
            }
        }
        // Do movement
        else KeepMoving();
    }
    else {
        // Collide with tile on the left or right
        let testPos = {x: p.position.x + p.velocity.x, y: p.position.y};
        let thisTile = BlockHere(p, testPos.x, testPos.y);
        if (thisTile) CheckAllTileTypes(p, thisTile, Bounce, KeepMoving, false);
    }
}

function UpdatePositionXY(p) {
    // Check x
    if (PlaceFree(p, p.position.x + p.velocity.x, p.position.y)) {
        p.position.x += p.velocity.x;
    }
    else {
        p.velocity.x *= -bounce;
    }
    
    // Check y
    if (PlaceFree(p, p.position.x, p.position.y + p.velocity.y)) {
        p.position.y += p.velocity.y;
    }
    else {
        if (p.velocity.y > 0) p.usedJumps = 0;
        p.velocity.y *= -bounce;
    }
}

function UpdatePickups(p) {
    // Check Spawns
    if (!PlaceFreeCustom(p, p.position.x + p.velocity.x, p.position.y + p.velocity.y, Spawns)) {
        if (p.usedAmmo > 0) p.usedAmmo = 0;
    }
}

function DoGravity(p) {
    function Bounce() {
        if (p.velocity.y > 0) {
            if (p.velocity.y > 1) TriggerNetworkSound('land');
            p.usedJumps = 0;
        }
        p.velocity.y *= -bounce;
    }

    function KeepMoving() {
        p.position.y += p.velocity.y;
    }

    // Check y
    let testPos = {x: p.position.x, y: p.position.y + p.velocity.y};
    if (PlaceFree(p, testPos.x, testPos.y)) {
        // Allow Y movement
        KeepMoving();
    }
    else {
        // Collide with tile on the bottom or top
        let thisTile = BlockHere(p, testPos.x, testPos.y);
        if (thisTile) CheckAllTileTypes(p, thisTile, Bounce, KeepMoving, true);
    }
    // world bounds
    if ((p.position.y + (p.size.h/2) + p.velocity.y) < 0) {
        let testPos = {x: p.position.x, y: worldBounds.y - (gridCellSize/2)};
        if (PlaceFree(p, testPos.x, testPos.y)) {
            //wrap to bottom
            p.position = {x: p.position.x, y: worldBounds.y - (p.size.h/2) - 2};
        }
        else {
            // Bounce
            //Bounce();
            let thisTile = BlockHere(p, testPos.x, testPos.y);
            if (thisTile) CheckAllTileTypes(p, thisTile, Bounce, function() {
                //wrap to bottom
                p.position = {x: p.position.x, y: worldBounds.y - (p.size.h/2) - 2};
            }, true);
        }
    }
    else if ((p.position.y + (p.size.h/2) + p.velocity.y) >= worldBounds.y) {
        let testPos = {x: p.position.x, y: 0};
        if (PlaceFree(p, testPos.x, testPos.y)) {
            //wrap to top
            p.position = {x: p.position.x, y: (p.size.h/-2) + 2};
        }
        else {
            // Bounce
            //Bounce();
            let thisTile = BlockHere(p, testPos.x, testPos.y);
            if (thisTile) CheckAllTileTypes(p, thisTile, Bounce, KeepMoving, true);
        }
    }
    // Do accelleration
    else p.velocity.y += gravity;
}

function ControlCam() {
    running = GetInput(Controls.Player1.run);
    
    if (running) camSpeed = 10;
    else camSpeed = 5;
    
    if (Buttons.equals.pressed && MainCamera.zoom < 3.0) MainCamera.zoom += 0.02;
    if (Buttons.minus.pressed && MainCamera.zoom > 0.5) MainCamera.zoom -= 0.02;
}

function ControlLoopPlatformer(p) {
    // Update position
    UpdatePositionX(p);
    DoGravity(p);
    //WorldWrapX(p);
    UpdatePickups(p);

    // Jump
    function jumpfunc() {
        Controls.Player1.jump.pressed = true;

        if (p.usedJumps < p.totalJumps && !p.stomped) {
            p.usedJumps += 1;
            p.velocity.y = -p.jumpSpeed;

            // Jump held velocity curve
            p.allowJumpCurve = true;
            setTimeout(() => { p.allowJumpCurve = false; }, p.jumpCurveTime);
        }

        TriggerNetworkSound('jump');
    }

    if (p.allowJumpCurve && Controls.Player1.jump.pressed) {
        p.velocity.y -= 0.15;
    }
    
    // Shoot
    function shootfunc() {
        if (p.usedAmmo < p.totalAmmo){
            Bullets.push(new Bullet(
                p.position.x + p.size.w/4,
                p.position.y,
                p.id,
                p.bulletSpeed * p.dir
            ));
            p.usedAmmo++;
        }
    }

    //#region Place cursor 
    let pX = ((gridCellSize + p.size.w/2) * p.dir);
    let pY = 0;
    // Looking down
    if (p.look < 0) {
        pX = (gridCellSize/8 + p.size.w/8) * p.dir;
        pY = (gridCellSize + p.size.h/3);
        if (p.velocity.y > 0) pY = (gridCellSize + p.size.h/3) + p.velocity.y;
        else pY = (gridCellSize + p.size.h/3);
    }
    // Looking up
    else if (p.look > 0) {
        pX = 0;
        pY = ((gridCellSize) * -1.5);
    }
    p.cursor = {
        x: Math.round((p.position.x + camera.position.x + pX) / gridCellSize) * gridCellSize,
        y: Math.round((p.position.y + camera.position.y + pY) / gridCellSize) * gridCellSize
    };
    if (p.cursor.y > worldBounds.y) p.cursor.y = 0;
    else if (p.cursor.y < 0) p.cursor.y = worldBounds.y - gridCellSize;
    if (p.cursor.x > worldBounds.x) p.cursor.x = 0;
    else if (p.cursor.x < 0) p.cursor.x = worldBounds.x - gridCellSize;
    //#endregion

    // Build
    function buildfunc() {
        // If cursor is in the bound of the world, allow placement
        if (p.cursor.x >= 0 &&
            p.cursor.x < worldBounds.x &&
            p.cursor.y >= 0 &&
            p.cursor.y < worldBounds.y && !p.stomped) {
            let tileHere = BlockHere({size: p.size}, p.cursor.x, p.cursor.y);
            if (tileHere == null) {
                let playerHere = PlayerHere({size: {w: (gridCellSize * 1.1) + 2, h: (gridCellSize * 1.1) + 2}}, p.cursor.x-2, p.cursor.y-4);
                if (!playerHere) {
                    let newTile = new TileWall(
                        p.cursor.x,
                        p.cursor.y,
                        p.block,
                        myID
                    );
                    Walls.push(newTile);

                    //console.log(`Build at X: ${p.cursor.x} Y: ${p.cursor.y}`);
                    // Send message to server
                    SendNewTile(newTile);
                    BUILD_SFX.Play();
                }
            }
            else {
                console.log(`Remove at X: ${p.cursor.x} Y: ${p.cursor.y}`);
                let tileIndex = Walls.indexOf(tileHere);
                Walls.splice(tileIndex, 1);
                // Send message to server

                SendRemovedTile(tileHere);
                REMOVE_SFX.Play();
            }
        }
    }

    // Move, Stomp, Parry, Look
    if (!p.stomped) {
        // Move
        if (GetInput(Controls.Player1.leftAxis1)) {
            if (p.look >= 0) {
                if (isSlipping) p.velocity.x -= (p.moveSpeed * 0.08);
                else p.velocity.x -= p.moveSpeed;
            }
            p.dir = -1;
        }
        if (GetInput(Controls.Player1.rightAxis1)) {
            if (p.look >= 0) {
                if (isSlipping) p.velocity.x += (p.moveSpeed * 0.08);
                else p.velocity.x += p.moveSpeed;
            }
            p.dir = 1;
        }

        // Check if stomping other player
        let otherPlayer = PlayerHere(p, p.position.x + p.velocity.x, p.position.y + p.velocity.y - 4);
        if (otherPlayer) {
            // Send network message to stomp if stomp success
            let stompHeight = otherPlayer.position.y - otherPlayer.size.h * 0.66;
            if (!otherPlayer.stomped && p.velocity.y > 0.5 && p.position.y < stompHeight) {
                // Bounce my player
                p.usedJumps = 0;
                p.velocity.y *= -(bounce*4);
                StompPlayer(otherPlayer);
            }
            //console.log(otherPlayer);
        }

        // Parry, Look down
        if (GetInput(Controls.Player1.downAxis1)) {
            p.look = -1;
            // Parry
            if (p.canParry) {
                p.parry = true;
                p.canParry = false;
                // Send server message
                socket.emit(`clientParry`);
                // Wait before allowing another parry
                setTimeout(() => { p.canParry = true; }, 1500);
                // Turn off parry after a short amount of time
                setTimeout(() => { p.parry = false; }, 70);
            }
            // Drop through if above a one-sided tile
            let tileImOn = BlockHere(p, p.position.x, p.position.y + 1);
            if ( tileImOn && oneSidedTiles.includes(tileImOn.tileIndex) ) {
                // Drop
                p.position.y += 2;
            }
        }
        // Look up
        else if (GetInput(Controls.Player1.upAxis1)) {
            p.look = 1;
        }
        // default
        else {
            p.look = 0;
        }
    }

    //#region Assign controls
    // Jump, Action
    Controls.Player1.jump.forEach(b => b.onPress = jumpfunc);
    Controls.Player1.jump.forEach(b => b.onRelease = function(){Controls.Player1.jump.pressed = false});
    Controls.Player1.fire1.forEach(b => b.onPress = buildfunc);

    //UnStomp
    Controls.Player1.resapwn.forEach(b => b.onPress = () => {if (p.stomped) UnStompSelf()});

    // Change block
    function NumberPickTile(num) {
        p.block+=num;
        if (p.block < 0) p.block = 1023;
        if (p.block > 1023) p.block = 0;
    }
    
    Controls.Player1.invUp.forEach(b => b.onPress = () => { NumberPickTile(1) });
    Controls.Player1.invDown.forEach(b => b.onPress = () => { NumberPickTile(-1) });

    Buttons.one.onPress = () => { NumberPickTile(1) };
    Buttons.two.onPress = () => { NumberPickTile(2) };
    Buttons.three.onPress = () => { NumberPickTile(3) };
    Buttons.four.onPress = () => { NumberPickTile(4) };
    Buttons.five.onPress = () => { NumberPickTile(5) };
    Buttons.six.onPress = () => { NumberPickTile(6) };
    Buttons.seven.onPress = () => { NumberPickTile(7) };
    Buttons.eight.onPress = () => { NumberPickTile(8) };
    Buttons.nine.onPress = () => { NumberPickTile(9) };
    Buttons.zero.onPress = () => { NumberPickTile(10) };
    //#endregion

    // Apply friction
    if (isSlipping) p.velocity.x *= slipFriction;
    else p.velocity.x *= friction;
    isSlipping = false;

    // Apply terminal velocity
    if (p.velocity.y > terminalVel) p.velocity.y = terminalVel;
    else if (p.velocity.y < -terminalVel) p.velocity.y = -terminalVel;
    
    //ControllCam();

    //ctx.fillRect(p.position.x, p.position.y, 2, 2);
    //ctx.fillRect(p.position.x, p.position.y + p.size.h, 2, 2);
}

function GetStomped(p) {
    if (p && !p.stomped) {
        // Stomp player
        p.stomped = true;
        //p.lives--;

        // Play some
        STOMP_SFX.Play();
        DIE_SFX.Play();

        // FX
        StompFX({x: p.position.x, y: p.position.y - 1});
    }
}

function RespawnPlayer(p) {
    // Don't allow respawn if player is out of lives
    if (p) {
        //Players[data.attackingPlayerID]; // the one who stomped
        //let thisPlayer = Players[p];
        p.stomped = false;

        // Reset velocity
        p.velocity = { x: 0, y: 0 };

        // Try respawn
        // choose a random location
        let location = { x: Math.random() * worldBounds.x, y: Math.random() * (worldBounds.y - gridCellSize) };
        // while location is colliding with a tile, pick new location
        while (BlockHere({ size: { w: gridCellSize, h: gridCellSize } }, location.x, location.y)) {
            location = { x: Math.random() * worldBounds.x, y: Math.random() * worldBounds.y };
        }
        // spawn player
        p.position = location;

        // Play sound
        POP_SFX.Play();

        // FX
        //StompFX({x: location.x, y: location.y - 1});
    }
}

////////////////////////////////////////////////////////
// Collisions
////////////////////////////////////////////////////////
function Collision(r1, r2) {
    if (r1.x + r1.w > r2.x &&
        r1.x < r2.x + r2.w &&
        r2.y + r2.h > r1.y &&
        r2.y < r1.y + r1.h) {
        return true;
    } else {
        return false;
    }
};

function PlaceFree(p, xNew, yNew) {
    var temp = {
        x: xNew + 2,
        y: yNew + 4,
        w: p.size.w - 4,
        h: p.size.h - 4
    };
    for (var i = 0; i < Walls.length; i++) {
        var wallTemp = null;
        if (Walls[i] != null) {
            wallTemp = {
                x: Walls[i].position.x,
                y: Walls[i].position.y,
                //w: Walls[i].size.w,
                //h: Walls[i].size.h
                w: gridCellSize,
                h: gridCellSize
            };
        }
        if (wallTemp !== null && Collision(temp, wallTemp)) {
            //console.log("COLLIDE!");
            return false;
        }
    }
    return true;
}

function BlockHere(p, xNew, yNew) {
    var temp = {
        x: xNew + 2,
        y: yNew + 4,
        w: p.size.w - 4,
        h: p.size.h - 4
    };
    for (var i = 0; i < Walls.length; i++) {
        var wallTemp = null;
        if (Walls[i] != null) {
            wallTemp = {
                x: Walls[i].position.x,
                y: Walls[i].position.y,
                w: gridCellSize,
                h: gridCellSize
            };
        }
        if (wallTemp !== null && Collision(temp, wallTemp)) {
            return Walls[i];
        }
    }
    return null;
}

function PlayerHere(p, xNew, yNew) {
    var temp = {
        x: xNew + 2,
        y: yNew + 4,
        w: p.size.w - 4,
        h: p.size.h - 4
    };
    //ctx.strokeStyle = "white";
    //ctx.strokeRect(temp.x + camera.position.x, temp.y + camera.position.y, temp.w, temp.h);
    for (var i in Players) {
        var tempPlayer = null;
        if (Players[i] != null && Players[i] != p) {
            tempPlayer = {
                x: Players[i].position.x,
                y: Players[i].position.y,
                w: Players[i].size.w,
                h: Players[i].size.h
            };
        }
        if (tempPlayer !== null && Collision(temp, tempPlayer)) {
            return Players[i];
        }
    }
    return null;
}

function PlaceFreeCustom(p, xNew, yNew, list) {
    var temp = {
        x: xNew,
        y: yNew,
        w: p.size.w,
        h: p.size.h
    };
    for (var i = 0; i < list.length; i++) {
        var listTemp = {
            x: list[i].position.x,
            y: list[i].position.y,
            w: gridCellSize,
            h: gridCellSize
        };
        if (Collision(temp, listTemp)) {
            return false;
        }
    }
    return true;
}

// Block functions
function CheckAllTileTypes(p, t, fallback, allowMotion, yMotion) {

    if (deadlyTiles.includes(t.tileIndex)) {
        // Kill player
        DeadlyTileAction(p);
        // Also bounce
        fallback();
    }
    else if (bouncyTiles.includes(t.tileIndex)) {
        // Bounce player
        BouncyTileAction(p, fallback);
    }
    else if (slipperyTiles.includes(t.tileIndex)) {
        // Set slipping
        SlipperyTileAction(p);
        // Also bounce
        fallback();

    }
    else if (oneSidedTiles.includes(t.tileIndex)) {
        // If the player is above and is moving down
        let isFalling = p.velocity.y > 0;
        let feetAboveTile = (p.position.y + p.size.h <= t.position.y);
        let tileInBounds = t.position.y >= 0;
        let tileAtTop = t.position.y === 0;
        let feetPastYBounds = p.position.y + p.size.h >= worldBounds.y;

        if ( yMotion && isFalling && ((feetAboveTile && tileInBounds) || (feetPastYBounds && tileAtTop)) ) {
            // Bounce player
            fallback();
        }
        else {
            // Let the player keep moving
            allowMotion();
        }
    }
    else if (offTiles.includes(t.tileIndex)) {
        // Pass through
        allowMotion();
    }
    else if (toggleOnTile === t.tileIndex || toggleOffTile === t.tileIndex) {
        // Toggle all toggleable blocks
        if (p.velocity.y < 0 && p.position.y + (p.size.h/2) > t.position.y) ToggleBlocksAction();
        // Normal bounce
        fallback();
    }
    else {
        // Normal bounce
        fallback();
    }
}

function DeadlyTileAction(p) {
    // Kill player
    if (!p.stomped) {
        // Stomp self for effects
        GetStomped(p);
        // Send server request for life reduction
        StompPlayer(p);
    }
}

function BouncyTileAction(p, BounceFunc) {
    // Change Bounce modifier for this frame
    bounce *= 4.5;

    // Bounce like normal
    BounceFunc();

    // Change back
    bounce /= 4.5;
}

function SlipperyTileAction(p) {
    isSlipping = true;
}

function ToggleBlocksAction() {
    for (var i = 0; i < Walls.length; i++) {
        if (Walls[i]) {
            let newTile = null;
            if (onTiles.includes(Walls[i].tileIndex)) {
                //newTile = new TileWall(Walls[i].position.x, Walls[i].position.y, offTiles[onTiles.indexOf(Walls[i].tileIndex)], Walls[i].ownerId);
                //Walls[i] = newTile;
                Walls[i].tileIndex = offTiles[onTiles.indexOf(Walls[i].tileIndex)];
            }
            else if (offTiles.includes(Walls[i].tileIndex)) {
                //newTile = new TileWall(Walls[i].position.x, Walls[i].position.y, onTiles[offTiles.indexOf(Walls[i].tileIndex)], Walls[i].ownerId);
                //Walls[i] = newTile;
                Walls[i].tileIndex = onTiles[offTiles.indexOf(Walls[i].tileIndex)];
            }

            //Walls.push(newTile);
            //SendRemovedTile(Walls[i]);
            //SendNewTile(newTile);
            UpdateTile(Walls[i]);
        }
    }
}