function player(nick, p, color, ai){
    //log function
    this.log = function(param){
        console.log(param + ': ' + this[param]);
    };

    //input values
    this.nick = nick;
    this.pos = p;
    this.colorS = color;
    this.colorF = color;
    this.ai = new Worker(ai);

    //local values
    this.seeDepth = 1000;
    this.size = 25;
    this.gunRotateSpeed = 0.02;

    this.physicObject = new physicObject(this.pos, 'cylinder', false, 0.0001, {x: this.size, y: this.size, z: 1},
        {acceleration: 0.05, rotateSpeed: 0.03, maxSpeed: {forward: 1.0, backward: -0.5}, speed: 0, braking: 0.025}, 0.0001, -0.3);
    this.commands = {
        moving: {acc: 0}, //direction and acceleration
        rotating: {bodypart: null, speed: 0}, //body part for rotate and speed of rotating
        shooting: {shoot: false} //shoot? YES!!!
    };

    this.bodyparts = {
        gun: {
            vector: new Vector(this.pos, new pos(this.pos.x + this.size * 1.5, this.pos.y)),
            realVector: new Vector(this.pos, new pos(this.pos.x + this.size * 1.5, this.pos.y)),
            seeVector: new Vector(this.pos, null, 0.1, this.seeDepth),
            length: this.size * 1.5,
            points: [
                new pos(this.pos.x, this.pos.y),
                new pos(this.pos.x + this.size * 1.5, this.pos.y)
            ],
            shaded: false,
            lineWidth: 10
        },
        tower: {
            circle: new circle(this.pos, this.size / 2),
            angle: 0,
            shaded: true
        },
        body: {
            circle: new circle(this.pos, this.size),
            angle: 0,
            shaded: false
        }
    };

    //defining myself
    console.group(this.nick);
    console.log(this.physicObject);
    console.groupEnd();


    //check null value
    if (ai == null) this.controlled = true;

    //functions
    this.tick = function(){ //one tick of the player's life
        var com = this.commands;
        if (com.moving != {}){  //do move command
            if (com.moving.acc > 0) {
                this.physicObject.accelerate();
            }
            if (com.moving.acc < 0) {
                this.physicObject.brake();
            }
        }
        if (com.rotating != {}){  //do rotate command
            if (com.rotating.bodypart == 'body') {
                if (com.rotating.speed < 0) this.physicObject.toLeft();
                if (com.rotating.speed > 0) this.physicObject.toRight();
            }
            else if (com.rotating.bodypart == 'gun') {
                if (com.rotating.speed < 0) this.bodyparts.gun.vector.angle -= this.gunRotateSpeed;
                if (com.rotating.speed > 0) this.bodyparts.gun.vector.angle += this.gunRotateSpeed;
            }
        }
        if (com.shooting != {}){  //SHOOT!

        }

        //reset the commands list
        this.commands = {
            moving: {acc: 0},
            rotating: {bodypart: null, speed: 0},
            shooting: {shoot: false}
        };

        //check the area with physicObject.js script
        this.physicObject.tick();

        //syncing properties of body and physicObject
        this.pos = this.physicObject.pos;
        this.bodyparts.body.angle = this.physicObject.angle;

        //update bodyparts
        this.updateGun();
    };

    //setting current command
    this.command = function(input){
        this.commands[input.type] = input.command;
    };


    //update the gun (it's properties)
    this.updateGun = function(){
        this.bodyparts.gun.realVector = new Vector(this.pos, null, this.bodyparts.gun.vector.angle + this.bodyparts.body.angle, this.bodyparts.gun.length);
        this.bodyparts.gun.seeVector = new Vector(this.pos, null, this.bodyparts.gun.vector.angle, this.seeDepth);
        this.bodyparts.gun.vector = new Vector(this.pos, null, this.bodyparts.gun.vector.angle, this.bodyparts.gun.length);

        this.bodyparts.gun.points = [
            new pos(this.pos.x, this.pos.y),
            new pos(this.pos.x + this.bodyparts.gun.realVector.dx, this.pos.y + this.bodyparts.gun.realVector.dy)
        ];
    };
}