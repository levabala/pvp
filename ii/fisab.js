addEventListener('message', function(e) {
	console.log(e.data);
}, false);

function loop(){
	postMessage({action: ['moveForward','rotateRightGun', 'rotateRightBody']});
}

setInterval(function(){loop();}, 16);