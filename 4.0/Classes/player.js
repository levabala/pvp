function player(nick, p, color, ai){
    //input values
    this.nick = nick;
    this.pos = p;
    this.colorS = color;
    this.colorF = color;
    this.ai = new Worker(ai);

    //constance
    this.size = 30;
    this.moveV = new Vector(this.pos, this.pos);  //moving vector
    this.speed = 0;
    this.seeDepth = 1000;
    this.velocity = {
        rotateBody: 0.025,
        rotateGun: 0.05,
        acceleration: 0.4,
        braking: 0.3,
        maxSpeed: {
            forward: 4,
            backward: -2
        }
    };

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
            shaded: true
        },
        body: {
            circle: new circle(this.pos, this.size),
            shaded: false
        }
    };

    //check null value
    if (ai == null) this.controlled = true;

    //functions
}