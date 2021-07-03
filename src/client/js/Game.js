//
// Great resource for cutting back on colission computation
// https://stackoverflow.com/questions/4896280/avoid-on2-complexity-for-collision-detection
//

function startGame() {
    socket.emit("startGame");
}
//Buttons.s.onPress = startGame;

socket.on("ServerPacket", function(data){
    //
    console.log(data);
});

//
// On Render loop:
// Update
// Check collision
// Draw
//