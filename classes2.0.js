function player(nick, x, y, ai, color){
    this.nick = nick;
    this.pos = {x:x, y:y};
    this.reloadTime = 60;
    this.reload = this.reloadTime;
    this.bodyAngle = 0;
    this.size = 30;
    this.gunLength = this.size * 2;
    this.gun = new Vector(this.pos, null, 0, this.gunLength);
    this.hp = 10;
    this.inbullets = [];
    this.AI = new Worker(ai);
    this.visibleObj = [];
    this.color = color;
    this.bodyColor = color;
    this.gunColor = color;
    this.headColor = color;
    this.velocity = {
        gun: Math.PI/200,
        rotate: Math.PI/100,
        moveForward: 2.5,
        moveBack: 1.5
    };
    this.moveV = new Vector(this.pos, this.pos, this.bodyAngle, 0);

    this.defineYou = function(){
        console.info('I am ' + nick + '\n');
        for (var inf in this){
            if (typeof this[inf] != 'function') console.log(inf + ' : ' + this[inf] + '\n');
            else console.log(inf + ' : function(){...}' + '\n');
        }
    };

    this.shoot = function(){
        if (this.reload <= 0) {
            this.reload = this.reloadTime;
            return new bullet(this);
        }
        return false;
    };
    this.checkCollision = function(x, y, terrains, players, dir){
        var dx = this.moveV.dx;
        var dy = this.moveV.dy;
        if(dir == 'backward'){
            dx*=-1;
            dy*=-1;
        }
        for(var terrain of terrains){
            var tx = terrain.x;
            var ty = terrain.y;
            var tyr = terrain.sizeY;
            var txr = terrain.sizeX;
            if( x + this.size + dx > tx &&
                x - this.size + dx < tx + txr &&
                y + this.size + dy > ty &&
                y - this.size + dy < ty + tyr){
                return false;
            }
        }

        for(var player in players){
            var pla = players[player];
            if (pla != this) {
                var tx = pla.pos.x;
                var ty = pla.pos.y;
                var tyr = pla.size;
                var txr = pla.size;
                if (x + this.size + dx > tx - this.size &&
                    x - this.size + dx < tx + this.size &&
                    y + this.size + dy > ty - this.size &&
                    y - this.size + dy < ty + this.size) {
                    return false;
                }
            }
        }



        return true;
    };

    this.drawYou = function(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.headColor;
        ctx.arc(this.pos.x, this.pos.y, this.size/1.5, 0, 2*Math.PI, 0);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.bodyAngle);
        ctx.fillStyle = convertHex(this.headColor, 50);
        ctx.arc(this.size/1.5, 0, this.size/2.5, 0, 2*Math.PI, 0);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = this.gunColor;
        ctx.beginPath();
        ctx.lineWidth = 8;
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + this.gun.dx, this.pos.y + this.gun.dy);
        ctx.stroke();
        ctx.restore();

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI, false);
        ctx.stroke();

    };

    this.move = function(dir){
        if (dir == 'forward'){
            this.moveV = new Vector(this.pos, null, this.bodyAngle, this.velocity.moveForward);
            if (!this.checkCollision(this.pos.x, this.pos.y, terrains, players, 'forward')) return;
            this.pos.x += this.moveV.dx;
            this.pos.y += this.moveV.dy;
        }
        else if (dir == 'backward'){
            this.moveV = new Vector(this.pos, null, this.bodyAngle, this.velocity.moveForward);
            if (!this.checkCollision(this.pos.x, this.pos.y, terrains, players, 'backward')) return;
            this.pos.x -= Math.cos(this.bodyAngle)*this.velocity.moveBack;
            this.pos.y -= Math.sin(this.bodyAngle)*this.velocity.moveBack;
        }
    };

    this.rotate = function(dir, bodypart){
        if (dir == 'left'){
            if(bodypart == 'body'){
                this.bodyAngle -= this.velocity.rotate;
                this.gun.angle -= this.velocity.rotate;
            }
            else this.gun = new Vector(this.pos, null, this.gun.angle - this.velocity.gun, this.gunLength);
        }
        else if (dir == 'right'){
            if(bodypart == 'body'){
                this.bodyAngle += this.velocity.rotate;
                this.gun.angle += this.velocity.rotate;
            }
            else this.gun = new Vector(this.pos, null, this.gun.angle + this.velocity.gun, this.gunLength);
        }
    };
}

function structure(type, x, y, sizeX, sizeY, colorL, colorF, hits, lineWidth){
    this.type = type;
    this.lineColor = colorL;
    if (lineWidth) this.lineWidth = lineWidth;
    else this.lineWidth = 3;
    if (colorF != null) this.fillColor = colorF;
    else this.colorF = 'white';
    if (hits) this.hits = hits;
    else this.hits = 100000;
    if (type == 'wall'){
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }
    this.drawYou = function(ctx){
        if(!this.fillColor){ctx.fillStyle = this.lineColor;}
        ctx.strokeStyle = this.lineColor;
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(x + sizeX, y);
        ctx.lineTo(x + sizeX, y + sizeY);
        ctx.lineTo(x, y + sizeY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
}

function bullet(player){
    this.power = 10;
    this.exploded = false;
    this.inplayer = false;
    this.angle = player.gun.angle;
    this.owner = {nick: player.nick, color: player.color};
    this.pos = {
        x: player.pos.x + Math.cos(this.angle) * 25,
        y: player.pos.y + Math.sin(this.angle) * 25
    };
    this.lifetime = 20;
    this.bulletProcess = function(){
        this.lifetime--;
        if (!this.exploded && !this.inplayer){
            this.pos.x += Math.cos(this.angle) * this.power;
            this.pos.y += Math.sin(this.angle) * this.power;
        }
    };

    this.checkCollision = function(terrains, players){
        for(var terrain in terrains){
            var ter = terrains[terrain];
            if(checkCollision(this.pos.x, this.pos.y, ter)){
                this.exploded = true;
                return false;
            }
        }
        for(var player in players){
            var pla = players[player];
            if(pla.nick != this.owner.nick) {
                if(checkCollision(this.pos.x, this.pos.y, pla)) {
                    this.inplayer = true;
                    this.prey = pla;
                    console.log('hem');
                    return pla;
                }
            }
        }
        return true;
    };

    this.drawYou = function(ctx){
        ctx.save();
        ctx.beginPath();
        if (!this.exploded) ctx.fillStyle = this.owner.color; else ctx.fillStyle = convertHex(this.owner.color, 75);
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle - Math.PI / 2);
        ctx.fillRect(0,0, 6, 20);
        ctx.lineWidth = 1;
        ctx.restore();
    };
}

function checkCollision(x,y, terrain){
    var sizeX = terrain.sizeX;
    var sizeY = terrain.sizeY;
    if(sizeX == null){
        sizeX = terrain.size;
        sizeY = terrain.size;
        if (x > terrain.x - sizeX &&
            x < terrain.x + sizeX &&
            y > terrain.y - sizeY &&
            y < terrain.y + sizeY) {
            return true;
        }
        /*
                    x > tx - this.size &&
                    x < tx + this.size &&
                    y > ty - this.size &&
                    y < ty + this.size
        */
    }
    else {
        if (x > terrain.x  &&
            x < terrain.x + sizeX &&
            y > terrain.y &&
            y < terrain.y + sizeY) {
            return true;
        }
    }
    return false;
}

function getRandomColor(){
    return ("#"+((1<<24)*Math.random()|0).toString(16));
}

function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

function Vector(start, end, angle, length){
    if (start && end) this.dx = end.x - start.x;
    else this.dx = Math.cos(angle) * length;
    if (end && start) this.dy = end.y - start.y;
    else this.dy = Math.sin(angle) * length;
    if (length) this.length = length;
    else this.length = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    if (angle != 'undefined') this.angle = angle;
    //else this.angle = ...
}
