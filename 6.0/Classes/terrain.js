function terrain(position, points, colorS, colorF){
    //start properties
    this.pos = position;
    this.color = {
        stroke: colorS,
        fill: colorF
    };
    this.points = [];
    this.type = 2; //terrain (index for collision checking)

    //function for conversion of points in absolute coordinates
    this.transformPos = function(p){
        var pp = new pos(this.pos.x + p.x, this.pos.y + p.y)
        return pp;
    };

    for (var point in points){
        var p = points[point];
        this.points[point] = this.transformPos(p);
    }

    //let's describe the terrain using vectors
    this.vect = [];
    this.vect[this.vect.length] = new Vector(this.pos, this.points[0]);
    for (var point = 0; point < points.length-1; point++){
        var p = this.points[point];
        var p2 = this.points[point+1];
        this.vect[this.vect.length] = new Vector(p,p2);
    }
    this.vect[this.vect.length] = new Vector(this.points[this.points.length-1],this.pos);

    //define the coefficients of each vector for follow-up collision checks
    for (var v in this.vect){
        this.vect[v].getCoefficients();
    }

    //functions
    this.tick = function(){

    };

    this.render = function(ctx){
        //drawing the terrain
        ctx.beginPath();
        ctx.strokeStyle = this.color.stroke;
        ctx.fillStyle = this.color.fill;
        ctx.lineWidth = 2;

        ctx.moveTo(this.pos.x, this.pos.y);
        for (var vector in this.vect){
            var v = this.vect[vector];
            ctx.lineTo(v.end.x, v.end.y);
        }

        //coloring
        if (this.color.stroke != null) ctx.stroke();
        if (this.color.fill != null) ctx.fill();

        //if it no stroked or no filled we close the drawing to eliminate errors
        ctx.closePath();
    };
}