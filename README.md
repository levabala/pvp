# pvp
That's a 2d-physics class.
You can create new physicObject so:
``` JavaScript
var obj = new physicObject(position, type, stative, density, size, engine, frictionCoeff, angle);
```
There:
- *position*. An object(x and y)
- *type*. Or 'cube', or 'cylinder'. It affect the collision checking.
- *stative*. Stative or Dynamic. In the first case the object can't move and it has got infinit mass. In the second case the object can move.
- *density*. It affect the mass of the object.
- *size*. An object(x,y and z). **z** is a height of the object.
- *engine*. Properties of an engine of the object. It contains properies such as **acceleration**, **rotateSpeed**, 
**maxSpeed(forward and backward)**, **speed** of work, **direction** of accelerate, **braking** speed.
- *frictionCoeff*. It affect the speed of braking by the ground.
- *angle*. It is angle of object in a space.

And that's all. Here will be more manuals by the class
