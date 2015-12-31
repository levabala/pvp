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
                    if (obj2.type == 'vector'){
                        var state = checkCrossing(obj1, obj2);

                        var vector = obj1.vectors.moving;
                        var rangeToVector = getRange(obj1.pos, obj2);
                        var angle = obj2.angle + Math.PI / 2;
                        if (rangeToVector < 0) angle = obj2.angle - Math.PI / 2;

                        var line = new Vector(obj1.pos, null, angle, 10);
                        line.getCoefficients();

                        var d1 = vector.length;
                        var d2 = getRange(vector.end, line);
                        var d3 = Math.sqrt(d1 * d1 - d2 * d2);

                        var poppingPower = obj1.size.x - d2;
                        var popping = new Vector(obj1.pos, null, line.angle, poppingPower / 10);

                        var force = new Vector(obj1.pos, null, line.angle, d3);
                        if (poppingPower > 0) force.sumWith(popping, true);

                        //var force = new Vector(obj1.pos, null, obj1.vectors.moving.angle + Math.PI, obj1.vectors.moving.length);
                        result[objectF] = {obj: objectS, state: state, force: force};
                    }
                    else if (obj2.type == 'cylinder'){
                        result[objectF] = {obj: objectS, state: checkCrossing(obj1, obj2), force: null};
                    }
                }
            }
        }
    }
    return result;
}







