class Chicken extends MovableObject {

    y = 360;
    height = 100;
    width = 120;
    IMAGES_WALKING = [
        'img/chicken-walk1.png',
        'img/chicken-walk2.png',
    ];

    constructor() {
        super().loadImage('img/chicken.png');

        this.x = 200 + Math.random() * 500; // zufällige Startposition (zwischen 200 und 700) aller Chickens
        this.speed = 0.15 + Math.random() * 0.25; // zufällige Geschwindigkeit aller Chickens

        this.loadImages(this.IMAGES_WALKING);

        this.animate();
    }

    animate() {
        setInterval( () => {    
            moveLeft();
        }, 1000 / 60); // 60 fps

        setInterval( () => {

            this.playAnimation(this.IMAGES_WALKING);
        }, 100);
    }
}