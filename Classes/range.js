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

    if (obj1.type == 'position'){
        if (obj2.type == 'position'){
            range = Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x)  + (obj2.y - obj1.y) * (obj2.y - obj1.y));
        }
        else if (obj2.type == 'vector'){
            var A = obj2.start.y - obj2.end.y;
            var B = obj2.end.x - obj2.start.x;
            var C = obj2.start.x * obj2.end.y - obj2.end.x * obj2.start.y;

            var x = obj1.x;
            var y = obj1.y;

            range = Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B);
        }
    }
    else if (obj1.type == 'vector'){
        if (obj2.type == 'position'){
            var A = obj1.start.y - obj1.end.y;
            var B = obj1.end.x - obj1.start.x;
            var C = obj1.start.x * obj1.end.y - obj1.end.x * obj1.start.y;

            var x = obj2.x;
            var y = obj2.y;

            range = Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B);
        }
        else if (obj2.type == 'vector'){
            return false;
        }
    }

    return range;
}