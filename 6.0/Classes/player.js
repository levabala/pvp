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
    this.type = 1; //player (index for collision checking)

    //set the pressure
    this.pressure = this.mass * this.G;

    //gun
    this.gun = {
        rotateSpeed: 0.025,
        length: 35,
        vector: new Vector(this.pos, null, 0, 35),
        realVector: new Vector(this.pos, null, 0, 35)
    };

    //tracks of the tank
    this.tracks = {
        v1: new Vector(new pos(this.pos.x - this.size.x, this.pos.y - this.size.x), new pos(this.pos.x + this.size.x, this.pos.y - this.size.x)),
        v2: new Vector(new pos(this.pos.x - this.size.x, this.pos.y + this.size.x), new pos(this.pos.x + this.size.x, this.pos.y + this.size.x))
    };

    //trail from the tracks
    this.trail = [];

    //functions
    this.tick = function(){
        this.accelerateTheEngine();
        this.accelerateTheObject();
        this.moveAndBrake();
        this.updatePos();
        this.rotateGunAfterTheBody();
        this.rotateTracksAfterTheBody();
        //this.updateTheTrail();             //it's not good made
    };

    this.render = function(ctx){
        //not used part of the code
        /*
        //drawing the trail
        ctx.beginPath();

        for (var t in this.trail){
            var trail = this.trail[t];

            var a = 1 / this.trail.length;
            ctx.strokeStyle = convertHex(this.color.stroke, a * (t / 2));
            ctx.fillStyle = convertHex(this.color.fill, a * t);

            //the drawing is the same as previously
            //first track
            ctx.moveTo(trail[0].start.x, trail[0].start.y);
            ctx.lineTo(trail[0].end.x, trail[0].end.y);

            //second track
            ctx.moveTo(trail[1].start.x, trail[1].start.y);
            ctx.lineTo(trail[1].end.x, trail[1].end.y);
        }

        if (this.color.stroke != null) ctx.stroke();
        if (this.color.fill != null) ctx.fill();
        ctx.closePath();
        */

        //drawing a body
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color.stroke;
        ctx.fillStyle = this.color.fill;
        ctx.arc(this.pos.x, this.pos.y, this.size.x, 0, Math.PI * 2, false);

        //coloring
        if (this.color.stroke != null) ctx.stroke();
        if (this.color.fill != null) ctx.fill();

        //if it no stroked or no filled we close the drawing to eliminate errors
        ctx.closePath();

        //change line width for gun drawing
        ctx.beginPath();
        ctx.lineWidth = 4;

        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.gun.realVector.end.x, this.gun.realVector.end.y);

        if (this.color.stroke != null) ctx.stroke();
        if (this.color.fill != null) ctx.fill();
        ctx.closePath();


        //change line width for tracks drawing
        ctx.beginPath();
        ctx.lineWidth = 6;

        //first track
        ctx.moveTo(this.tracks.v1.start.x, this.tracks.v1.start.y);
        ctx.lineTo(this.tracks.v1.end.x, this.tracks.v1.end.y);

        //second track
        ctx.moveTo(this.tracks.v2.start.x, this.tracks.v2.start.y);
        ctx.lineTo(this.tracks.v2.end.x, this.tracks.v2.end.y);

        if (this.color.stroke != null) ctx.stroke();
        if (this.color.fill != null) ctx.fill();
        ctx.closePath();
    };

    this.rotateGunAfterTheBody = function(){
        this.gun.realVector = new Vector(this.pos, null, this.gun.vector.angle + this.angle, this.gun.length);
    };

    this.rotateGunToLeft = function(){
        this.gun.vector = new Vector(this.pos, null, this.gun.vector.angle - this.gun.rotateSpeed, this.gun.length);
    };

    this.rotateGunToRight= function(){
        this.gun.vector = new Vector(this.pos, null, this.gun.vector.angle + this.gun.rotateSpeed, this.gun.length);
    };

    this.rotateTracksAfterTheBody = function(){
        var vl1 = new Vector(this.pos, null, this.angle - Math.PI / 2, this.size.x);
        var vr1 = new Vector(this.pos, null, this.angle + Math.PI / 2, this.size.x);

        var vl2 = new Vector(vl1.end, null, this.angle + Math.PI, this.size.x);
        var vl3 = new Vector(vl1.end, null, this.angle, this.size.x);

        var vr2 = new Vector(vr1.end, null, this.angle + Math.PI, this.size.x);
        var vr3 = new Vector(vr1.end, null, this.angle, this.size.x);

        this.tracks.v1 = new Vector(vl2.end, vl3.end);
        this.tracks.v2 = new Vector(vr2.end, vr3.end);
    };

    this.updateTheTrail = function(){
        this.trail[this.trail.length] = [this.tracks.v1, this.tracks.v2];
        if (this.trail.length > 10) this.trail.splice(0, 1);
    };
}