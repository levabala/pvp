//setting an inheriting for our classes
var basicObject = new physicObject(new pos(0,0), 0, {x: 0, y: 0, z: 0}, 0);    //target of inheriting
player.prototype = basicObject;                                                //inheritance "player" from "physicObject"

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

//preparation for start
objects[objects.length] = new player(new pos(100,100), 200, {x: 20, y: 25, z: 1}, 0, '#ffa500', '#ffffff', null, true);

//say "Hello" for users :)
console.info('Hi! That\'s a version 6.0 of ATB project.\n\n');

//functions
function ticking(){                 //for calculation of ticks of objects life
    for (var object in objects){
        var obj = objects[object];
        obj.tick();
    }
}

function logging(){                 //for showing of output information (state of program)
    log.logging();
}

function rendering(){               //for painting on the canvas
    var ctx = canvas.ctx;
    ctx.save();
    ctx.clearRect(0,0,canvas.w,canvas.h);
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
    }
    if(ks.isDown(39)){
        //Right arrow
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

setInterval(function(){logging();}, 160);
setInterval(function(){ticking();}, 1);
setInterval(function(){rendering();}, 16);




