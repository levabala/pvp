function draw(arrays, ctx){
    //properties
    this.arrays = arrays;
    this.ctx = ctx;
    this.width = ctx.width;
    this.height = ctx.height;

    //functions
    this.paint = function(c){
        if(!c) console.group('--- Arrays ---');
        for (var ar in arrays){  //getting current array
            var array = arrays[ar];
            if(!c) console.group('Array of ' + ar);
            for (var obj in array){
                var object = array[obj];
                if(!c) console.group(object.nick + '\'s body parts: ');
                var body_parts = object.bodyparts;
                for (var bp in body_parts){
                    var body_part = body_parts[bp];
                    if(!c) console.log(body_part);

                    //drawing!
                    if (body_part['points'] != null){  //for polygon or line
                        var points = body_part.points;

                        //set ctx properties
                        if (body_part.lineWidth != null) ctx.lineWidth = body_part.lineWidth;
                        else ctx.lineWidth = 2;
                        ctx.strokeStyle = object.colorS;
                        ctx.fillStyle = object.colorF;

                        //the points fitting
                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        for (var i = 1; i < points.length; i++){
                            ctx.lineTo(points[i].x, points[i].y);
                        }
                        ctx.closePath();

                        //coloring
                        ctx.stroke();
                        if (body_part.shaded) ctx.fill();
                    }

                    if (body_part['circle'] != null){
                        var circle = body_part.circle;

                        //set ctx properties
                        if (body_part.lineWidth != null) ctx.lineWidth = body_part.lineWidth;
                        else ctx.lineWidth = 2;
                        ctx.strokeStyle = object.colorS;
                        ctx.fillStyle = object.colorF;

                        //the arc fitting
                        ctx.arc(circle.pos.x, circle.pos.y, circle.size, 0, Math.PI * 2, false);

                        //coloring
                        ctx.stroke();
                        if (body_part.shaded) ctx.fill();
                    }
                }
                if(!c) console.groupEnd();
            }
            if(!c) console.groupEnd();
        }
        if(!c) console.groupEnd();
    };
}