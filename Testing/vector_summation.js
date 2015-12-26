//init
var canvas;
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

var vector1 = new Vector(new pos(100,100), new pos(180,100));
console.log(vector1);

var vector2 = new Vector(new pos(100,100), new pos(100, 50));
console.log(vector2);

var vector3 = vector1.sumWith(vector2);
console.log(vector3);

ctx.strokeStyle = 'black';
ctx.lineWidth = 5;
ctx.save();
ctx.beginPath();
ctx.moveTo(vector1.start.x, vector1.start.y);
ctx.lineTo(vector1.end.x, vector1.end.y);
ctx.closePath();
ctx.stroke();
ctx.strokeStyle = 'blue';
ctx.beginPath();
ctx.moveTo(vector2.start.x, vector2.start.y);
ctx.lineTo(vector2.end.x, vector2.end.y);
ctx.closePath();
ctx.stroke();
ctx.strokeStyle = 'red';
ctx.beginPath();
ctx.moveTo(vector3.start.x, vector3.start.y);
ctx.lineTo(vector3.end.x, vector3.end.y);
ctx.closePath();
ctx.stroke();
ctx.restore();
