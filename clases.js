function bullet(player){
    this.power = 10;
    this.angle = player.gunAngle;
    this.owner = {nick: player.nick, color: player.color};
    this.pos = {
    	x: player.pos[0] + Math.cos(this.angle + 0.5*Math.PI) * 25, 
    	y: player.pos[1] + Math.sin(this.angle + 0.5*Math.PI) * 25
    };
    this.lifetime = 1000;
    this.bulletProcess = function(){
        this.lifetime --;
        this.pos.x += Math.cos(this.angle + 0.5*Math.PI) * this.power;
        this.pos.y += Math.sin(this.angle + 0.5*Math.PI) * this.power;
    };

    this.checkCollision = function(terrains){
        for(var terrain of terrains){
            if(checkCollision(this.pos.x, this.pos.y, terrain)){
            	return false;
            }
        }
        return true;
    };
}

function checkCollision(x,y, terrain){
	if(	x > terrain.pos[0] &&
	    x < terrain.pos[0] + terrain.size[0] &&
	    y > terrain.pos[1] &&
	    y < terrain.pos[1] + terrain.size[1]){
			return true;
	}
    return false;
}
