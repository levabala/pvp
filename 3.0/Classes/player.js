function player(nick, position, color, ai){
    //properties
    this.nick = nick;
    this.pos = position;
    this.color = color;
    this.ai = new Worker(ai);
    this.controlled = false;
    this.size = 30;
    this.bodyAngle = 0;
    this.moveV = new Vector(this.pos, this.pos);
    this.speed = 0;
    this.seeDepth = 1000;
    this.velocity = {
        rotateBody: 0.05,
        rotateGun: 0.05,
        acceleration: 0.1,
        braking: 0.05,
        maxSpeed: {
            forward: 8,
            backward: -4
        }
    };
    this.gun = {
        angle: 0.1,
        vector: new Vector(this.pos, new pos(this.pos.x + this.size * 1.5, this.pos.y)),
        seeVector: new Vector(this.pos, null, 0.1, this.seeDepth),
        length: this.size * 1.5,
        points: [
            new pos(this.pos.x, this.pos.y),
            new pos(this.pos.x + this.size * 1.5, this.pos.y),
            new pos(this.pos.x, this.pos.y)
        ]
    };
    this.head = {
        pos: new pos(this.pos.x + Math.cos(this.bodyAngle) * 10, this.pos.y + Math.sin(this.bodyAngle) * 10),
        size: 10,
        type: 'head'
    };
    this.body = new structure('player', this.gun.points, this.pos, this.size, this.color, this.color, 100, [this.head]);

    //check null value
    if (ai == null) this.controlled = true;

    //functions
    this.rotate = function(bodypart, dir){
        if (dir == 'right') {
            if (bodypart == 'body') this.bodyAngle += this.velocity.rotateBody;
            else if (bodypart == 'gun') this.gun.angle += this.velocity.rotateGun;
        }
        else if (dir == 'left') {
            if (bodypart == 'body') this.bodyAngle -= this.velocity.rotateBody;
            else if (bodypart == 'gun') this.gun.angle -= this.velocity.rotateGun;
        }
        if (this.speed >= -this.velocity.braking * 2 && this.speed <= this.velocity.braking * 2) {
            this.moveV = new Vector(this.pos, null, this.bodyAngle, 0);
        }
        else this.moveV = new Vector(this.pos, null, this.bodyAngle, this.speed);
        this.updateGun();
    };

    this.move = function(dir){
        if (dir == 'forward'){
            this.speed += this.velocity.acceleration;
            if (this.speed > this.velocity.maxSpeed.forward) this.speed -= this.velocity.acceleration * 2;
        }
        else if (dir == 'backward'){
            this.speed -= this.velocity.acceleration;
            if (this.speed < this.velocity.maxSpeed.backward) this.speed += this.velocity.acceleration * 2;
        }
        if (this.speed >= -this.velocity.braking * 2 && this.speed <= this.velocity.braking * 2) {
            this.moveV = new Vector(this.pos, null, this.bodyAngle, 0);
        }
        else this.moveV = new Vector(this.pos, null, this.bodyAngle, this.speed);
        this.updateGun();
    };

    this.slowdown = function(){
        if (this.speed > 0) this.speed -= this.velocity.braking;
        else this.speed += this.velocity.braking;
        if (this.speed >= -this.velocity.braking * 2 && this.speed <= this.velocity.braking * 2) {
            this.moveV = new Vector(this.pos, null, this.bodyAngle, 0);
        }
        else this.moveV = new Vector(this.pos, null, this.bodyAngle, this.speed);
    };

    this.radar = function(terrains, ctx){  //ctx is temporary variable
        this.updateGun();
        var res = [];
        for (var i in terrains){
            var terrain = terrains[i];
            res[res.length] = [];
            for (var v in terrain.vectors) {
                var lres = this.gun.seeVector.getCrossing(terrain.vectors[v]);//local result
                res[res.length-1][res[res.length-1].length] = lres;
            }
        }
        return res;
    };

    this.updatePosition = function(){
        if (collisionCheck(terrains, this.body)){
            this.pos.x += this.moveV.dx;
            this.pos.y += this.moveV.dy;
        }
    };

    this.updateGun = function(){
        this.gun.vector = new Vector(this.pos, null, this.gun.angle + this.bodyAngle, this.gun.length);
        this.gun.points = [
            new pos(this.pos.x, this.pos.y),
            new pos(this.pos.x + this.gun.vector.dx, this.pos.y + this.gun.vector.dy)
        ];
        this.gun.seeVector = new Vector(this.pos, null, this.gun.angle + this.bodyAngle, this.seeDepth);
        this.updateBody();
    };

    this.updateBody = function(){
        this.head = {
            pos: new pos(this.pos.x + Math.cos(this.bodyAngle) * 20, this.pos.y + Math.sin(this.bodyAngle) * 20),
            size: 10,
            type: 'head'
        };
        this.body = new structure('player', this.gun.points, this.pos, this.size, this.color, this.color, 100, [this.head]);
    };

    this.getState = function(){
        var res = '';
        res += '--- player \"' + this.nick + '\"' +
            '\n|pos: (' + Math.floor(this.pos.x) + ', ' + Math.floor(this.pos.y) + ')' +
            '\n|speed: ' + this.speed.toFixed(3) +
            '\n|body angle: ' + this.bodyAngle +
            '\n|gun angle: ' + this.gun.angle;
        return res;
    };
}