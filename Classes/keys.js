function keys(){
    //property
    this.whiches = [];

    //functions
    this.down = function(key){
        this.whiches[key] = true;
    };
    this.up = function(key){
        this.whiches[key] = false;
    };
    this.isDown = function(key){
        return (this.whiches[key] == true);
    }
}