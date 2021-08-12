let loadedImages = [];
const imageSRC = [
    "src/busterbros_tiles.png",
    //"src/Classic.png"
    "src/Char1.png",
    "src/Char2.png"
];
const MAIN_SHEET = 0;
const PLAYER_SPRITE = 1;
const PLAYER_OTHER_SPRITE = 2;

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

function PreloadImages(urls, allImagesLoadedCallback) {
    var loadedCounter = 0;
    var toBeLoadedNumber = urls.length;

    urls.forEach(function(url) {
        PreloadImage(url, function() {
            loadedCounter++;
            console.log('Number of loaded images: ' + loadedCounter);
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