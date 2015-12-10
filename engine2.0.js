var canvas;
var ctx;
var players = [];
var bullets = [];
var terrains = [];
var keys = new Set();

document.body.addEventListener('keyup', function(e){
    keys.delete(e.which);
});

document.body.addEventListener('keydown', function(e){
    keys.add(e.which);
    //left 37 down 40 right 39 up 38
});

canvas = document.getElementById("canvas");
ctx = canvas.getContext('2d');
var w = canvas.width = 1000;
var h = canvas.height = 800;
init();
render();

function init(){
    players = {
        fisab: new player('fisab', 200, 200, 'ii/fisab.js', '#FF6E19'), 
        levabala: new player('levabala', 400,400, 'ii/levabala.js', '#008000')//тут только hex
    };

    terrains = [
        new structure('wall', 0, 0, w-10, 20, 'purple'),
        new structure('wall', w-20, 0, 20, h, 'brown'),
        new structure('wall', 0, 0, 20, h-10, 'orange'),
        new structure('wall', 0, h-20, w, 20, 'blue')
    ];

}

function main(){
    if(keys.has(37)){
        players.fisab.rotate('left', 'body');
    }
    if(keys.has(40)){
        players.fisab.move('backward', player);
    }
    if(keys.has(39)){
        players.fisab.rotate('right', 'body');
    }
    if(keys.has(38)){
        players.fisab.move('forward', players);
    }
    for(var player in players){
        var pla = players[player];
        pla.reload --;
        pla.rotate('left', 'gun');
        if(pla.nick == 'levabala'){
            pla.rotate('right', 'body');
            pla.move('forward', players);
        }
        var bullet = pla.shoot();
        if (bullet != false) bullets[bullets.length] = bullet;
    }

    for(var bullet in bullets){
        var bul = bullets[bullet];
        if (bul.lifetime <= - 250) bullets.splice(bul, 1);
        bul.bulletProcess();
        var col = bul.checkCollision(terrains, players);

        if (typeof col == 'object') console.log(col);
    }
}

function render(){
    ctx.fillStyle = 'rgba(245,245,245,0.7)';
    ctx.fillRect(0,0,w,h);
    for (var terrain in terrains){
        var ter = terrains[terrain];
        ter.drawYou(ctx);
    }

    for (var player in players){
        var pla = players[player];
        pla.drawYou(ctx);
    }
    for (var bullet in bullets) {
        var bul = bullets[bullet];
        bul.drawYou(ctx);
    }
}

function loop(){
    render();
    main();
}

setInterval(function(){loop();}, 16);
