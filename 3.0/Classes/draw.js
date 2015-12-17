function draw(arrays, ctx){
    //properties
    this.arrays = arrays;
    this.ctx = ctx;
    this.width = ctx.width;
    this.height = ctx.height;

    //functions
    this.paint = function() {
        ctx.save();
        ctx.clearRect(-this.width,-this.height,this.width*2,this.height*2);
        for (var i in this.arrays) {
            var array = this.arrays[i];
            //console.log(array);
            for (var object in array) {
                var obj = array[object];
                if (typeof obj.drawBody == 'undefined') obj = obj.body;
                //console.log('-----object:');
                //console.log(obj);
                var drawBody;
                if (typeof obj == 'object') {
                    drawBody = obj.drawBody;
                    //console.log(drawBody);
                    //main drawing
                    for (var elem in drawBody) {
                        ctx.fillStyle = obj.colorF;
                        ctx.strokeStyle = obj.colorS;
                        ctx.lineWidth = obj.lineWidth;
                        var db = drawBody[elem];
                        //console.log(elem);
                        if (db.colorF != null) ctx.fillStyle = db.colorF;
                        if (db.colorS != null) ctx.strokeStyle = db.colorS;
                        if (db.lineWidth != null) ctx.lineWidth = db.lineWidth;
                        //console.log(db);
                        //console.log(ctx.fillStyle);
                        ctx.beginPath();
                        switch (db.type) {
                            case 'polygon':
                            {
                                var points = db.points;
                                //console.log(points);
                                ctx.moveTo(points[0].x, points[0].y);
                                for (var iii = 1; iii < points.length; iii++) {
                                    var point = points[iii];
                                    ctx.lineTo(point.x, point.y);
                                }
                                break;
                            }
                            case 'arc':
                            {
                                //console.log(db.size);
                                ctx.arc(db.pos.x, db.pos.y, db.size, 0, Math.PI * 2, false);
                                break;
                            }
                        }
                        ctx.closePath();
                        if (obj.colorF != null && db.colorF != 'none') {
                            ctx.fill();
                            //console.info('fill');
                        }
                        if (obj.colorS != null && db.colorS != 'none') {
                            ctx.stroke();
                            //console.info('stroke');
                        }
                    }
                }
                else if (typeof obj == 'array') {

                }
            }
        }
        ctx.restore();
    }
}