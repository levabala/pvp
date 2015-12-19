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



    image.paint();
}

function loop(){
    render();
    main();
    control();
}

function main(){

}

function render(){

}

function control(player){
    if(ks.isDown(37)){
        player.rotate('gun', 'left');
    }
    if(ks.isDown(39)){
        player.rotate('gun', 'right');
    }
    if(ks.isDown(87)){
        player.move('forward');
    }
    if(ks.isDown(83)){
        player.move('backward');
    }
    if(ks.isDown(65)){
        player.rotate('body', 'left');
    }
    if(ks.isDown(68)){
        player.rotate('body', 'right');
    }
    if(ks.isDown(32)){
        var bullet = player.shoot();
        if (bullet != false) objects.bullets[object.bullets.length] = bullet;
    }
}

setInterval(function(){loop();}, 16);