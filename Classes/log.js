function lw(output){ //LogWindow
    //property
    this.output = output;
    this.log = '--- LOG WINDOW ---\n\n';
    //functions
    this.logging = function(){
        this.output.value = this.log;
        this.clear();
    };

    this.nl = function(text){
        this.log += '\n' + text + '\n       _____________        \n';
    };

    this.clear = function(){
        this.log = '--- LOG WINDOW ---\n\n';
    };
}