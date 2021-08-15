///////////////////////////////////////
// Resource arrays
///////////////////////////////////////
let loadedImages = [];

///////////////////////////////////////
// Constants
///////////////////////////////////////
const SRC_PATH = "src/";

// Images
const imageSRC = [
    `${SRC_PATH}busterbros_tiles.png`,
    `${SRC_PATH}Char_Blue.png`,
    `${SRC_PATH}Char_Red.png`,
    `${SRC_PATH}Stomp_fx.png`
];

const MAIN_SHEET = 0;
const PLAYER_SPRITE = 1;
const PLAYER_OTHER_SPRITE = 2;
const STOMP_SHEET = 3;

const uiTiles = {
    tl: 923,
    t: 924,
    tr: 925,
    ml: 955,
    m: 956,
    mr: 957,
    bl: 987,
    b: 988,
    br: 989
}

// Sounds
const soundSRC = [
    `${SRC_PATH}Stomp1.wav`,
    `${SRC_PATH}Die1.wav`,
    `${SRC_PATH}Pop1.wav`,
    //`${SRC_PATH}Jump1.wav`

    //`${SRC_PATH}Step_01.wav`,
    //`${SRC_PATH}Step_02.wav`,
    //`${SRC_PATH}Step_03.wav`,
    //`${SRC_PATH}Step_04.wav`
];

const STOMP_SOUND = 0;
const DIE_SOUND = 1;
const POP_SOUND = 2;
//const STEP1_SOUND = 3;
//const STEP2_SOUND = 4;
//const STEP3_SOUND = 5;
//const STEP4_SOUND = 6;

const STOMP_SFX = new Sound(soundSRC[STOMP_SOUND]);
const DIE_SFX = new Sound(soundSRC[DIE_SOUND]);
const POP_SFX = new Sound(soundSRC[POP_SOUND]);
//const STEP1_SFX = new Sound(soundSRC[STEP1_SOUND]);
//const STEP2_SFX = new Sound(soundSRC[STEP2_SOUND]);
//const STEP3_SFX = new Sound(soundSRC[STEP3_SOUND]);
//const STEP4_SFX = new Sound(soundSRC[STEP4_SOUND]);

///////////////////////////////////////
// Load functions
///////////////////////////////////////
function PreloadImages(urls, allImagesLoadedCallback) {
    var loadedCounter = 0;
    var toBeLoadedNumber = urls.length;

    urls.forEach(function(url) {
        PreloadImage(url, function() {
            loadedCounter++;
            //console.log('Number of loaded images: ' + loadedCounter);
            if(loadedCounter == toBeLoadedNumber) {
                allImagesLoadedCallback();
            }
        });
    });
    function PreloadImage(url, anImageLoadedCallback) {
        var img = new Image();
        img.onload = anImageLoadedCallback;
        img.src = url;
        loadedImages.push(img);
    }
}

// Sound class
function Sound(src) {
    // Thanks to: https://www.w3schools.com/graphics/game_sound.asp
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.Play = function(){
        this.sound.play();
    }
    this.Stop = function(){
        this.sound.pause();
    }
}