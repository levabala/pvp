function player(position, mass, size, angle, colorS, colorF, ai, controlled){
    //start properties
    this.pos = position;
    this.angle = angle;
    this.mass = mass;    //if the mass is greater than 10 000, it will be infinity
    this.size = size;
    this.color = {
        stroke: colorS,
        fill: colorF
    };
    this.ai = new Worker(ai);
    this.controlled = controlled;

    //set the pressure
    this.pressure = this.mass * this.G;

    //gun
    this.gun = {
        angle: 0,
        length: 35,
        vector: new Vector(this.pos, null, 0, 35),
        realVector: new Vector(this.pos, null, 0, 35)
    };

    //functions
    this.tick = function(){
        this.accelerateTheEngine();
        this.accelerateTheObject();
        this.moveAndBrake();
        this.updatePos();
        this.rotateGun();
    };

    this.render = function(ctx){
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = this.color.stroke;
        ctx.fillStyle = this.color.fill;
        ctx.arc(this.pos.x, this.pos.y, this.size.x, 0, Math.PI * 2, false);
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.gun.realVector.end.x, this.gun.realVector.end.y);
        if (this.color.stroke != null) ctx.stroke();
        if (this.color.fill != null) ctx.fill();
        ctx.closePath();
    };

    this.rotateGun = function(){
        this.gun.realVector = new Vector(this.pos, null, this.gun.vector.angle + this.angle, this.gun.length);
    };
}