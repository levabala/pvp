function pos(x,y){
    this.x = x;
    this.y = y;
    this.sum = function(pos){
        return new pos(this.x + pos.x, this.y + pos.y);
    }
}