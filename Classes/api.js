function api(players){  //это процедура, а не класс :)
    var cmds = [];
    var processCmds = [];
    var who;
    addEventListener('message', function(e) {
        cmds = e.data;
    }, false);
    for(var pp in players){
        var player = players[pp];
        if(cmd.owner == player.nick){
            who = player;
        }
    }
    for(var c in cmds){
        var cmd = cmds[c];
        for(var pc in processCmds){
            var p = processCmds[pc];
            if(cmd == p){
                return;
            }
        }
        processCmds.push(cmd);
        switch(cmd.name){
            case 'rotateGun':
                if(who.velocity.rotateGun < cmd.speed){cmd.speed = who.velocity.rotateGun;}
                if(who.velocity.rotateGun*-1 > cmd.speed){cmd.speed = who.velocity.rotateGun*-1;}
                who.rotate('gun', cmd.speed);
            break;
            case 'rotateBody':
                if(who.velocity.rotateBody < cmd.speed){cmd.speed = who.velocity.rotateBody;}
                if(who.velocity.rotateBody*-1 > cmd.speed){cmd.speed = who.velocity.rotateBody*-1;}
                who.rotate('body', cmd.speed);
            break;
            case 'move':
                if(who.velocity.maxSpeed.forward < cmd.speed){cmd.speed = who.velocity.maxSpeed.forward;}
                if(who.velocity.maxSpeed.forward*-1 > cmd.speed){cmd.speed = who.velocity.maxSpeed.forward*-1;}
                who.move(cmd.speed);
            break;
            case 'shoot':
                who.shoot();
            break;
        }
	}
}