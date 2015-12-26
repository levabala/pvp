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

var obj = new physicObject(new pos(400,400), 'cylinder', false, 0.2, {x:5, y: 5, z: 1},
    {acceleration: 0.1, rotateSpeed: 0.05, maxSpeed: {forward: 10, backward: -5}, speed: 0, braking: 0.1}, 0.01, -0.3);

var wall = new physicObject(new pos(500,500), 'cube', true, null, {x:25, y: 10, z: 4});
wall.showState();

console.log('Object\'s pressure on the ground: ' +  obj.pressure + 'H');
console.log('Object\'s mass: ' +  obj.mass + 'kg');
console.log('Object\'s angle: ' +  obj.angle + 'radians');

//ctx.translate(200,200);
//ctx.scale(0.5,0.5);

var vector = new Vector(new pos(300,300), new pos(500,400));
vector.getCoefficients();
console.log(vector.equation);

var p1 = new pos(400,100);
var p2 = new pos(300,200);

console.log(getRange(p1,vector));

loop();

function loop(){
    var r = getRange(obj.pos,vector);
    //obj.vectors.external[0] = new Vector(obj.pos, new pos(obj.pos.x + 2, obj.pos.y));

    if (ks.isDown(87)) obj.accelerate();
    if (ks.isDown(83)) obj.brake();
    if (ks.isDown(65)) obj.toLeft();
    if (ks.isDown(68)) obj.toRight();

    obj.tick();

    ctx.lineWidth = 2;
    ctx.save();
    ctx.clearRect(0,0,canvas.w,canvas.h);
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(obj.pos.x, obj.pos.y, 4, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(obj.vectors.thrust.start.x, obj.vectors.thrust.start.y);
    ctx.lineTo(obj.vectors.thrust.end.x, obj.vectors.thrust.end.y);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(obj.pos.x, obj.pos.y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(obj.vectors.acceleration.start.x, obj.vectors.acceleration.start.y);
    ctx.lineTo(obj.vectors.acceleration.end.x, obj.vectors.acceleration.end.y);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(obj.vectors.acceleration.start.x, obj.vectors.acceleration.start.y);
    ctx.lineTo(obj.vectors.acceleration.end.x, obj.vectors.acceleration.end.y);
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = 1;
    for (var v in obj.vectors.external) {
        ctx.strokeStyle = 'darkgreen';
        ctx.beginPath();
        ctx.moveTo(obj.vectors.external[v].start.x, obj.vectors.external[v].start.y);
        ctx.lineTo(obj.vectors.external[v].end.x, obj.vectors.external[v].end.y);
        ctx.closePath();
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(vector.start.x, vector.start.y);
    ctx.lineTo(vector.end.x, vector.end.y);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    var point = getCrossingVandC(new circle(obj.pos, obj.size.x), vector);
    ctx.arc(point.x, point.y, 15, 0, Math.PI * 2, false);
    ctx.arc(p1.x, p1.y, 15, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function logging(){
    log.nl('Blue: The object\nBlack: Thrust vector\nRed: Acceleration vector');
    log.nl(
        'Thrust.length = ' + obj.vectors.thrust.length +
        '\nBraking.length = ' + obj.vectors.braking.length +
        '\nMoving.length = ' + obj.vectors.moving.length +
        '\nEngine\'s speed = ' + obj.engine.speed +
        '\nAcceleration.length = ' + obj.vectors.acceleration.length
    );
    log.nl('D1: ' + getCrossingVandC(new circle(obj.pos, obj.size.x), vector));
    log.logging();
}

setInterval(function(){loop();}, 16);
setInterval(function(){logging();}, 16);