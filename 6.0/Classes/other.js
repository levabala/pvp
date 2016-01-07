function extend(Child, Parent) {
    var F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype
}

function getRandomColor(){
    return ("#"+((1<<24)*Math.random()|0).toString(16));
}

function convertHex(hex,opacity){
    if (hex == null || opacity == null) return;
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    var result = 'rgba('+r+','+g+','+b+','+opacity+')';

    return result;
}

function pow(num, l){
    return Math.pow(num, l);
}