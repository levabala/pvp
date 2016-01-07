function player(position, mass, size, angle, colorS, colorF, ai){
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

    //set the pressure
    this.pressure = this.mass * this.G;

    //functions
    this.tick = function(){
        this.accelerateTheEngine();
        this.accelerateTheObject();
        this.moveAndBrake();
        this.updatePos();
    };

    this.render = function(ctx){
        ctx.beginPath();
        ctx.strokeStyle = this.color.stroke;
        ctx.fillStyle = this.color.fill;
        ctx.arc(this.pos.x, this.pos.y, this.size.x, 0, Math.PI * 2, false);
        if (this.color.stroke != null) ctx.stroke();
        if (this.color.fill != null) ctx.fill();
    };
}