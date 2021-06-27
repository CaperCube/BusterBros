////////////////////////////////////////////////////////
// Platformer controller
////////////////////////////////////////////////////////
function UpdatePositionX(p) {
    // Check x
    if (PlaceFree(p, p.position.x + p.velocity.x, p.position.y)) {
        p.position.x += p.velocity.x;
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
        if (p.velocity.y > 0) p.usedJumps = 0;
        p.velocity.y *= -bounce;
    }
    p.velocity.y += gravity;
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
    
    // Update position
    UpdatePositionX(p);
    DoGravity(p);
    UpdatePickups(p);
    
    // Apply friction
    p.velocity.x *= friction;
    
    //ControllCam();
}

function ControlLoopTopDown(p) {
    // Update velocity
    if (GetInput(Controls.Player1.leftAxis1)) p.velocity.x -= p.moveSpeed;
    if (GetInput(Controls.Player1.rightAxis1)) p.velocity.x += p.moveSpeed;
    if (GetInput(Controls.Player1.upAxis1)) p.velocity.y -= p.moveSpeed;
    if (GetInput(Controls.Player1.downAxis1)) p.velocity.y += p.moveSpeed;
    
    // Update position
    UpdatePositionXY(p);
    
    // Apply friction
    p.velocity.x *= friction;
    p.velocity.y *= friction;
    
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
        x: xNew,
        y: yNew,
        w: p.size.w,
        h: p.size.h
    };
    for (var i = 0; i < Walls.length; i++) {
        var wallTemp = {
            x: Walls[i].position.x,
            y: Walls[i].position.y,
            w: Walls[i].size.w,
            h: Walls[i].size.h
        };
        if (Collision(temp, wallTemp)) {
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