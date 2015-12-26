function physicObject(position, type, stative, density, size, engine, frictionCoeff, angle){
    //start properties
    this.pos = position;            //{x: num, y: num}
    this.type = type;          //"cylinder" or "cube"
    this.density = density;
    this.size = size;          //{x: num, y: num, z: num}
    this.engine = engine;      //{acceleration: num, rotateSpeed: num, maxSpeed: {forward: num, backward: num}}
    this.G = 9.8;              //free fall acceleration
    this.angle = angle;
    this.frictionCoeff = frictionCoeff;
    this.stative = stative;

    //check properties
    for (var p in this){
        var obj = this[p];
        if (typeof obj == 'undefined' || obj == null){
            switch (p){
                case 'position':
                case 'type':
                {
                    console.error('Invalid property! ' + p + ' is ' + obj);
                    delete this;    //self-destruction
                    break;
                }
                case 'density': {
                    this.density = 1;
                    break;
                }
                case 'size': {
                    this.size = {x: 1, y: 1, z: 1};
                    break;
                }
            }
            if (!stative){
                switch (p){
                    case 'engine': {
                        this.engine = {acceleration: 0.2, rotateSpeed: 0.025, maxSpeed: {forward: 1, backward: -1}, speed: 0, direction: 'none', braking: 0.1};
                        break;
                    }
                    case 'frictionCoeff': {
                        this.frictionCoeff = 0.01;
                        break;
                    }
                    case 'angle': {
                        this.angle = 0;
                        break;
                    }
                }
            }
        }
    }

    //second level of properties
    this.volume = 0;
    switch (this.type){  //defining the volume
        case 'cube':{
            this.volume = this.size.x * this.size.y * this.size.z;
            break;
        }
        case 'cylinder':{
            this.volume = Math.PI * ((this.size.x / 2) * (this.size.x / 2)) * this.size.y;
            break;
        }
    }
    this.mass = this.volume * this.density;
    this.pressure = this.mass * this.G;

    if (!this.stative) {
        //third level (vectors)
        this.vectors = {};
        this.vectors.external = [];                                       //the array of external vectors (forces from other objects)
        this.vectors.moving = new Vector(this.pos, this.pos);             //the vector of moving
        this.vectors.thrust = new Vector(this.pos, this.pos);             //general thrust
        this.vectors.acceleration = new Vector(this.pos, this.pos);       //the acceleration from engine
        this.vectors.braking = new Vector(this.pos, this.pos);            //Braking force = N * frictionCoeff  N = mass * G   G = 9.8
    }

    //tick for dynamic object
    this.tick = function(){
        if (this.stative) return;
        //reset the thrust
        this.vectors.thrust = new Vector(this.pos, this.pos);

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

        //set the acceleration
        this.vectors.acceleration = new Vector(this.pos, null, this.angle, this.engine.speed);

        //add the acceleration to thrust
        this.vectors.thrust.sumWith(this.vectors.acceleration, true);
        for (var v in this.vectors.external){
            var extV = this.vectors.external[v];
            this.vectors.thrust.sumWith(extV, true);
        }

        //brake the object
        this.vectors.braking = new Vector(this.pos, null, this.vectors.thrust.angle + Math.PI, this.pressure * this.frictionCoeff);
        if (this.vectors.braking.length < this.vectors.thrust.length){
            this.vectors.moving = new Vector(this.pos, null, this.vectors.thrust.angle, this.vectors.thrust.length / this.mass); // Force = mass * acceleration
            this.vectors.thrust.sumWith(this.vectors.braking, true);
        }
        else this.vectors.thrust = new Vector(this.pos, this.pos);

        //reset the engine's accelerate direction and external vectors
        this.engine.direction = 'none';
        this.vectors.external = [];

        //MOVE!  I should move it out
        this.updatePos();
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

    //simple function
    this.showState = function(){
        console.group('State of object');
        for (var p in this){
            var property = this[p];
            if (typeof property != 'function') {
                if (typeof property == 'object'){
                    console.groupCollapsed(p);
                    for(var o in property) {
                        if (typeof property[o] != 'function'){
                            if (typeof property[o] == 'object'){         //что вы знаете о рекурсии? :)
                                console.group(o);
                                console.log(property[o]);
                                console.groupEnd();
                            }
                            else console.log(o + ': ' + property[o]);
                        }
                    }
                    console.groupEnd();
                }
                else console.log(p + ': ' + property);
            }
        }
        console.groupEnd();
    };

    this.updatePos = function(){
        this.pos.x += this.vectors.thrust.dx;
        this.pos.y += this.vectors.thrust.dy;
    };
}