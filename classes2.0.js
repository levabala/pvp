function player(nick, x, y, ai, color){
    this.nick = nick;
    this.pos = {x:x, y:y};
    this.reloadTime = 14;
    this.reload = this.reloadTime;
    this.bodyAngle = 0;
    this.size = 30;
    this.gunLength = this.size * 2;
    this.gun = new Vector(this.pos, null, 0, this.gunLength);
    this.hp = 2;
    this.inbullets = [];
    this.AI = new Worker(ai);
    this.visibleObj = [];
    this.color = color;
    this.bodyColor = convertHex(color, 100);
    this.gunColor = color;
    this.headColor = color;
    this.wherePush = [];
    this.velocity = {
        gun: Math.PI/50,
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
        ctx.fillStyle = this.headColor, 50;
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

    this.checkCollision = function(x, y, terrains, players, dir, deadPlayers){
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
            if(pla != this){
                var tx = pla.pos.x;
                var ty = pla.pos.y;
                var tyr = pla.size;
                var txr = pla.size;
                if (x + this.size/1.2 + dx > tx - this.size &&
                    x - this.size/1.2 + dx < tx + this.size &&
                    y + this.size/1.2 + dy > ty - this.size &&
                    y - this.size/1.2 + dy < ty + this.size) {
                    this.pushh(players, deadPlayers, terrains);
                    return false;
                }
            }
        }



        return true;
    };

    this.pushh = function(players, deadPlayers, terrains){
        /*
        x + this.size + dx > tx - this.size &&
        x - this.size + dx < tx + this.size &&
        y + this.size + dy > ty - this.size &&
        y - this.size + dy < ty + this.size) {
        */
        dx = this.moveV.dx;
        dy = this.moveV.dy;
        for(var player in players){
            var pla = players[player];
            if(pla != this){
                if( this.pos.x + this.size > pla.pos.x - pla.size &&
                    this.pos.x - this.size < pla.pos.x + pla.size &&
                    this.pos.y + this.size > pla.pos.y - pla.size &&
                    this.pos.y - this.size < pla.pos.y + pla.size
                ){
                    var dxS = pla.moveV.dx;
                    var dyS = pla.moveV.dy;
                    for(var terrain of terrains){
                        var x = pla.pos.x;
                        var y = pla.pos.y;
                        var tx = terrain.x;
                        var ty = terrain.y;
                        var tyr = terrain.sizeY;
                        var txr = terrain.sizeX;
                        if( x + pla.size + dx > tx &&
                            x - pla.size + dx < tx + txr &&
                            y + pla.size + dy > ty &&
                            y - pla.size + dy < ty + tyr){
                            return;
                        }
                    }
                    var dxM = (dx+dxS)/2;
                    var dyM = (dy+dyS)/2;
                    pla.pos.x+=dxM/2;
                    pla.pos.y+=dyM/2;
                } 
            }
        }
        if(deadPlayers){
            for(var dPla of deadPlayers){
                if( this.pos.x+this.size > dPla.pos.x - dPla.size &&
                    this.pos.x-this.size < dPla.pos.x + dPla.size &&
                    this.pos.y+this.size > dPla.pos.y - dPla.size &&
                    this.pos.y-this.size < dPla.pos.y + dPla.size
                ){
                    dPla.pos.x+=dx/2;
                    dPla.pos.y+=dy/2;
                }
            }
        }
    };

    this.move = function(dir, players, deadPlayers){
        var dx = 0;
        var dy = 0;

        if(dir == 'forward'){
            this.moveV = new Vector(this.pos, null, this.bodyAngle, this.velocity.moveForward);
            if(!this.checkCollision(this.pos.x, this.pos.y, terrains, players, 'forward', deadPlayers)) return;
            dx = this.moveV.dx;
            dy = this.moveV.dy;
        }
        else if(dir == 'backward'){
            this.moveV = new Vector(this.pos, null, this.bodyAngle, this.velocity.moveBack);
            if(!this.checkCollision(this.pos.x, this.pos.y, terrains, players, 'backward', deadPlayers)) return;
            dx = -this.moveV.dx;
            dy = -this.moveV.dy;
        }

        this.pos.x += dx;
        this.pos.y += dy;

        for(var i = 0; i < this.inbullets.length; i++){
            var bul = this.inbullets[i];
            bul.pos.x += dx;
            bul.pos.y += dy;
            //bul.angle
        }
    };

    this.rotate = function(dir, bodypart){
        if(dir == 'left'){
            if(bodypart == 'body'){
                this.bodyAngle -= this.velocity.rotate;
                this.gun = new Vector(this.pos, null, this.gun.angle - this.velocity.rotate, this.gunLength);
            }
            else this.gun = new Vector(this.pos, null, this.gun.angle - this.velocity.gun, this.gunLength);
        }
        else if(dir == 'right'){
            if(bodypart == 'body'){
                this.bodyAngle += this.velocity.rotate;
                this.gun = new Vector(this.pos, null, this.gun.angle + this.velocity.rotate, this.gunLength);
            }
            else this.gun = new Vector(this.pos, null, this.gun.angle + this.velocity.gun, this.gunLength);
        }
    };

    this.radar = function(terrains, ctx){
        for(var terrain in terrains){
            var ter = terrains[terrain];
            var lines = [];
            var KandB = [];
            var sL = {x1: this.pos.x, y1: this.pos.y, x2: this.pos.x + this.gun.dx * 10, y2: this.pos.y + this.gun.dy * 10};
            if (ter.type == 'wall'){
                lines[lines.length] = {x1: ter.x, y1: ter.y, x2: ter.x + ter.sizeX, y2: ter.y};
                lines[lines.length] = {x1: ter.x + ter.sizeX, y1: ter.y, x2: ter.x + ter.sizeX, y2: ter.y + ter.sizeY};
                lines[lines.length] = {x1: ter.x + ter.sizeX, y1: ter.y + ter.sizeY, x2: ter.x, y2: ter.y + ter.sizeY};
                lines[lines.length] = {x1: ter.x, y1: ter.y + ter.sizeY, x2: ter.x, y2: ter.y};
            }

            KandB[0] = getKandB(sL);

            /*ctx.fillStyle = 'red';
            ctx.strokeStyle = 'lightgreen';
            ctx.lineWidth = 6;
            ctx.save();
            for (var i in lines){
                var line = lines[i];
                var kb = getKandB(line);
                KandB[KandB.length] = kb;
                var pos = getCrossing(KandB[0],KandB[1]);
                ctx.fillStyle = 'green';
                ctx.beginPath();
                for (var a = 0; a < 1000; a+= 10){
                    ctx.arc(a, a * kb.k + kb.b, 10, 0, Math.PI * 2, false);
                }
                ctx.closePath();
                ctx.fill();
                
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.moveTo(line.x1, line.y1);
                ctx.lineTo(line.x2, line.y2);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fill();
            }
            ctx.beginPath();
            ctx.moveTo(sL.x1, sL.y1);
            ctx.lineTo(sL.x2, sL.y2);
            ctx.closePath();
            //ctx.fill();
            ctx.stroke();
            ctx.restore();*/

        }
    }
}

function deadPlayer(nick, x, y, angle, color){
    this.nick = nick;
    this.pos = {x:x, y:y};
    this.bodyAngle = angle;
    this.size = 30;
    this.gunLength = this.size * 2;
    this.gun = new Vector(this.pos, null, 0, this.gunLength);
    this.inbullets = [];
    this.color = color;
    this.drawYou = function(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = convertHex(this.color, 30);
        ctx.arc(this.pos.x, this.pos.y, this.size/1.5, 0, 2*Math.PI, 0);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.bodyAngle);
        ctx.fillStyle = convertHex(this.color, 30);
        ctx.arc(this.size/1.5, 0, this.size/2.5, 0, 2*Math.PI, 0);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = convertHex(this.color, 30);
        ctx.beginPath();
        ctx.lineWidth = 8;
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + this.gun.dx, this.pos.y + this.gun.dy);
        ctx.stroke();
        ctx.restore();

        ctx.beginPath();
        ctx.strokeStyle = convertHex(this.color, 30);
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI, false);
        ctx.stroke();
    }
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
    this.owner = {nick: player.nick, color: player.color, angle: 0};
    this.pos = {
        x: player.pos.x + Math.cos(this.angle) * player.gun.length,
        y: player.pos.y + Math.sin(this.angle) * player.gun.length
    };
    this.lifetime = 20;
    this.bulletProcess = function(){
        if (!this.exploded && !this.inplayer){
            this.pos.x += Math.cos(this.angle) * this.power;
            this.pos.y += Math.sin(this.angle) * this.power;
        }
        if (!this.inplayer) this.lifetime--;
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
                    pla.hp-=1;
                    pla.inbullets[pla.inbullets.length] = this;
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
    if(terrain.nick != null){
        sizeX = terrain.size;
        sizeY = terrain.size;
        if (x > terrain.pos.x - sizeX &&
            x < terrain.pos.x + sizeX &&
            y > terrain.pos.y - sizeY &&
            y < terrain.pos.y + sizeY) {
            return true;
        }
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

function getKandB(line){
    //уравнение любой прямой
    //хз как...  спустя 10 минут: уже не хз :)     //на нормальном математическом языке:
    /*
     y1, y2, x1, x2 - известны
     y1 = k * x1 + b
     b = y1 - k * x1

     y2 = k * x2 + y1 - k * x1
     k * (x2 - x1) + y1 = y2
     k =  (y2 - y1) / (x2 - x1)    //k is defined!!!
     b = y1 - x1 * k       //b is defined!!!
     */


    var k = (line.y2 - line.y1) / (line.x2 - line.x1);
    var b = line.y1 - line.x1 * k;

    var res = {k: k, b: b};

    return res;
}

function getCrossing(kb1, kb2){
    //находим точку пересечения
    /*
     y = k1 * x + b1  //наша системка
     y = k2 * x + b2

     k1 * x + b1 = k2 * x + b2
     k1 * x - k2 * x = b2 - b1
     x * (k1 - k2) = b2 - b1
     x = (b2 - b1) / (k1 - k2)       //x is defined
     y = k1 * x + b1                 //y is defined
     */

    var x = 0;
    var y = 0;

    x = (kb2.b - kb1.b) / (kb1.k - kb2.k);
    y = kb1.k * x + kb1.b;

    var pos = {x: x, y: y};
    return pos;
}
