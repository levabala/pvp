function collisionCheck(objects){
    var result = {};
    for(var objectF in objects){
        var obj1 = objects[objectF];
        for (var objectS in objects){
            if (objectS == objectF) continue;

            var obj2 = objects[objectS];
            var res = checkCrossing(obj1, obj2);

            if (res){
                if (obj1.type == 'vector'){
                    if (obj2.type == 'vector'){
                        result[objectF] = {obj: objectS, state: obj1.getCrossing(obj2), force: null};
                    }
                    else if (obj2.type == 'cylinder'){
                        result[objectF] = {obj: objectS, state: checkCrossing(obj1, obj2), force: null};
                    }
                    /*var d1 = obj1.vectors.thrust.length;
                    var line = new Vector(obj1.pos, obj2.pos);
                    line.getCoefficients();

                    var d2 = getRange(obj1.vectors.thrust.end, line);
                    var d3 = Math.sqrt(d1 * d1 - d2 * d2);

                    var force = new Vector(obj1.pos, null, line.angle, d3);

                    console.log(force);*/
                }
                else if (obj1.type == 'cylinder'){
                    var vector, d1, d2, d3, force;
                    if (obj2.type == 'vector'){
                        var state = checkCrossing(obj1, obj2);

                        vector = obj1.vectors.moving;
                        var rangeToVector = getRange(obj1.pos, obj2);
                        var angle = obj2.angle + Math.PI / 2;
                        if (rangeToVector < 0) angle = obj2.angle - Math.PI / 2;

                        var line = new Vector(obj1.pos, null, angle, 10);
                        line.getCoefficients();

                        d1 = vector.length;
                        d2 = getRange(vector.end, line);
                        d3 = Math.sqrt(d1 * d1 - d2 * d2);

                        var poppingPower = obj1.size.x - d2;
                        var popping = new Vector(obj1.pos, null, line.angle, poppingPower / 20);

                        force = new Vector(obj1.pos, null, line.angle, d3);
                        if (poppingPower > 0) force.sumWith(popping, true);

                        //var force = new Vector(obj1.pos, null, obj1.vectors.moving.angle + Math.PI, obj1.vectors.moving.length);
                        result[objectF] = {obj: objectS, state: state, force: force};
                    }
                    else if (obj2.type == 'cylinder'){
                        var line1 = new Vector(obj1.pos, obj2.pos);
                        var v = new Vector(obj1.pos, null, line1.angle, obj1.size.x);

                        var line2 = new Vector(v.end, null, line1.angle + Math.PI / 2, 100);
                        line2.getCoefficients();

                        vector = obj1.vectors.moving;
                        d1 = vector.length;
                        d2 = getRange(vector.end, line2);
                        d3 = Math.sqrt(Math.abs(d1 * d1 - d2 * d2)); //неправильно!

                        console.log(d3);

                        result[objectF] = {obj: objectS, state: checkCrossing(obj1, obj2), force: null};
                    }
                }
            }
        }
    }
    return result;
}







