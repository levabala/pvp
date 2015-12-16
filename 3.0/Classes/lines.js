function getKandB(vector){
    //уравнение любой прямой
    //хз как...  спустя 10 минут: уже не хз :)     //на нормальном математическом языке:
    /*
     y1, y2, x1, x2 - известны
     y1 = k * x1 + b
     b = y1 - k * x1

     y2 = k * x2 + y1 - k * x1
     k * (x2 - x1) + y1 = y2
     k =  (y2 - y1) / (x2 - x1)    //k is defined!!!
     b = y1 - x1 * k       //b is defined!!!

     */

    var byY = false;
    if (vector.end.x == vector.start.x) byY = true;
    var k = (vector.end.y - vector.start.y) / (vector.end.x - vector.start.x);
    //console.log(line.start);
    //console.log(line.end);
    //console.log((line.end.y - line.stat.y) + ' / ' + (line.end.x - line.start.x) + ' = ' + k);
    var b = vector.start.y - vector.start.x * k;
    if (byY){
        if (vector.start.y > vector.end.y)  b = vector.end.y;
        else b = vector.start.y;
    }

    var res = {k: k, b: b};

    return res;
}

function getCrossing(kb1, kb2, vector1, vector2){
    //находим точку пересечения
    /*
     y = k1 * x + b1  //наша системка
     y = k2 * x + b2

     k1 * x + b1 = k2 * x + b2
     k1 * x - k2 * x = b2 - b1
     x * (k1 - k2) = b2 - b1
     x = (b2 - b1) / (k1 - k2)       //x is defined
     y = k1 * x + b1                 //y is defined
     */

    var x = 0;
    var y = 0;

    if (kb1.k == 'Infinity') console.log('infinity!');

    if (kb1.k - kb2.k != 0) x = (kb2.b - kb1.b) / (kb1.k - kb2.k);
    else x = vector1.x1;

    console.log(kb1.k + ' ' + x + ' ' + kb1.b);
    if (kb1.k - kb2.k != 0) y = kb1.k * x + kb1.b;
    else y = kb1.b;

    var pos = {x: x, y: y};
    return pos;
}