function structure(type, points, pos, size, colorF, colorS, hits, additionalParts){
    //start properties
    this.type = type;
    this.colorF = colorF;
    this.colorS = colorS;
    this.hits = hits;
    this.points = points;
    this.pos = pos;
    this.size = size;
    this.lineWidth = 2;
    this.additionalParts = additionalParts;
    this.vectors = [];

    //check for null
    if (points === null) this.points = [];

    //set drawbody
    switch (type) {
        case 'ground':
        case 'wall':
        {
            this.drawBody = {
                body: {
                    type: 'polygon',
                    points: this.points.body,
                    colorS: this.colorF
                }
            };

            for (var p = 0; p < this.points.body.length-1; p ++){
                var pointS = this.points.body[p];
                var pointE = this.points.body[p + 1];
                this.vectors[this.vectors.length] = new Vector(pointS, pointE);
            }
            break;
        }
        case 'player':{
            this.drawBody = {
                body: {
                    type: 'arc',
                    pos: this.pos,
                    size: this.size,
                    colorF: 'none'

                },
                tower: {
                    type: 'arc',
                    pos: this.pos,
                    size: this.size / 2
                },
                gun: {
                    type: 'polygon',
                    points: this.points,
                    lineWidth: 10,
                    colorF: 'none'
                }
            };

            console.log('--------------' + this.drawBody.body.type);
            for (var p = 0; p < this.points.length-1; p++){
                var pointS = this.points[p];
                var pointE = this.points[p + 1];
                this.vectors[this.vectors.length] = new Vector(pointS, pointE);
                var v = this.vectors[this.vectors.length-1];
                console.log(v);
                console.log(v.start);
                console.log(v.end);
            }
            break;
        }
    }

    for (var a in this.additionalParts){
        var part = this.additionalParts[a];
        switch(part.type){
            case 'head':{
                this.drawBody[part.type] = {
                    type: 'arc',
                    pos: part.pos,
                    size: part.size
                }
            }
        }
    }
}