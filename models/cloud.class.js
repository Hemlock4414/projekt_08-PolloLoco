class Cloud extends MovableObject {
    x = 200;
    y = 20;
    height = 250;
    width = 500;
    speed = 0.2;


    constructor() {
        super().loadImage('img/cloud.png');

        this.x = Math.random() * 500; // zufällige Startposition (zwischen 200 und 500) der Wolke
        this.animate();
    }

    animate() {
        this.moveLeft();
    }

    moveLeft() {
        setInterval( () => {
            this.x -= this.speed; // Wolke bewegt sich nach links um x Pixel
        }, 1000 / 60); // 60 fps
    }
}