///////////////////////////////////////
// Resource arrays
///////////////////////////////////////
let loadedImages = [];

///////////////////////////////////////
// Constants
///////////////////////////////////////
const SRC_PATH = "src/";
const SOUND_PATH = "src/sound/";

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
    `${SOUND_PATH}Stomp1.wav`,
    `${SOUND_PATH}Die1.wav`,
    `${SOUND_PATH}Pop1.wav`,
    `${SOUND_PATH}Jump1.wav`,
    `${SOUND_PATH}Land1.wav`,
    `${SOUND_PATH}Build1.wav`,
    `${SOUND_PATH}Remove1.wav`,
    `${SOUND_PATH}BusterBros_Music.wav`
];

const STOMP_SOUND = 0;
const DIE_SOUND = 1;
const POP_SOUND = 2;
const JUMP_SOUND = 3;
const LAND_SOUND = 4;
const BUILD_SOUND = 5;
const REMOVE_SOUND = 6;
const MUSIC_SOUND = 7;

const STOMP_SFX = new Sound(soundSRC[STOMP_SOUND]);
const DIE_SFX = new Sound(soundSRC[DIE_SOUND]);
const POP_SFX = new Sound(soundSRC[POP_SOUND]);
const JUMP_SFX = new Sound(soundSRC[JUMP_SOUND]);
const LAND_SFX = new Sound(soundSRC[LAND_SOUND]);
const BUILD_SFX = new Sound(soundSRC[BUILD_SOUND]);
const REMOVE_SFX = new Sound(soundSRC[REMOVE_SOUND]);
const MUSIC_SFX = new Sound(soundSRC[MUSIC_SOUND], true, 0.25);

//document.onclick = () => {MUSIC_SFX.Play()};

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
function Sound(src, loop = false, volume = 1) {
    // Thanks to: https://www.w3schools.com/graphics/game_sound.asp
    this.loop = false || loop;
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = volume;
    //if (this.loop) this.sound.setAttribute("loop", "auto");
    document.body.appendChild(this.sound);

    this.Play = function(){
        this.sound.currentTime = 0;
        this.sound.play();
    }
    this.Stop = function(){
        this.sound.pause();
    }
    this.sound.addEventListener(`ended`, () => {
        if (this.loop) {
            this.Play();
            //this.sound.setAttribute("loop", "auto");
        }
    });
}