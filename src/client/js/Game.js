//alert("game loaded");

function startGame() {
    socket.emit("startGame");
}

Buttons.s.onPress = startGame;