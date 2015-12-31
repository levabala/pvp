function checkCrossing(obj1, obj2){
    var range = 0;

    if (obj1.type == 'cylinder') obj1 = new circle(obj1.pos, obj1.size.x);
    if (obj2.type == 'cylinder') obj2 = new circle(obj2.pos, obj2.size.x);

    if (obj1.type == 'circle'){
        if (obj2.type == 'vector'){
            range = Math.abs(getRange(obj1.pos, obj2));
            if (range <= obj1.size) {
                return true;
            }
        }
        else if (obj2.type == 'circle'){
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