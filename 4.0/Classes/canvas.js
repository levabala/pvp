function canvas(id){
    this.dom = document.getElementById(id);
    this.ctx = this.dom.getContext('2d');
    this.ctx.width = this.dom.width;
    this.ctx.height = this.dom.height;
    this.w = this.dom.width;
    this.h = this.dom.height;
}