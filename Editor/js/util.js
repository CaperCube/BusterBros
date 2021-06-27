let $ = (o) => document.querySelector(o);
let $$ = (o) => document.querySelectorAll(o);

//////////////////////////////////////////
// Get random int
//////////////////////////////////////////
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}