addEventListener('message', function(e) {
	//console.log(e.data);
}, false);

function loop(){
	postMessage({action: ['moveBack','rotateRightGun', 'rotateRightBody']});
}

setInterval(function(){loop();}, 16);
