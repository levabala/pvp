function getRange(obj1, obj2){
    //some theory
    /*
     A * x + B * y + C = 0                                           //уравнение прямой
     d = Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B)      //получение расстояния от точки до прямой (делаем перпендикуляр)

     //получаем A, B и C
     A = y1 - y2    //y1 = vector.start.y   y2 = vector.end.y
     B = x2 - x1    //с "х" аналогично
     C = x1y2 - x2y1
     */
    var range = 0;
    var A, B, C, x, y;

    if (obj1.type == 'position'){
        if (obj2.type == 'position'){
            range = Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x)  + (obj2.y - obj1.y) * (obj2.y - obj1.y));
        }
        else if (obj2.type == 'vector'){
            A = obj2.start.y - obj2.end.y;
            B = obj2.end.x - obj2.start.x;
            C = obj2.start.x * obj2.end.y - obj2.end.x * obj2.start.y;

            x = obj1.x;
            y = obj1.y;

            //range = Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B);
            range = (A * x + B * y + C) / Math.sqrt(A * A + B * B);
        }
    }
    else if (obj1.type == 'vector'){
        if (obj2.type == 'position'){
            A = obj1.start.y - obj1.end.y;
            B = obj1.end.x - obj1.start.x;
            C = obj1.start.x * obj1.end.y - obj1.end.x * obj1.start.y;

            x = obj2.x;
            y = obj2.y;

            //range = Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B);
            range = (A * x + B * y + C) / Math.sqrt(A * A + B * B);
        }
        else if (obj2.type == 'vector'){
            return false;
        }
    }

    return range;
}

function overlapping(obj1, obj2){
    if (obj1.presenceZone != null){
        if (obj2.presenceZone != null){

        }
        else{

        }
    }
    else{


    }
}