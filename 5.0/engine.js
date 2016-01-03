var canvas = {};
var ks = [];
var image = {};
var objects = {
    terrains: [],
    players: [],
    bullets: []
};
var mouse = {x: 0, y: 0};
var log = {};

var vector = new Vector(new pos(0,0), new pos(1500,1400));
vector.getCoefficients();

//set listeners
document.onmousemove = function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
};

document.body.addEventListener('keyup', function(e){
    ks.up(e.which);
});
document.body.addEventListener('keydown', function(e){
    ks.down(e.which);
});

//initialisation
init();
function init(){
    console.clear();
    console.log('Time to control!')
    var c = document.getElementById("canvas");
    var ctx = c.getContext('2d');
    ctx.width = c.width;
    ctx.height = c.height;

    canvas = {
        dom: c,
        ctx: ctx,
        w: c.width,
        h: c.height
    };

    log = new lw(document.getElementById('log'));
    image = new draw(objects, canvas.ctx);
    ks = new keys();

    objects.terrains = [

    ];

    objects.players = [
        new player('lev', new pos(100,100), 'orange')
    ];

    render();
}




function main(){
    for (var p in objects.players){
        var player = objects.players[p];
        control(player);
        player.tick();
        var res = collisionCheck([player.physicObject, vector]);
        for (var r in res){
            if (res[r].force != null){
                var f = res[r].force;
                if (!isNaN(f.length)) {
                    console.log('collision!');
                    player.physicObject.vectors.external[0] = f;
                }
            }
        }
    }
}

function logging(){
    for (var p in objects.players){
        var player = objects.players[p];
        log.nl(player.physicObject.vectors.braking.length);
        log.nl(player.physicObject.engine.speed);
        log.nl(player.pos.x + ' ' + player.pos.y);
    }
    log.logging();
}

function render(){
    image = new draw(objects, canvas.ctx);
    image.paint(true);

    canvas.ctx.save();
    canvas.ctx.strokeStyle = 'red';
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(vector.start.x, vector.start.y);
    canvas.ctx.lineTo(vector.end.x, vector.end.y);
    canvas.ctx.closePath();
    canvas.ctx.stroke();
    canvas.ctx.restore();
}

function control(player){
    if(ks.isDown(37)){
        var input = {
            type: 'rotating',
            command: {
                speed: -1,
                bodypart: 'gun'
            }
        };
        player.command(input);
    }
    if(ks.isDown(39)){
        var input = {
            type: 'rotating',
            command: {
                speed: 1,
                bodypart: 'gun'
            }
        };
        player.command(input);
    }
    if(ks.isDown(87)){
        var input = {
            type: 'moving',
            command: {
                acc: 0.1
            }
        };
        player.command(input);
    }
    if(ks.isDown(83)){
        var input = {
            type: 'moving',
            command: {
                acc: -0.1
            }
        };
        player.command(input);
    }
    if(ks.isDown(65)){
        var input = {
            type: 'rotating',
            command: {
                speed: -1,
                bodypart: 'body'
            }
        };
        player.command(input);
    }
    if(ks.isDown(68)){
        var input = {
            type: 'rotating',
            command: {
                speed: 1,
                bodypart: 'body'
            }
        };
        player.command(input);
    }
    if(ks.isDown(32)){
        var bullet = player.shoot();
        if (bullet != false) objects.bullets[object.bullets.length] = bullet;
    }
}

setInterval(function(){logging();}, 160);
setInterval(function(){main();}, 1);
setInterval(function(){control(objects.players[0]);}, 16);
setInterval(function(){render();}, 16);