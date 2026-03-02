class ThrowableObject extends MovableObject {

    constructor(x, y) {
        super().loadImage('./img/bottle.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw();
    }

    throw(x, y) {
        this.x = x;
        this.x = y;
        this.speedY = 30;
        this.applyGravity();
        setInterval( () => {
            this.x += 10;
        }, 25);
    }
}