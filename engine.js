var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var w = canvas.width = 1000;
var h = canvas.height = 800;
var fisab;
var findoff;
var levabala;

var bullets = [];

function initMap(terrains){
	terrains.push({
		type: 'wall',
		pos: [w - 10, 0],
		size: [10, h]
	});
	terrains.push({
		type: 'wall',
		pos: [0, 0],
		size: [10, h]
	});
	terrains.push({
		type: 'wall',
		pos: [0, h - 10],
		size: [w-10, h]
	});
	terrains.push({
		type: 'wall',
		pos: [0, 0],
		size: [w, 10]
	});
	terrains.push({
		type: 'wall',
		pos: [w/3, h/2],
		size: [100, 500]
	});
}

var terrains = [];
var visibleObj = {
	fisab: [],
	findoff: []
};
initMap(terrains);

var tick = 0;
var oldTick = -1;

var velocity = {
	gun: Math.PI/80,
	rotate: Math.PI/200,
	moveForward: 1.5,
	moveBack: 1
};

var allInfo = {
	fisab: {},
	findoff: {}
};

var players = [
	{
		nick: 'fisab',
		gunAngle: 0,
		angle: 0,
		color: '#FF6E19',
		action: [], //действие, которое делает игрок
		pos: [w/2, h/2], //править
		order: 0,
		numbOfAct: 0,
		reload: 20
	},
	{
		nick: 'findoff',
		gunAngle: 0,
		angle: 0,
		color: '#000',
		action: [],
		pos: [w/2, h/2], //править
		order: 0,
		numbOfAct: 0,
		reload: 20
	}
];

var finishedRequest = [];
var rqs = 0;
function init(){
	fisab = new Worker('ii/fisab.js');
	findoff = new Worker('ii/findoff.js');
	fisab.postMessage(players[0]);
	findoff.postMessage(players[1]);
}
init();
fisab.addEventListener('message', function(e) {
	if(players[0].numbOfAct == players[1].numbOfAct){
		players[0].action = e.data.action;
	}
}, false);

findoff.addEventListener('message', function(e) {
	if(players[0].numbOfAct == players[1].numbOfAct){
		players[1].action = e.data.action;
		players[1].radar = e.data.radar;
	}
}, false);


function findObjForRadar(pos, angle, player){
	//ctx.save();
    //ctx.beginPath();
	var x = Math.cos(angle + 0.5*Math.PI);
	var y = Math.sin(angle + 0.5*Math.PI);
    //for(var i = 0; i < w; i++){
	//	ctx.lineTo(x*i+pos[0], y*i+pos[1]);
	//}
	//ctx.stroke();
	//ctx.restore();
	for(var i = 0; i < w; i++){
		for(var terrain of terrains){
			if(	x*i+pos[0] < terrain.pos[0]+terrain.size[0] &&
				x*i+pos[0] > terrain.pos[0] &&
				y*i+pos[1] > terrain.pos[1] &&
				y*i+pos[1] < terrain.pos[1]+terrain.size[1]
			){
				var xD = x*i + pos[0];
				var yD = y*i + pos[1];
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc(xD, yD, 10, 0, Math.PI*2, 0);
				ctx.fill();
				//if(player.nick == 'fisab'){visibleObj.fisab.push({type: terrain.type, pos: [x+i, y+i]});}
				//if(player.nick == 'findoff'){visibleObj.findoff.push({type: terrain.type, pos: [x+i, y+i]})};
				return;
			}
		}
	}
}

function sendAllInfo(){
	if(players[0].numbOfAct == players[1].numbOfAct){
		//for fisab
		allInfo.fisab.mePos = players[0].pos;
		allInfo.fisab.visibleObj = visibleObj.fisab;
		allInfo.fisab.tick = tick;
		fisab.postMessage(allInfo.fisab);
		//for findoff
		allInfo.findoff.mePos = players[1].findoff;
		allInfo.findoff.visibleObj = visibleObj.findoff;
		allInfo.findoff.tick = tick;
		findoff.postMessage(allInfo.findoff);
	}
}

function moveForward(player, vel){
	var dx = -Math.cos(player.angle)*vel;
	var dy = -Math.sin(player.angle)*vel;
	var a = 0;
	for(var terrain of terrains){
		a++;
		var x = player.pos[0];
		var y = player.pos[1];
		var tx = terrain.pos[0];
		var ty = terrain.pos[1];
		var r = 25;
		var txr = terrain.size[0];
		var tyr = terrain.size[1];

		for(var terrain of terrains)
		{
			for (var i = 0; i < w; i++) {

			}
		}

		if( x + r + dx > tx &&
			x - r + dx < tx + txr &&
			y + r + dy > ty &&
			y - r + dy < ty + tyr){
			return;
		}
	}
	player.pos[0] += dx;
	player.pos[1] += dy;
}

var withoutCollisionBot = 0;
function moveBack(player, vel){
	var dx = -Math.cos(player.angle)*vel;
	var dy = -Math.sin(player.angle)*vel;
	var a = 0;
	for(var terrain of terrains){
		a++;
		var x = player.pos[0];
		var y = player.pos[1];
		var tx = terrain.pos[0];
		var ty = terrain.pos[1];
		var r = 25;
		var txr = terrain.size[0];
		var tyr = terrain.size[1];
		if( x + r - dx > tx &&
			x - r - dx < tx + txr &&
			y + r - dy > ty &&
			y - r - dy < ty + tyr){
			return;
		}
	}
	player.pos[0] -= dx;
	player.pos[1] -= dy;
}

function rotateGun(direction, player){
	switch(direction){
		case 'right':
			player.gunAngle += velocity.gun;
		break;
		case 'left':
			player.gunAngle -= velocity.gun;
		break;
	}
}

function checkTicks(player){
	if(players[0] == player){
		if(player.numbOfAct < players[1].numbOfAct){
			return true;
		}
		else{
			return false;
		}
	}
	else if(player.numbOfAct < players[0].numbOfAct){
		return true;
	}
	else{
		return false;
	}
}

function rotateBody(side, player){
	switch(side){
		case 'right':
			player.angle += velocity.rotate;
		break;
		case 'left':
			player.angle -= velocity.rotate;
		break;
	}
}

function shoot(player){
	player.reload --;
	if (player.reload <= 0) {
		bullets[bullets.length] = new bullet(player);
		player.reload = 20;
	}
}

function processAction(){//раскладывает по полкам все запросы аи и начинает их выполнение
	/*
	velocity
		gun: Math.PI/80,
		rotate: Math.PI/200,
		moveForward: 1.5,
		moveBack: 1
	*/
	for(var player of players){
		//var can = checkTicks(player);
		var can = true;
		if(can && player.action){
			for(var act of player.action){
				for(var rq of finishedRequest){
					if(rq != act){rqs++;}
				}
				//if(player.action && rqs == player.action.length){
					finishedRequest.push(act);
					rqs = 0;
					for(var i of act){
						if(i == ':'){
							act = act.split(':');
							break;
						}
					}
					if(typeof (act) == 'string'){
						act = [act];
					}
					switch(act[0]){
						case 'rotateRightBody':
							rotateBody('right', player);
							player.order++;
						break;
						case 'rotateLeftBody':
							rotateBody('left', player);
							player.order++;
						break;
						case 'rotateRightGun':
							rotateGun('right', player);
							player.order++;
						break;
						case 'rotateLeftGun':
							rotateGun('left', player);
							player.order++;
						break;
						case 'moveForward':
							if(act[1] > velocity.moveForward){act[1] = velocity.moveForward}
							else if(act[1] < 0){act[1] = 0;}
							moveForward(player, act[1]);
							player.order++;
						break;
						case 'moveBack':
							if(act[1] > velocity.moveForward){act[1] = velocity.moveForward}
							else if(act[1] < 0){act[1] = 0;}
							moveBack(player, act[1]);
							player.order++;
						break;
						case 'shoot':
							shoot(player);
							player.order++;
						break;
					}
				//}
			}
		}
		player.numbOfAct++;
		player.action = ['finish'];
	}
	finishedRequest = [];
}

function process(){
	//for(var player of players){
		var player = players[0];
		findObjForRadar(player.pos, player.gunAngle, player);
		//radar(player.pos, player.gunAngle, player);
	//}
	for(var bullet of bullets){
		bullet.bulletProcess();
		if(bullet.lifetime <= 0 || !bullet.checkCollision(terrains)) {
			bullets.splice(bullet, 1);
		}	
	}
	processAction();
	sendAllInfo();
}

function render(){
	ctx.clearRect(0,0, w,h);
	for (var bullet of bullets){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = bullet.owner.color;
		ctx.translate(bullet.pos.x, bullet.pos.y);
		ctx.rotate(bullet.angle);
		ctx.fillRect(0,0, 6, 20);
		ctx.fill();
		ctx.restore();
	}
	for(var terrain of terrains){
		//if(terrain.type == 'wall'){
			ctx.beginPath();
	        ctx.fillStyle = '#000';
			ctx.fillRect(terrain.pos[0], terrain.pos[1], terrain.size[0], terrain.size[1]);
	        ctx.fill();
		//}
	}

	for(var player of players){
		//player = players[0];

	    ctx.save();
	    ctx.beginPath();
	    ctx.strokeStyle = '#4C3324';
	    ctx.lineWidth = 25;
	    ctx.translate(player.pos[0], player.pos[1]);
	    ctx.rotate(player.angle);
	    ctx.moveTo(0,0);
	    ctx.lineTo(-24, 0);
	    ctx.stroke();
	    ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.strokeStyle = player.color;
		ctx.arc(player.pos[0], player.pos[1], 25, 0, 2*Math.PI, false);
	    ctx.stroke();
	    ctx.restore();

	    ctx.save();
	    ctx.beginPath();
	    ctx.fillStyle = player.color;
	    ctx.arc(player.pos[0], player.pos[1], 15, 0, Math.PI*2, 0);
	    ctx.fill();
	    ctx.restore();

	    ctx.save();
	    ctx.beginPath();
	    ctx.fillStyle = player.color;
	    ctx.translate(player.pos[0], player.pos[1]);
	    ctx.rotate(player.gunAngle);
		ctx.lineTo(-5, 0);
		ctx.lineTo(-5, 45);
		ctx.lineTo(5, 45);
		ctx.lineTo(5, 0);
		ctx.lineTo(0, 0);
		ctx.fill();
	    ctx.restore();

	}
}

function loop(){
	render();
	process();
}

setInterval(function(){loop();}, 16);
