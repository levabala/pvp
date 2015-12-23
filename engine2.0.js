var canvas;
var ctx;
var players = [];
var controlled = [];
var bullets = [];
var terrains = [];
var keys = {};
var deadPlayers = [];

document.body.addEventListener('keyup', function(e){
    keys[e.which] = false;
});

document.body.addEventListener('keydown', function(e){
    keys[e.which] = true;
});

canvas = document.getElementById("canvas");
ctx = canvas.getContext('2d');
var w = canvas.width = 1000;
var h = canvas.height = 800;
init();
render();

function init(){
    //ctx.translate(w / 4, h / 4);
    //ctx.scale(0.3,0.3);
    players = {
        fisab: new player('fisab', 200, 200, 'ii/fisab.js', '#FF6E19'), 
        levabala: new player('levabala', 400,400, 'ii/levabala.js', '#008000'),//тут только hex
        findoff: new player('findoff', 600, 600, 'ii/findoff.js', '#FF00FF')
    };

    controlled = {player1: players.fisab};

    terrains = [
        new structure('wall', 20, 20, w-20, 20, 'purple'),
        new structure('wall', w-40, 0, 20, h, 'brown'),
        new structure('wall', 20, 0, 20, h-10, 'orange'),
        new structure('wall', 0, h-40, w, 20, 'blue'),
        new structure('wall', 100, 120, 100, 50, 'blue')
    ];


}

function playerControl(player){
    if(keys[37]){
        player.rotate('left', 'gun');
    }
    if(keys[40]){
        //down
    }
    if(keys[39]){
        player.rotate('right', 'gun');
    }
    if(keys[38]){
        //up
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

function main(){
    playerControl(players.fisab);
    for(var player in players){
        var pla = players[player];
        pla.checkCollision(pla.pos.x, pla.pos.y, terrains, players, deadPlayers);
        pla.reload --;
        pla.wherePush = [];
        if(pla.nick == 'levabala'){
            pla.rotate('right', 'body');
            pla.rotate('left', 'gun');
            pla.move('forward', players, deadPlayers);
        }
        //смерть:O
        if(pla.hp <= 0){
            deadPlayers.push(new deadPlayer(pla.nick, pla.pos.x, pla.pos.y, pla.bodyAngle, pla.color));
            delete players[player];
        }
    }

    var count = 0;
     for(var bullet in bullets){
        var bul = bullets[bullet];
        if(bul.inplayer == false) {
            if (bul.lifetime <= -250) bullets.splice(count, 1);
            bul.bulletProcess();
            var col = bul.checkCollision(terrains, players);
        }
        count++;
    }
    //players.fisab.radar(terrains, ctx);
}

function render(){
    ctx.save();
    ctx.fillStyle = 'rgba(245,245,245,0.35)';
    //ctx.fillRect(-w * 2,-h * 2,w * 6,h * 6);
    ctx.fillRect(0,0,w,h);
    for(var terrain in terrains){
        var ter = terrains[terrain];
        ter.drawYou(ctx);
    }

    for(var player in players){
        var pla = players[player];
        pla.drawYou(ctx);
    }

    for(var deadPlayer of deadPlayers){
        deadPlayer.drawYou(ctx);
    }

    for(var bullet in bullets) {
        var bul = bullets[bullet];
        bul.drawYou(ctx);
    }
    ctx.restore();
}

function loop(){
    render();
    main();
}

function log(){

}

setInterval(function(){loop();}, 16);
setInterval(function(){log();}, 160);
