function Vector(start, end, angle, length){
    //basic properties
    this.start = start;
    this.end = end;
    this.angle = angle;
    this.length = length;
    this.equation = {
        k: null,
        b: null,
        horizontal: false,
        vertical: false
    };

    //next defining
    if (start != null && end != null) this.dx = end.x - start.x;
    else this.dx = Math.cos(angle) * length;
    if (end != null && start != null) this.dy = end.y - start.y;
    else this.dy = Math.sin(angle) * length;
    if (length != null) this.length = length;
    else this.length = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    if (angle != null) this.angle = angle;
    else {
        if (this.dx == 0) this.angle = 0;
        this.angle = Math.atan(this.dy / this.dx);
        if ((this.dx < 0 && this.dy < 0) || (this.dx < 0 && this.dy >= 0)) this.angle = this.angle - Math.PI;
        if (this.angle == null) this.angle = 0;
    }
    if (end == null){
        this.end = new pos(this.start.x + this.dx, this.start.y + this.dy);
    }

    //functions
    this.getCoefficients = function(){
        //уравнение любой прямой
        /*
         y1, y2, x1, x2 - известны
         y1 = k * x1 + b
         b = y1 - k * x1

         y2 = k * x2 + y1 - k * x1
         k * (x2 - x1) + y1 = y2
         k =  (y2 - y1) / (x2 - x1)    //k is defined!!!
         b = y1 - x1 * k       //b is defined!!!

         */

        var byY = false;

        this.equation.vertical = (this.end.x == this.start.x);
        this.equation.horizontal = (this.end.y == this.start.y);

        var k = (this.end.y - this.start.y) / (this.end.x - this.start.x);
        var b = this.start.y - this.start.x * k;
        if (this.equation.vertical){
            if (this.start.y > this.end.y)  b = this.end.y;
            else b = this.start.y;
        }

        this.equation.k = k;
        this.equation.b = b;
    };

    this.getCrossing = function(vector){
        this.getCoefficients();
        vector.getCoefficients();

        var x = 0;
        var y = 0;
        var eq1 = this.equation;
        var eq2 = vector.equation;


        if (eq1.k == 'Infinity') {
            x = this.start.x;
            y = eq2.k * x +eq2.b;
            return {x: x, y: y};
        }
        else if (eq2.k == 'Infinity') {
            x = vector.start.x;
            y = eq1.k * x + eq1.b;
            console.log(x + ' ' + y);
            return {x: x, y: y};
        }

        if (eq1.k - eq2.k != 0) x = (eq2.b - eq1.b) / (eq1.k - eq2.k);
        if (eq1.k - eq2.k != 0) y = eq1.k * x + eq1.b;
        else y = eq1.b;

        var res = {x: x, y: y};
        this.checkCrossRange(res);
        return res;
    };

    this.checkCrossRange = function(p){
        /*console.log('---')
        console.log(p);
        console.log(this.start);
        console.log(this.end);*/
        //console.log('---');
        /*console.log((p.x > this.start.x) + ' ' + p.x + ' > ' + this.start.x);
        console.log(p.x < this.end.x);
        console.log(p.y > this.start.y);
        console.log(p.y < this.end.y);*/
        //console.log((p.x > this.start.x) && (p.x < this.end.x));

        return ((p.x > this.start.x && p.x < this.end.x && p.y > this.start.y && p.y < this.end.y) ||
            (p.x > this.end.x && p.x < this.start.x && p.y > this.end.y && p.y < this.start.y));
    };
}