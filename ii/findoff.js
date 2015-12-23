addEventListener('message', function(e) {
	//console.log(e.data);
}, false);

function loop(){
	postMessage({action: ['moveForward','rotateLeftGun', 'rotateRightBody']});
}

setInterval(function(){loop();}, 16);
