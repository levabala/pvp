//  эта штука не работает
/*function getCrossingVandC(circle, vector){   //получение точки пересечения между вектором и окружностью
    //для начала немного уравнений в общем виде
    /*
    x = -(2k * (b - y0) + b * (b - 2y0) + x0 * (x0 - 2) + y0 * y0 - R * R) / (1 + k * k)
    y = kx + b


    var k = vector.equation.k;
    var b = vector.equation.b;
    var r = circle.size;
    var x0 = circle.pos.x;
    var y0 = circle.pos.y;
    var c = r * r + 2 * b * y0 - x0 * x0 - b * b - y0 * y0;
    //console.log('c: ' + c);
    var D1 = Math.pow((x0 - k * b + k * y0), 2) - c * (k * k + 1);

    //console.log(D1);
    //return 'c: ' + c + ' k: ' + k;
    //return (D1 + ' ' + (c * (k * k + 1)));

    var x = (x0 - k * b + k * y0 + Math.sqrt(D1)) / k * k + 1;
    //return x0 + ' ' + k + ' ' + b + ' ' + y0 + ' ' + Math.sqrt(D1)
    var y = k * x + b;

    return {x: x, y: y};
}*/