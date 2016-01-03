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

var obj = new physicObject(new pos(100,200), 'cylinder', false, 0.0001, {x:25, y: 25, z: 1},
    {acceleration: 0.2, rotateSpeed: 0.1, maxSpeed: {forward: 2.5, backward: -1.25}, speed: 0, braking: 0.025}, 0.0001, -0.3);

var obj2 = new physicObject(new pos(50,300), 'cylinder', false, 0.0001, {x:25, y: 25, z: 1},
    {acceleration: 0.2, rotateSpeed: 0.1, maxSpeed: {forward: 2.5, backward: -1.25}, speed: 0, braking: 0.025}, 0.0001, -0.3);

var wall = new physicObject(new pos(500,500), 'cube', true, null, {x:25, y: 10, z: 4});
wall.showState();

console.log('Object\'s pressure on the ground: ' +  obj.pressure + 'H');
console.log('Object\'s mass: ' +  obj.mass + 'kg');
console.log('Object\'s angle: ' +  obj.angle + 'radians');

ctx.translate(200,200);
ctx.scale(0.5,0.5);

var vector = new Vector(new pos(0,0), new pos(1500,1400));
vector.getCoefficients();
console.log(vector.equation);

var p1 = new pos(400,100);
var p2 = new pos(300,200);

console.log(getRange(p1,vector));

ticking();

function ticking(){
    obj.tick();

    //var r = getRange(obj.pos,vector);

    var res = collisionCheck([obj, obj2, vector]);
    for (var r in res){
        if (res[r].force != null){
            var f = res[r].force;
            if (!isNaN(f.length)) obj.vectors.external[0] = f;
        }
    }

}

function control(){
    if (ks.isDown(87)) obj.accelerate();
    if (ks.isDown(83)) obj.brake();
    if (ks.isDown(65)) obj.toLeft();
    if (ks.isDown(68)) obj.toRight();
}

function render(){
    var res = collisionCheck([obj, obj2, vector]);
    for (var r in res){
        var str = ''
        if (res[r].force != null){
            str = r + ': {obj: ' + res[r].obj + ', state: ' + res[r].state + ', force.length: ' + res[r].force.length + '}';
            var f = res[r].force;
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(f.start.x, f.start.y);
            ctx.lineTo(f.end.x + f.dx * 30, f.end.y + f.dy * 30);
            ctx.stroke();
            if (!isNaN(f.length)) obj.vectors.external[0] = f;
        }
        else str = r + ': {obj: ' + res[r].obj + ', state: ' + res[r].state + '}';

        var line = new Vector(obj.pos, null, vector.angle + Math.PI / 2, 10);
        line.getCoefficients();
        /*ctx.beginPath();
         ctx.moveTo(0,line.equation.b);
         ctx.lineTo(1000,1000*line.equation.k + line.equation.b);
         ctx.stroke();*/
        var v = obj.vectors.thrust;
        var d1 = v.length;
        var d2 = getRange(v.end, line);
        str += '\nv.end: ' + v.end.x + ' ' + v.end.y;
        str += '\nk and b: ' + line.equation.k + ' ' + line.equation.b;

        var d3 = Math.sqrt(d1 * d1 - d2 * d2);

        str += '\nd1: ' + d1;
        str += '\nd2: ' + d2;
        str += '\nd3: ' + d3;

        //log.nl(str);
    }

    ctx.lineWidth = 9;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,1)'; //gradient filling
    ctx.fillRect(-canvas.w,-canvas.h,canvas.w * 3,canvas.h * 3);

    ctx.strokeStyle = 'orange';
    ctx.beginPath();
    ctx.arc(obj.pos.x, obj.pos.y, obj.size.x, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = 'brown';
    ctx.beginPath();
    ctx.arc(obj2.pos.x, obj2.pos.y, obj2.size.x, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(obj.vectors.thrust.start.x, obj.vectors.thrust.start.y);
    ctx.lineTo(obj.vectors.thrust.end.x + obj.vectors.thrust.dx * 30, obj.vectors.thrust.end.y + obj.vectors.thrust.dy * 30);
    ctx.closePath();
    ctx.stroke();

    /*
     ctx.beginPath();
     ctx.arc(obj.pos.x, obj.pos.y, r, 0, Math.PI * 2, false);
     ctx.closePath();
     ctx.stroke();*/

    ctx.lineWidth = 5;
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(obj.vectors.moving.start.x, obj.vectors.moving.start.y);
    ctx.lineTo(obj.vectors.moving.start.x + obj.vectors.moving.dx * 30, obj.vectors.moving.start.y + obj.vectors.moving.dy * 30);
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(obj.vectors.acceleration.start.x, obj.vectors.acceleration.start.y);
    ctx.lineTo(obj.vectors.acceleration.start.x + obj.vectors.acceleration.dx * 30, obj.vectors.acceleration.start.y + obj.vectors.acceleration.dy * 30);
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = 2;
    for (var v in obj.vectors.external) {
        var evec = obj.vectors.external[v]
        //log.nl('external vector ' + evec.start.x + ' ' + evec.start.y + '   ' + evec.end.x + ' '+ evec.end.y);
        ctx.strokeStyle = 'darkgreen';
        ctx.beginPath();
        ctx.moveTo(obj.vectors.external[v].start.x, obj.vectors.external[v].start.y);
        ctx.lineTo(obj.vectors.external[v].start.x + obj.vectors.external[v].dx * 30, obj.vectors.external[v].end.y + obj.vectors.external[v].dy * 30);
        ctx.closePath();
        ctx.stroke();
    }

    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(vector.start.x, vector.start.y);
    ctx.lineTo(vector.end.x, vector.end.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

function logging(){
    log.nl('Blue: The object\nBlack: Thrust vector\nRed: Acceleration vector');
    log.nl(
        'Thrust.length = ' + obj.vectors.thrust.length +
        '\nBraking.length = ' + obj.vectors.braking.length +
        '\nMoving.length = ' + obj.vectors.moving.length +
        '\nEngine\'s speed = ' + obj.engine.speed +
        '\nAcceleration.length = ' + obj.vectors.acceleration.length +
        '\nCount of external vectors = ' + obj.vectors.external.length
    );
    log.logging();
}

setInterval(function(){logging();}, 160);
setInterval(function(){ticking();}, 1);
setInterval(function(){control();}, 16);
setInterval(function(){render();}, 16);