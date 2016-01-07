function physicObject(position, mass, size, angle, colorS, colorF){
    //start properties
    this.pos = position;
    this.angle = angle;
    this.mass = mass;                                       //if the mass is greater than 10 000, it will be infinity
    this.size = size;
    this.color = {
        stroke: colorS,
        fill: colorF
    };

    //vectors
    this.vectors = {
        external: [],                                       //the array of external vectors (forces from other objects)
        moving: new Vector(this.pos, this.pos),             //the vector of moving
        thrust: new Vector(this.pos, this.pos),             //general thrust
        acceleration: new Vector(this.pos, this.pos),       //the acceleration from engine
        braking: new Vector(this.pos, this.pos)             //Braking force = N * frictionCoeff  N = mass * G   G = 9.8
    };

    //set physics properties
    this.frictionCoeff = 0.001;
    this.G = 9.8;
    this.pressure = this.mass * this.G;

    //set an engine
    this.engine = {acceleration: 0.2, rotateSpeed: 0.05, maxSpeed: {forward: 6.5, backward: -3.25}, speed: 0, braking: 0.025, direction: 'forward'};

    //functions
    this.accelerateTheEngine = function(){
        //actions with the engine's speed
        if (this.engine.direction == 'forward') this.engine.speed += this.engine.acceleration;
        else if (this.engine.direction == 'backward') this.engine.speed -= this.engine.acceleration;
        else {
            if (this.engine.speed > 0) {
                this.engine.speed -= this.engine.braking;
            }
            else if (this.engine.speed < 0) {
                this.engine.speed += this.engine.braking;
            }
        }
        if (this.engine.speed > this.engine.maxSpeed.forward) this.engine.speed = this.engine.maxSpeed.forward;
        else if (this.engine.speed < this.engine.maxSpeed.backward) this.engine.speed = this.engine.maxSpeed.backward;
    };

    this.accelerateTheObject = function(){
        //set the acceleration
        this.vectors.acceleration = new Vector(this.pos, null, this.angle, this.engine.speed);

        //add the acceleration to thrust
        this.vectors.thrust.sumWith(this.vectors.acceleration, true);
        for (var v in this.vectors.external){
            var extV = this.vectors.external[v];
            this.vectors.thrust.sumWith(extV, true);
        }
    };

    this.moveAndBrake = function(){
        //brake the object and set a move vector
        this.vectors.braking = new Vector(this.pos, null, this.vectors.thrust.angle + Math.PI, this.pressure * this.frictionCoeff);
        //console.log(this.pressure);
        if (this.vectors.braking.length < this.vectors.thrust.length){
            this.vectors.thrust.sumWith(this.vectors.braking, true);
            this.vectors.moving = new Vector(this.pos, null, this.vectors.thrust.angle, this.vectors.thrust.length / this.mass); // Force = mass * acceleration
        }
        else {
            this.vectors.thrust = new Vector(this.pos, this.pos);
            this.vectors.moving = this.vectors.thrust;
        }
    };

    this.updatePos = function(){
        //reset the engine's accelerate direction and external vectors
        this.engine.direction = 'none';
        this.vectors.external = [];

        this.pos.x += this.vectors.moving.dx;
        this.pos.y += this.vectors.moving.dy;
    };

    this.accelerate = function(){
        this.engine.direction = 'forward';
    };

    this.brake = function(){
        this.engine.direction = 'backward';
    };

    this.toLeft = function(){
        this.angle -= this.engine.rotateSpeed;
    };

    this.toRight= function(){
        this.angle += this.engine.rotateSpeed;
    };
}