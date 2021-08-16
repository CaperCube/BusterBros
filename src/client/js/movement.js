////////////////////////////////////////////////////////
// Platformer controller
////////////////////////////////////////////////////////
function UpdatePositionX(p) {
    // Check x
    if (PlaceFree(p, p.position.x + p.velocity.x, p.position.y)) {
        // Wrap
        if ((p.position.x + (p.size.w/2) + p.velocity.x) < 0) {
            if (PlaceFree(p, worldBounds.x - (gridCellSize/2), p.position.y)) {
                //wrap to Right
                p.position = {x: worldBounds.x - (p.size.h/2), y: p.position.y};
            }
            else {
                // Bounce
                p.velocity.x *= -bounce;
            }
        }
        else if ((p.position.x + (p.size.w/2) + p.velocity.x) >= worldBounds.x) {
            if (PlaceFree(p, 0, p.position.y)) {
                //wrap to Left
                p.position = {x: (p.size.h/-2), y: p.position.y};
            }
            else {
                // Bounce
                p.velocity.x *= -bounce;
            }
        }
        // Do movement
        else p.position.x += p.velocity.x;
    }
    else {
        p.velocity.x *= -bounce;
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

    // Check y
    if (PlaceFree(p, p.position.x, p.position.y + p.velocity.y)) {
        p.position.y += p.velocity.y;
    }
    else {
        // Bounce
        Bounce();
    }
    // world bounds
    if ((p.position.y + (p.size.h/2) + p.velocity.y) < 0) {
        if (PlaceFree(p, p.position.x,  worldBounds.y - (gridCellSize/2))) {
            //wrap to bottom
            p.position = {x: p.position.x, y: worldBounds.y - (p.size.h/2) - 2};
        }
        else {
            // Bounce
            Bounce();
        }
    }
    else if ((p.position.y + (p.size.h/2) + p.velocity.y) >= worldBounds.y) {
        if (PlaceFree(p, p.position.x, 0)) {
            //wrap to top
            p.position = {x: p.position.x, y: (p.size.h/-2) + 2};
        }
        else {
            // Bounce
            Bounce();
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
    // Jump
    function jumpfunc() {
        if (p.usedJumps < p.totalJumps && !p.stomped) {
            p.usedJumps += 1;
            p.velocity.y = -p.jumpSpeed;
        }

        TriggerNetworkSound('jump');
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
            if (p.look >= 0) p.velocity.x -= p.moveSpeed;
            p.dir = -1;
        }
        if (GetInput(Controls.Player1.rightAxis1)) {
            if (p.look >= 0) p.velocity.x += p.moveSpeed;
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
            p.parry = true;
            p.look = -1;
        }
        // Look up
        else if (GetInput(Controls.Player1.upAxis1)) {
            p.parry = false;
            p.look = 1;
        }
        // default
        else {
            p.parry = false;
            p.look = 0;
        }
    }

    //#region Assign controls
    // Jump, Action
    Controls.Player1.jump.forEach(b => b.onPress = jumpfunc);
    Controls.Player1.fire1.forEach(b => b.onPress = buildfunc);

    //UnStomp
    Controls.Player1.pause.forEach(b => b.onPress = () => {if (p.stomped) UnStompSelf()});

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

    // Update position
    UpdatePositionX(p);
    DoGravity(p);
    //WorldWrapX(p);
    UpdatePickups(p);
    
    // Apply friction
    p.velocity.x *= friction;

    // Apply terminal velocity
    if (p.velocity.y > terminalVel) p.velocity.y = terminalVel;
    else if (p.velocity.y < -terminalVel) p.velocity.y = -terminalVel;
    
    //ControllCam();
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