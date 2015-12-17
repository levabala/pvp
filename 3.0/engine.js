//define global variables
var canvas;
var w;
var h;
var ctx;
var image;
var logwindow;
var log;
var keys = new Set();
var players = [];
var controlled = [];
var bullets = [];
var terrains = [];
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
    keys.delete(e.which);
});
document.body.addEventListener('keydown', function(e){
    keys.add(e.which);
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
        /*new structure('wall', {body:[
            new pos(140,140),
            new pos(165,150),
            new pos(190,155),
            new pos(190,300)

        ]}, null, null, convertHex(getRandomColor(), 90), null, 100)*/
    ];
    players = [
        new player('levabala', new pos(100,100), convertHex(getRandomColor(), 99), 'ai/levabala.js')
        //new player('fisab', new pos(200,200), convertHex(getRandomColor(), 99))
    ];
    //ctx.translate(100,100);
    loop();
}


//main loop
function loop(){
    //console.warn('---------------new loop-------------');
    log.logging();
    render();
    tick();
}
var crosses;
//tick's actions
function tick(){
    for(var i in players){
        var player = players[i];
        playerControl(player);
        crosses = player.radar(terrains);
        player.slowdown();
        player.updatePosition();
        log.nl(player.getState());
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
    log.nl('crosses: ');
    for (var i in crosses)
    for (var c in crosses[i]){
        var pos = crosses[i][c];
        log.nl('\n' + pos.x + ' ' + pos.y);
        ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2, false);
    }
    ctx.closePath();
    ctx.fill();
}

function playerControl(player){
    if(keys.has(37)){
        player.rotate('gun', 'left');
    }
    if(keys.has(39)){
        player.rotate('gun', 'right');
    }
    if(keys.has(87)){
        player.move('forward');
    }
    if(keys.has(83)){
        player.move('backward');
    }
    if(keys.has(65)){
        player.rotate('body', 'left');
    }
    if(keys.has(68)){
        player.rotate('body', 'right');
    }
    if(keys.has(32)){
        var bullet = player.shoot();
        if (bullet != false) bullets[bullets.length] = bullet;
    }
}
//setInterval(function(){loop();}, 16);