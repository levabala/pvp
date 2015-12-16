//define global variables
var canvas;
var w;
var h;
var ctx;
var image;
var logwindow;
var log;
var keys;
var players = [];
var controlled = [];
var bullets = [];
var terrains = [];
var keys = {};
var deadPlayers = [];
var mouseX = 100;
var mouseY = 100;

//set listeners
document.onmousemove = function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    //players[0].gun.vector = new Vector(players[0].pos, new pos(mouseX, mouseY), null, null);
};

document.body.addEventListener('keyup', function(e){
    keys[e.which] = false;
});

document.body.addEventListener('keydown', function(e){
    keys[e.which] = true;
});

//init the variables
init();
function init(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    logwindow = document.getElementById('log');
    log = new lw(logwindow);
    w = canvas.width;
    h = canvas.height;
    ctx.width = w;
    ctx.height = h;
    image = new draw([],ctx);
    terrains = [
        new structure('ground', {body:[
            new pos(20,20),
            new pos(w-20,20),
            new pos(w-20,h-20),
            new pos(20,h-20),
            new pos(20,20)
        ]}, null, null, convertHex(getRandomColor(), 10), null, 100),
        new structure('wall', {body:[
            new pos(20,20),
            new pos(w-20,20),
            new pos(w-20,40),
            new pos(20,40),
            new pos(20,20)
        ]}, null, null, convertHex(getRandomColor(), 90), null, 100),
        new structure('wall', {body:[
            new pos(w-20,20),
            new pos(w-20,h-20),
            new pos(w-40,h-20),
            new pos(w-40,h-20),
            new pos(w-40,20)
        ]}, null, null, convertHex(getRandomColor(), 90), null, 100),
        new structure('wall', {body:[
            new pos(w-20,h-20),
            new pos(20,h-20),
            new pos(20,h-40),
            new pos(w-20,h-40),
            new pos(w-20,h-20)
        ]}, null, null, convertHex(getRandomColor(), 90), null, 100),
        new structure('wall', {body:[
            new pos(w/3,h/3),
            new pos(w/3 + 100,h/3),
            new pos(w/3 + 100,h/3 + 100),
            new pos(w/3,h/3 + 100),
            new pos(w/3,h/3),
        ]}, null, null, convertHex(getRandomColor(), 90), null, 100),
        new structure('wall', {body:[
            new pos(40,h-20),
            new pos(20,h-20),
            new pos(20,20),
            new pos(40,20),
            new pos(40,h-20)
        ]}, null, null, convertHex(getRandomColor(), 90), null, 100)
    ];
    players = [
        new player('levabala', new pos(100,100), convertHex(getRandomColor(), 99), 'ai/levabala.js')
        //new player('fisab', new pos(200,200), convertHex(getRandomColor(), 99))
    ];
    loop();
}


//main loop
function loop(){
    //console.warn('---------------new loop-------------');
    render();
    tick();
}
var crosses;
//tick's actions
function tick(){
    for (var i in players){
        var player = players[i];
        playerControl(player);
        //player.rotate('right', 'gun');
        crosses = player.radar(terrains);
        //player.rotate('right', 'body');
        //player.move('forward');
        player.updatePosition();
    }
}

//drawing on the canvas
function render(){
    image.arrays = [terrains, players, bullets];
    image.paint();
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    var sV= players[0].gun.seeVector;
    ctx.moveTo(sV.start.x, sV.start.y);
    ctx.lineTo(sV.end.x, sV.end.y);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'green';
    ctx.beginPath();
    for (var i in crosses)
    for (var c in crosses[i]){
        var pos = crosses[i][c];
        ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2, false);
    }
    ctx.closePath();
    ctx.fill();
}

function playerControl(player){
    if(keys[37]){
        player.rotate('left', 'gun');
    }
    if(keys[39]){
        player.rotate('right', 'gun');
    }
    if(keys[87]){
        player.move('forward', players, deadPlayers);
    }
    if(keys[83]){
        player.move('backward', players, deadPlayers);
    }
    if(keys[65]){
        player.rotate('left', 'body');
    }
    if(keys[68]){
        player.rotate('right', 'body');
    }
    if(keys[32]){
        var bullet = player.shoot();
        if (bullet != false) bullets[bullets.length] = bullet;
    }
}
setInterval(function(){loop();}, 16);

