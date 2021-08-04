var cW = 20;
var cH = 20;
var Level0 = {
    walls: [
        // Floor & Celing
        {w: cW, h: 1, x: 0, y: cH - 1},
        {w: cW, h: 1, x: 0, y: 0},
        // Left & Right Walls
        {w: 1, h: cH, x: cW - 1, y: 0},
        {w: 1, h: cH, x: 0, y: 0},
    ],
    spawns: [
        {x: 2, y: 3, player: 0},
        {x: cW - 3, y: 3, player: 1},
        {x: 2, y: cH - 2, player: 2},
        {x: cW - 3, y: cH - 2, player: 3}
    ]
};

var Level1 = {
    walls: [
        // Floor & Celing
        {w: cW, h: 1, x: 0, y: cH - 1},
        {w: cW, h: 1, x: 0, y: 0},
        // Left & Right Walls
        {w: 1, h: cH, x: cW - 1, y: 0},
        {w: 1, h: cH, x: 0, y: 0},

        // Other Walls
        {w: 4, h: 1, x: 5, y: cH - 4},
        {w: 4, h: 1, x: 10, y: cH - 6},
        {w: 4, h: 1, x: 15, y: cH - 10},
        {w: 6, h: 1, x: 5, y: cH - 10}
    ],
    spawns: [
        {x: 2, y: 3, player: 0},
        {x: cW - 3, y: 3, player: 1},
        {x: 2, y: cH - 2, player: 2},
        {x: cW - 3, y: cH - 2, player: 3}
    ]
};

var Level2 = {
    walls: [
        // Floor & Celing
        {w: cW, h: 1, x: 0, y: cH - 1},
        {w: cW, h: 1, x: 0, y: 0},
        // Left & Right Walls
        {w: 1, h: cH, x: cW - 1, y: 0},
        {w: 1, h: cH, x: 0, y: 0},

        // Bottom Walls
        {w: 4, h: 1, x: 1, y: cH - 4},
        {w: 4, h: 1, x: cW - 5, y: cH - 4},
        
        // Middle beams
        {w: 4, h: 6, x: 8, y: cH - 7},
        {w: 8, h: 2, x: cW/2 - 4, y: 4},
        {w: 1, h: 6, x: cW/2 - 0.5, y: 1},
        
        // Top Walls
        {w: 3, h: 1, x: 3, y: 10},
        {w: 3, h: 1, x: cW - 6, y: 10},
        {w: 2, h: 1, x: 1, y: 7},
        {w: 2, h: 1, x: cW - 3, y: 7}
    ],
    spawns: [
        {x: cW/2 - 2.5, y: 3, player: 0},
        {x: cW/2 + 1.5, y: 3, player: 1},
        {x: 2, y: cH - 2, player: 2},
        {x: cW - 3, y: cH - 2, player: 3}
    ]
};

const tileMapLevel = [
    [0,1,1,1,2],
    [32,33,33,33,34],
    [32,33,33,33,34],
    [32,33,33,33,34],
    [64,65,65,65,66]
];