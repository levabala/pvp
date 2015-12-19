function physicObject(pos, parts, weight){
    this.parts = parts;
    this.stative = (weight > 1000);
    this.weight = weight;
    this.pos = pos;
}