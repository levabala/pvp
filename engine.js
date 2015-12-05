var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var w = canvas.width = 1000;
var h = canvas.height = 800;
var fisab;
var findoff;

function initMap(terrains){
	terrains.push({
		type: 'wall',
		pos: [w, 0],
		size: [10, h]
	});
	terrains.push({
		type: 'wall',
		pos: [0, 0],
		size: [10, h]
	});
	terrains.push({
		type: 'wall',
		pos: [0, h],
		size: [w, 10]
	});
	terrains.push({
		type: 'wall',
		pos: [0, 0],
		size: [w, 0]
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
	gun: Math.PI/70,
	rotate: Math.PI/200,
	drive: 0.5
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
		numbOfAct: 0
	},
	{
		nick: 'findoff',
		gunAngle: 0,
		angle: 0,
		color: '#000',
		action: [],
		pos: [w/2, h/2], //править
		order: 0,
		numbOfAct: 0
	}
];

var finishedRequest = [];
var rqs = 0;
function init(){
	fisab = new Worker('ii/fisab.js');
	//var findoff = new Worker('ai/findoff.js');
	fisab.postMessage(players[0]);
	//findoff.postMessage(players[1]);
}
init();
fisab.addEventListener('message', function(e) {
	if(players[0].numbOfAct == players[1].numbOfAct){
		players[0].action = e.data.action;
	}
}, false);
/*
findoff.addEventListener('message', function(e) {
	if(players[0].numbOfAct == players[1].numbOfAct){
		players[1].action = e.data.action;
		players[1].radar = e.data.radar;
	}
}, false);
*/

function findObjForRadar(pos, angle, player){
	for(var terrain of terrains){
		for(var i = 0; i < w; i++){
			var x = Math.cos(angle);
			var y = Math.sin(angle);
			if(x+i == terrain.pos[0] && y+i == terrain.pos[1]){
				var xD = x+i - terrain.pos[0];
				var yD = y+i - terrain.pos[1];
				var range = Math.sqrt(xD*xD+yD*yD);
				if(player == 'fisab'){visibleObj.fisab.push({type: terrain.type, pos: [x+i, y+i], range: range});}
				if(player == 'findoff'){visibleObj.fisab.push({type: terrain.type, pos: [x+i, y+i], range: range})};
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
		//findoff.postMessage(allInfo.findoff);
	}
}

var withoutCollisionTop = 0;
function moveForward(player){
	for(var terrain of terrains){
		if(	(player.pos[0]-25 > terrain.pos[0]+terrain.size[0]) ||
			player.pos[0]+25 < terrain.pos[0] &&
			player.pos[1]+25 > terrain.pos[1]+terrain.size[1] ||
			player.pos[1]-25 < terrain.pos[1]
			){
			withoutCollisionTop++;
		}
	}
	if(withoutCollisionTop == terrains.length){
		withoutCollisionTop = 0;
		player.pos[0] -= Math.cos(player.angle)*velocity.drive;
		player.pos[1] -= Math.sin(player.angle)*velocity.drive;
	}
}

var withoutCollisionBot = 0;
function moveBack(player){
	for(var terrain of terrains){
		if(	Math.sin(player.angle+Math.PI)*velocity.drive > terrain.pos[1] &&
			Math.sin(player.angle+Math.PI)*velocity.drive < terrain.pos[1] &&
			Math.cos(player.angle+Math.PI)*velocity.drive > terrain.pos[0] &&
			Math.cos(player.angle+Math.PI)*velocity.drive < terrain.pos[0]){
			withoutCollisionBot++;
		}
	}
	//if(withoutCollisionBot == terrains.length){
		withoutCollisionBot = 0;
		player.pos[0] += Math.cos(player.angle)*velocity.drive;
		player.pos[1] += Math.sin(player.angle)*velocity.drive;
	//}
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

}

function processAction(){//раскладывает по полкам все запросы аи и начинает их выполнение
	/*
	velocity
		gun - Math.PI/8,
		rotate - Math.PI/10,
		drive - 0.5
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
					switch(act){
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
							moveForward(player);
							player.order++;
						break;
						case 'moveBack':
							moveBack(player);
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
	for(var player of players){
		findObjForRadar(player.pos, player.angle, player);
	}
	processAction();
	sendAllInfo();
}

function render(){
	ctx.clearRect(0,0, w,h);
	for(var terrain of terrains){
		if(terrain.type == 'wall'){
			ctx.beginPath();
	        ctx.fillStyle = '#000';
	        ctx.strokeRect(terrain.pos[0], terrain.pos[1], terrain.size[0], terrain.size[1]);
	        ctx.fill();
		}
	}

	//for(var player of players){
		player = players[0];

	    ctx.save();
	    ctx.beginPath();
	    ctx.strokeStyle = '#4C3324';
	    ctx.lineWidth = 25;
	    ctx.translate(player.pos[0], player.pos[1]);
	    ctx.rotate(player.angle);
	    ctx.moveTo(0,0);
	    ctx.lineTo(-25, 0);
	    ctx.stroke();
	    ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.strokeStyle = player.color;
	    ctx.translate(player.pos[0], player.pos[1]);
	    ctx.rotate(player.angle);
	    ctx.strokeRect(-25,-25,50,50);
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
		ctx.lineTo(-5, 35);
		ctx.lineTo(5, 35);
		ctx.lineTo(5, 0);
		ctx.lineTo(0, 0);
	    ctx.fill();
	    ctx.restore();
	//}
}

function loop(){
	process();
	render();
}

setInterval(function(){loop();}, 16);
