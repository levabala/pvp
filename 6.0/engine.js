//setting an inheriting for our classes
var basicObject = new physicObject(new pos(0,0), 0, {x: 0, y: 0, z: 0}, 0);    //target of inheriting
player.prototype = basicObject;                                                //inheritance "player" from "physicObject"
terrain.prototype = basicObject;                                                //inheritance "terrain" from "physicObject"

//set variables for working with web page
var log = new lw(document.getElementById('log'));
var canvas = new canvas('canvas');

//objects on the map
var objects = [];

//object for working with keystrokes
var ks = new keys();

//set listeners for intercepting keys
document.body.addEventListener('keyup', function(e){
    ks.up(e.which);
});
document.body.addEventListener('keydown', function(e){
    ks.down(e.which);
});

//preparation for start (creating basic objects)

objects[objects.length] = new terrain(new pos(50,50),
    [
        new pos(480,0),
        new pos(580,100),
        new pos(580,300),
        new pos(480,400),
        new pos(180,400)
    ], '#008000', '#008000');
objects[objects.length] = new player(new pos(100,100), 200, {x: 20, y: 25, z: 1}, Math.PI / 2, '#ffa500', '#ffffff', null, true);

//say "Hello" for users :)
console.info('Hi! That\'s a version 6.0 of ATB project.\n\n');

//functions
function ticking(){                 //for calculation of ticks of objects life
    collisionChecking(objects);
    for (var object in objects){
        var obj = objects[object];
        obj.tick();
    }
}

function logging(){                 //for showing of output information (state of program)
    log.logging();
    var pl = objects[0];
    log.nl(pl.vectors.moving.length);
    log.nl(pl.vectors.braking.length);
    log.nl(pl.vectors.thrust.length);
    log.nl(pl.vectors.external.length);
    if (pl.vectors.external[0]) log.nl(pl.vectors.external[0].length);
}

function rendering(){               //for painting on the canvas
    //clearing the canvas
    var ctx = canvas.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(245,245,245,0.85)';
    ctx.fillRect(0,0,canvas.w,canvas.h);
    ctx.restore();
    for (var object in objects){
        var obj = objects[object];
        obj.render(canvas.ctx);
        if (obj.controlled == true) control(obj);
    }
}

function control(player){
    if(ks.isDown(37)){
        //Left arrow
        player.rotateGunToLeft();
    }
    if(ks.isDown(39)){
        //Right arrow
        player.rotateGunToRight();
    }
    if(ks.isDown(87)){
        //W
        player.accelerate();
    }
    if(ks.isDown(83)){
        //S
        player.brake();
    }
    if(ks.isDown(65)){
        //A
        player.toLeft();
    }
    if(ks.isDown(68)){
        //D
        player.toRight();
    }
    if(ks.isDown(32)){
        //space
    }
}

setInterval(function(){logging();}, 161);
setInterval(function(){ticking();}, 1);
setInterval(function(){rendering();}, 16);




