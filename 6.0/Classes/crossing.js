function checkCrossing(obj1, obj2, returnIsOut){

    var range = 0;
    if (obj1.type == 1) obj1 = new circle(obj1.pos, obj1.size.x);
    if (obj2.type == 1) obj2 = new circle(obj2.pos, obj2.size.x);

    if (obj1.type == 'circle'){
        if (obj2.type == 'vector'){
            range = getRange(obj1.pos, obj2);
            var lx = obj2.start.x;
            var rx = obj2.end.x;
            if (obj2.end.x < lx) {
                lx = obj2.end.x;
                rx = obj2.start.x;
            }

            var ty = obj2.start.y;
            var dy = obj2.end.y;
            if (obj2.end.y < ty) {
                ty = obj2.end.y;
                dy = obj2.start.y;
            }

            var x = obj1.pos.x;
            var y = obj1.pos.y;

            if (Math.abs(range) <= obj1.size && (x > lx - obj1.size && x < rx + obj1.size && y > ty - obj1.size && y < dy + obj1.size)) {
                //return true;
                if (!returnIsOut) return true;
                else {
                    var isOut = (x < lx || y < ty || x > rx || y > dy);
                    var point = null;

                    if (isOut) {
                        var rs = getRange(obj1.pos, obj2.start);
                        var re = getRange(obj1.pos, obj2.end);
                        if (rs <= re) {
                            if (rs > obj1.size) isOut = false;
                            point = obj2.start;
                        }
                        else {
                            if (re > obj1.size) isOut = false;
                            point = obj2.end;
                        }
                    }
                    return {
                        state: true,
                        isOut: isOut,
                        point: point,
                        range: range
                    }
                }
            }
        }
        else if (obj2.type == 'circle'){

            range = Math.abs(getRange(obj1.pos, obj2.pos));
            console.log(range);
            if (range <= obj1.size + obj2.size) return true;
        }
    }
    else if (obj1.type == 'vector'){
        if (obj2.type == 'vector'){
            return obj1.getCrossing(obj2);
        }
        else if (obj2.type == 'circle'){
            range = Math.abs(getRange(obj1, obj2.pos));
            if (range <= obj2.size) return true;
        }
    }
    return false;
}