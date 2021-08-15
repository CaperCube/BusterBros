// Array to hold all FX
var FX = [];

// FX Class
function ParticleFX(pos, type = `stomp`, loop = false) {
    this.position = pos || {x: 0, y: 0};
    // this will dictate how to render
    this.type = type;
    // If true, will loop fx until destroyed
    this.looping = loop;

    // Game ticks until next animation frame
    this.frameHold = fps/9;
    // Sheet frame index to start on
    this.startFrame = 0;
    // Number of frames in animation
    this.frameCount = 3;
    // Current frame to draw
    this.frame = this.startFrame;
    this.ticks = 0;

    // Loaded image resource index
    this.sheet = STOMP_SHEET;

    // FX object Init
    this.Init = function() {
        switch (this.type) {
            case `stomp`:
                this.startFrame = 0;
                this.sheet = STOMP_SHEET;
                this.looping = false;
                break;
        }

        // Start the animation on the correct frame    
        this.frame = this.startFrame;
    };

    this.Init();
}

// Draw all FX
function DrawFX(cctx) {
    for (var i = 0; i < FX.length; i++) {
        if (FX[i]) {
            // Draw FX
            DrawTile(cctx, loadedImages[FX[i].sheet], gridCellSize, FX[i].frame, FX[i].position.x, FX[i].position.y);
            // Track ticks since start
            FX[i].ticks++;
            // Every FX[i].frameHold ticks, iterate the FX frame
            if (FX[i].ticks % Math.round(FX[i].frameHold) === 0) {
                FX[i].frame++;
                // Loop or remove
                if (FX[i].frame > (FX[i].startFrame + FX[i].frameCount)) {
                    if (FX[i].looping) FX[i].frame = FX[i].startFrame;
                    else FX.splice(i, 1);
                }
            }
        }
    }
};

// Create Stomp FX
function StompFX(pos) {
    // Spawn a new ParticleFX() at poxs.x, pos.y
    let type = `stomp`, loop = false;
    FX.push(new ParticleFX(pos, type, loop));
}