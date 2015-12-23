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

    this.speed = 0;
    this.height = 2;
    this.density = 1;
    this.size = 30;
    this.volume = Math.PI * this.size ^ 2 * this.height;
    this.mass = this.volume * this.density;
    this.frictionCoeff = 0.1;

    var power = 100;
    this.engine = {
        power: power,
        acceleration: power / this.mass,
        rotateSpeed: 0.025,
        maxSpeed: {
            forward: power * 0.4,
            backward: -power * 0.4
        }
    };

    this.gunRotateSpeed = 0.25;
    this.braking = 0;

    this.commands = {
        moving: {acc: 0}, //direction and acceleration
        rotating: {bodypart: null, speed: 0}, //body part for rotate and speed of rotating
        shooting: {shoot: false} //shoot? YES!!!
    };
    this.vectors = {
        moveV: new Vector(this.pos, this.pos),  //main moving vector
        thrustvector: new Vector(this.pos, this.pos),  //a vector of our machine force
        extVectors: [] //external vectors (external force from other objects)
    };

    //defining myself
    console.group(this.nick);
    this.log('colorF');
    this.log('size');
    this.log('volume');
    this.log('mass');
    console.log(this.engine.acceleration);
    console.groupEnd();

    this.bodyparts = {
        gun: {
            vector: new Vector(this.pos, new pos(this.pos.x + this.size * 1.5, this.pos.y)),
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


    //check null value
    if (ai == null) this.controlled = true;

    //functions
    this.tick = function(){ //one tick of the player's life
        var com = this.commands;
        if (com.moving != {}){  //do move command
            if (com.moving.acc == 'const') com.moving.acc = this.engine.acceleration;
            if (com.moving.acc == '-const') com.moving.acc = -this.engine.acceleration;
            this.accelerate(com.moving.acc);
        }
        if (com.rotating!= {}){  //do rotate command

        }
        if (com.shooting != {}){  //SHOOT!

        }

        this.commands = {  //reset the commands list
            moving: {dir: null, acc: 0},
            rotating: {bodypart: null, speed: 0},
            shooting: {shoot: false}
        };

        this.updateVectors();
        this.move();
        this.updateGun();
    };

    this.command = function(input){ //setting current command
        this.commands[input.type] = input.command;
    };

    this.updateVectors = function(){
        this.vectors.moveV = this.vectors.thrustvector;
        for(var ev in this.vectors.extVectors){
            var eVector = this.vectors.extVectors[ev];
            /*console.log('---');
            console.log('external vector: ' + eVector.length);
            console.log('move vector: ' + this.moveV.length);*/
            this.vectors.moveV = this.vectors.moveV.sumWith(eVector);
            /*console.log('result vector: ' + this.moveV.length);
            console.log('---');*/
        }

        //braking the player
        this.braking = this.frictionCoeff * this.vectors.moveV.length;
        var brakingV = new Vector(this.pos, null, this.vectors.moveV.angle, -this.braking);
        if (brakingV.length != null) {
            //this.vectors.moveV = this.vectors.moveV.sumWith(brakingV);
            console.log('braking: ' + this.braking);
            console.log(this.vectors.thrustvector.length);
            this.vectors.thrustvector = this.vectors.thrustvector.sumWith(brakingV);
            console.log(this.vectors.thrustvector.length);
        }

        this.vectors.moveV = new Vector(this.pos, null, this.vectors.moveV.angle, this.vectors.moveV.length);
    };

    this.accelerate = function(acc){
        //checking out exceeding maximum acceleration
        if (acc > this.engine.acceleration) acc = this.engine.acceleration;
        else if (acc < -this.engine.acceleration) acc = -this.engine.acceleration;

        //checking out exceeding maximum speed
        this.vectors.thrustvector.length += acc;
        if (this.vectors.thrustvector.length > this.engine.maxSpeed.forward || this.vectors.thrustvector.length < this.engine.maxSpeed.backward) {
            if (this.vectors.thrustvector.length > 0) this.vectors.thrustvector.length = this.engine.maxSpeed.forward;
            if (this.vectors.thrustvector.length < 0) this.vectors.thrustvector.length = this.engine.maxSpeed.backward;
        }
        this.vectors.thrustvector = new Vector(this.pos, null, this.bodyparts.body.angle, this.vectors.thrustvector.length);
    };

    this.move = function(){
        if (this.vectors.moveV.length != 0 && this.vectors.moveV.length != null) {
            this.pos.x += this.vectors.moveV.dx;
            this.pos.y += this.vectors.moveV.dy;
        }
    };

    this.updateGun = function(){
        this.bodyparts.gun.vector = new Vector(this.pos, null, this.bodyparts.gun.vector.angle + this.bodyparts.body.angle, this.bodyparts.gun.length);
        this.bodyparts.gun.points = [
            new pos(this.pos.x, this.pos.y),
            new pos(this.pos.x + this.bodyparts.gun.vector.dx, this.pos.y + this.bodyparts.gun.vector.dy)
        ];
        this.bodyparts.gun.seeVector = new Vector(this.pos, null, this.bodyparts.gun.vector.angle + this.bodyparts.body.angle, this.seeDepth);
    };
}