var f = {}; //functions list
f[1] = {
    1: function(obj1, obj2){ //if player AND player

    },
    2: function(obj1, obj2){ //if player AND terrain
        var forces = [];
        for (var v in obj2.vect){
            var vector = obj2.vect[v];
            vector.getCoefficients();

            var checkCross = checkCrossing(obj1, vector, true);
            if (!checkCross.state) continue;

            var rangeToLine = checkCross.range;
            var popping,poppingPower,angle;
            var motionPower = obj1.vectors.moving.length;
            if (!checkCross.isOut){
                poppingPower = obj1.size.x - Math.abs(rangeToLine);
                angle = vector.angle + Math.PI / 2;
                if (rangeToLine < 0) angle = vector.angle - Math.PI / 2;
                if (motionPower < 1) motionPower = 1;
                if (poppingPower < 1) popping = new Vector(obj1.pos, null, angle, poppingPower * motionPower);
                else popping = new Vector(obj1.pos, null, angle, poppingPower * poppingPower * motionPower);
            }
            else {
                var rangeToPoint = getRange(obj1.pos, checkCross.point);
                var vectorToPoint = new Vector(obj1.pos, checkCross.point);
                poppingPower = obj1.size.x - Math.abs(rangeToPoint);
                angle = vectorToPoint.angle + Math.PI;
                if (motionPower < 1 || isNaN(motionPower)) motionPower = 1;
                if (poppingPower > 1) popping = new Vector(obj1.pos, null, angle, poppingPower * poppingPower * motionPower);
                else popping = new Vector(obj1.pos, null, angle, motionPower);
            }
            if (poppingPower != null){
                forces[forces.length] = popping;
            }
        }

        return forces;
    }
};
f[2] = {
    1: function(obj1, obj2){ //if terrain AND player

    },
    2: function(obj1, obj2){ //if terrain AND terrain
        //no actions
    }
};

function collisionChecking(objects){
    var result = {};
    for (var object1 in objects){
        var obj1 = objects[object1];
        for (var object2 in objects){
            var obj2 = objects[object2];
            if (obj1 == obj2 || result[object1] == object2 || result[object2] == object1) continue;
            var forces = f[obj1.type][obj2.type](obj1, obj2);
            for (var force in forces) {
                var ff = forces[force];
                if (typeof ff != 'undefined' && !isNaN(ff.length)) {
                    obj1.vectors.external[obj1.vectors.external.length] = ff;
                }
            }

        }
    }
}


/*
//Game zone for my little brother
aAaaaaaaaaaaaaaaaaaaaaaaaasssssssssssssssssssssssssssssssssssssssssssssxxxxxxxx,,,,,,,,,,,,,,,,,12eoi1j02
gvvvvvvvvvvvvvvvvvvvvvvvkkkkkkkkkkkkkkkkkkssssssssssssssssLKKKKKKKKKKKKKKKKKKKKKKKKKf0000000111119999999999999999999999999222222222222222222222jjjjjrrrrrrrrrrrrrrrjjjjjjjjjjjasdddddddd






aweeeeeee
 */




