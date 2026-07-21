class Cloud extends MovableObject {
    x = 200;
    y = 20;
    height = 250;
    width = 500;
    speed = 0.1;

    IMAGES_CLOUD = [
        'img/5_background/layers/4_clouds/1.png',
        'img/5_background/layers/4_clouds/2.png'
    ]

    constructor() {
        super().loadImage(this.IMAGES_CLOUD[0]);

        this.loadImages(this.IMAGES_CLOUD);

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