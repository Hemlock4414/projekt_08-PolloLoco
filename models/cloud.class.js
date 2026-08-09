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

    constructor(startX) {
        super().loadImage(this.IMAGES_CLOUD[0]);
        this.loadImages(this.IMAGES_CLOUD);
        this.x = startX + Math.random() * 500; // Startposition + etwas Zufallsstreuung
        this.animate();
    }

    animate() {
        this.moveLeft();
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
            if (this.x + this.width < 0 && this.world) {
                this.x = this.world.level.level_end_x + 500 + Math.random() * 1500;
            }
        }, 1000 / 60);
    }
}