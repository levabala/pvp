//init
var canvas = new canvas('canvas');
var ctx = canvas.ctx;
var log = new lw(document.getElementById('log'));
var ks = new keys();

document.body.addEventListener('keyup', function(e){
    ks.up(e.which);
});
document.body.addEventListener('keydown', function(e){
    ks.down(e.which);
});

var obj = new physicObject(new pos(400,400), 'cylinder', 0.2, {x:5, y: 5, z: 1},
    {acceleration: 1.0, rotateSpeed: 0.05, maxSpeed: {forward: 10, backward: -5}, speed: 0, braking: 0.6}, null, -0.3);

console.log('Object\'s pressure on the ground: ' +  obj.pressure + 'H');
console.log('Object\'s mass: ' +  obj.mass + 'kg');
console.log('Object\'s angle: ' +  obj.angle + 'radians');

obj.vectors.external[0] = new Vector(obj.pos, null, Math.PI, 1);

ctx.translate(-canvas.w/2,-canvas.h/2);
ctx.scale(2,2);

loop();

function loop(){
    log.logging();

    if (ks.isDown(87) )obj.accelerate();
    if (ks.isDown(83) )obj.brake();

    obj.tick();

    log.nl('Blue: The object\nBlack: Thrust vector\nRed: Acceleration vector');
    log.nl(
        'Thrust.length = ' + obj.vectors.thrust.length +
        '\nBraking.length = ' + obj.vectors.braking.length +
        '\nMoving.length = ' + obj.vectors.moving.length
    );

    ctx.lineWidth = 2;
    ctx.save();
    ctx.clearRect(0,0,canvas.w,canvas.h);
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(obj.pos.x, obj.pos.x, 4, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(obj.vectors.thrust.start.x, obj.vectors.thrust.start.y);
    ctx.lineTo(obj.vectors.thrust.end.x, obj.vectors.thrust.end.y);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(obj.vectors.acceleration.start.x, obj.vectors.acceleration.start.y);
    ctx.lineTo(obj.vectors.acceleration.end.x, obj.vectors.acceleration.end.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    for (var v in obj.vectors.external) {
        ctx.strokeStyle = 'darkgreen';
        ctx.beginPath();
        ctx.moveTo(obj.vectors.external[v].start.x, obj.vectors.external[v].start.y);
        ctx.lineTo(obj.vectors.external[v].end.x, obj.vectors.external[v].end.y);
        ctx.closePath();
        ctx.stroke();
    }
}

setInterval(function(){loop();}, 16);