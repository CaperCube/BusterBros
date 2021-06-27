////////////////////////////////////////////////////////
// Save / Load
////////////////////////////////////////////////////////

function loadImage(file) {
    var img = new Image();
    try {
        img.src = file;
    }
    catch {
        console.log("Unable to load image " + file);
    }
    return img;
}

// Event for when the image is loaded
$('#DOM_imageLoader').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        //fr.onload = () => askForFileName(fr);
        fr.onload = () => refreshPalette(loadImage(fr.result));
        fr.readAsDataURL(files[0]);
    }
    
    // reset the file input to null so you can load more than one of the same image in a row
    $('#DOM_imageLoader').value = null;
}

function refreshPalette(newImg) {
    //console.log(newImg);
    tileSetImage.src = newImg.src;

    sw = containerSel.width = $("#SelCanvas").style.width = tileSetImage.width;
    sh = containerSel.height = $("#SelCanvas").style.height = tileSetImage.height;
}