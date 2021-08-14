function testButtonDown() {
    //console.log(Object.values(this)[0] + " down");
}

function testButtonUp() {
    //console.log(Object.values(this)[0] + " up");
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Keyboard inputs
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

var Buttons = {
    // mouse buttons
    lmb: {name: "left mouse", type: "mouse", pressed: false, onPress: testButtonDown, onRelease: testButtonUp}, // left mouse button
    rmb: {name: "right mouse", type: "mouse", pressed: false, onPress: testButtonDown, onRelease: testButtonUp}, // right mouse button
    mmb: {name: "middle mouse", type: "mouse", pressed: false, onPress: testButtonDown, onRelease: testButtonUp}, // middle mouse button
    //
    backspace: {name: "backspace", code: 8, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    tab: {name: "tab", code: 9, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    enter: {name: "enter", code: 13, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    shift: {name: "shift", code: 16, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    control: {name: "control", code: 17, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    alt: {name: "alt", code: 18, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    caps: {name: "capslock", code: 20, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    escape: {name: "escape", code: 27, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    space: {name: "space", code: 32, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    pageUp: {name: "pageUp", code: 33, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    pageDown: {name: "pageDown", code: 34, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    end: {name: "end", code: 35, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    home: {name: "home", code: 36, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    left: {name: "left", code: 37, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    up: {name: "up", code: 38, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    right: {name: "right", code: 39, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    down: {name: "down", code: 40, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    insert: {name: "insert", code: 45, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    delete: {name: "delete", code: 46, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    zero: {name: "0", code: 48, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    one: {name: "1", code: 49, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    two: {name: "2", code: 50, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    three: {name: "3", code: 51, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    four: {name: "4", code: 52, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    five: {name: "5", code: 53, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    six: {name: "6", code: 54, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    seven: {name: "7", code: 55, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    eight: {name: "8", code: 56, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    nine: {name: "9", code: 57, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    a: {name: "a", code: 65, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    b: {name: "b", code: 66, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    c: {name: "c", code: 67, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    d: {name: "d", code: 68, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    e: {name: "e", code: 69, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    f: {name: "f", code: 70, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    g: {name: "g", code: 71, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    h: {name: "h", code: 72, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    i: {name: "i", code: 73, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    j: {name: "j", code: 74, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    k: {name: "k", code: 75, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    l: {name: "l", code: 76, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    m: {name: "m", code: 77, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    n: {name: "n", code: 78, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    o: {name: "o", code: 79, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    p: {name: "p", code: 80, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    q: {name: "q", code: 81, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    r: {name: "r", code: 82, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    s: {name: "s", code: 83, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    t: {name: "t", code: 84, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    u: {name: "u", code: 85, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    v: {name: "v", code: 86, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    w: {name: "w", code: 87, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    x: {name: "x", code: 88, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    y: {name: "y", code: 89, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    z: {name: "z", code: 90, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    semicolon: {name: "semicolon", code: 186, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    equals: {name: "equals", code: 187, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    comma: {name: "comma", code: 188, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    minus: {name: "minus", code: 189, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    period: {name: "period", code: 190, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    slash: {name: "slash", code: 191, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    backquote: {name: "backquote", code: 192, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    bracketLeft: {name: "bracketLeft", code: 219, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    backslash: {name: "backslash", code: 220, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    bracketRight: {name: "bracketRight", code: 221, pressed: false, onPress: testButtonDown, onRelease: testButtonUp},
    quote: {name: "quote", code: 222, pressed: false, onPress: testButtonDown, onRelease: testButtonUp}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Events
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

document.addEventListener('keydown', KeyDown);
document.addEventListener('keyup', KeyUp);
document.addEventListener('mousedown', MouseDown);
document.addEventListener('mouseup', MouseUp);

function KeyDown(e) {
    // loop through all buttons, and set pressed key to true
    if (!e.repeat) {
        for (var i = 0; i < Object.keys(Buttons).length; i++) {
            var thisBtn = Object.entries(Buttons)[i];
            if (thisBtn[1].hasOwnProperty("code")) {
                if (thisBtn[1].code == e.keyCode)
                {
                    thisBtn[1].pressed = true;
                    if (thisBtn[1].hasOwnProperty("onPress")) thisBtn[1].onPress();
                }
            }
        }
    }
}

function KeyUp(e) {
    // loop through all buttons, and set released key to false
    for (var i = 0; i < Object.keys(Buttons).length; i++) {
        var thisBtn = Object.entries(Buttons)[i];
        if (thisBtn[1].hasOwnProperty("code")) {
            if (thisBtn[1].code == e.keyCode)
            {
                thisBtn[1].pressed = false;
                if (thisBtn[1].hasOwnProperty("onRelease")) thisBtn[1].onRelease();
            }
        }
    }
}

function MouseDown(e) {
    if (e.button == 0) 
    {
        Buttons.lmb.pressed = true;
        if (Buttons.lmb.hasOwnProperty("onPress")) Buttons.lmb.onPress();
    }
    else if (e.button == 1)
    {
        Buttons.mmb.pressed = true;
        if (Buttons.mmb.hasOwnProperty("onPress")) Buttons.mmb.onPress();
    }
    else if (e.button == 2)
    {
        Buttons.rmb.pressed = true;
        if (Buttons.rmb.hasOwnProperty("onPress")) Buttons.rmb.onPress();
    }
    
    //console.log("mouse button " + e.button + ": ");
}

function MouseUp(e) {
    if (e.button == 0)
    {
        Buttons.lmb.pressed = false;
        if (Buttons.lmb.hasOwnProperty("onRelease")) Buttons.lmb.onRelease();
    }
    else if (e.button == 1)
    {
        Buttons.mmb.pressed = false;
        if (Buttons.mmb.hasOwnProperty("onRelease")) Buttons.mmb.onRelease();
    }
    else if (e.button == 2) 
    {
        Buttons.rmb.pressed = false;
        if (Buttons.rmb.hasOwnProperty("onRelease")) Buttons.rmb.onRelease();
    }
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Controls
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function GetInput(btnAr) {
    var check = false;
    for (var i = 0; i < btnAr.length; i++) {
        if (btnAr[i].pressed) check = true;
    }
    return check;
}

var Controls = {
    Player1: {
        upAxis1: [Buttons.up, Buttons.w],
        downAxis1: [Buttons.down, Buttons.s],
        leftAxis1: [Buttons.left, Buttons.a],
        rightAxis1: [Buttons.right, Buttons.d],
        jump: [Buttons.x, Buttons.period],
        crouch: [Buttons.control],
        run: [Buttons.z, Buttons.slash],
        fire1: [Buttons.c, Buttons.comma],
        reload: [Buttons.r],
        //invUp: [Buttons.e],
        //invDown: [Buttons.q],
        invUp: [Buttons.equals],
        invDown: [Buttons.minus],
        pause: [Buttons.p]
    }
}
