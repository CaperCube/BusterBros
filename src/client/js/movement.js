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
    // Check y
    if (PlaceFree(p, p.position.x, p.position.y + p.velocity.y)) {
        p.position.y += p.velocity.y;
    }
    else {
        // Bounce
        if (p.velocity.y > 0) p.usedJumps = 0;
        p.velocity.y *= -bounce;
    }
    // world bounds
    if ((p.position.y + (p.size.h/2) + p.velocity.y) < 0) {
        if (PlaceFree(p, p.position.x,  worldBounds.y - (gridCellSize/2))) {
            //wrap to bottom
            p.position = {x: p.position.x, y: worldBounds.y - (p.size.h/2) - 2};
        }
        else {
            // Bounce
            if (p.velocity.y > 0) p.usedJumps = 0;
            p.velocity.y *= -bounce;
        }
    }
    else if ((p.position.y + (p.size.h/2) + p.velocity.y) >= worldBounds.y) {
        if (PlaceFree(p, p.position.x, 0)) {
            //wrap to top
            p.position = {x: p.position.x, y: (p.size.h/-2) + 2};
        }
        else {
            // Bounce
            if (p.velocity.y > 0) p.usedJumps = 0;
            p.velocity.y *= -bounce;
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
    // Move
    if (GetInput(Controls.Player1.leftAxis1)) {
        p.velocity.x -= p.moveSpeed;
        p.dir = -1;
    }
    if (GetInput(Controls.Player1.rightAxis1)) {
        p.velocity.x += p.moveSpeed;
        p.dir = 1;
    }
    
    // Jump
    function jumpfunc() {
        if (p.usedJumps < p.totalJumps) {
            p.usedJumps += 1;
            p.velocity.y = -p.jumpSpeed;
        }
    }
    Controls.Player1.upAxis1[0].onPress = jumpfunc;
    Controls.Player1.upAxis1[1].onPress = jumpfunc;
    
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
    Controls.Player1.fire1[0].onPress = shootfunc;
    Controls.Player1.fire1[1].onPress = shootfunc;
    
    // Parry
    if (GetInput(Controls.Player1.downAxis1)) {
        p.parry = true;
    }
    else p.parry = false;

    // Update position
    UpdatePositionX(p);
    DoGravity(p);
    //WorldWrapX(p);
    UpdatePickups(p);
    
    // Apply friction
    p.velocity.x *= friction;
    
    //ControllCam();
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