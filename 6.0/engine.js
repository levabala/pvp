var basicObject = new physicObject(new pos(0,0), 0, {x: 0, y: 0, z: 0}, 0);    //inheriting
player.prototype = basicObject;                                                //to inherit "player" from "physicObject"

var log = new lw(document.getElementById('log'));
var canvas = new canvas('canvas');


setInterval(function(){loop();}, 16);
