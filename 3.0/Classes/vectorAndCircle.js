function getCrossingVandC(circle, vector){   //получение точки пересечения между вектором и окружностью
    //для начала немного уравнений в общем виде
    /*
    x = -(2k * (b - y0) + b * (b - 2y0) + x0 * (x0 - 2) + y0 * y0 - R * R) / (1 + k * k)
    y = kx + b
    */

    var k = vector.equation.k;
    var b = vector.equation.b;
    var r = circle.size;
    var x0 = circle.pos.x;
    var y0 = circle.pos.y;

    var x = 0;
    var y = 0;

    x = -(2 * k * (b - y0) + b * (b - 2 * y0) + x0 * (x0 - 2) + y0 * y0 - r * r) / (1 + k * k);
    y = k * x + b;

    //console.log({x: x, y: y});
}