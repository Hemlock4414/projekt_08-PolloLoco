/**
 * Represents a moving cloud in the background.
 */
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

    /**
     * Creates a new cloud at a random position based on the start position.
     *
     * @param {number} startX - The starting position on the x-axis.
     */
    constructor(startX) {
        super().loadImage(this.IMAGES_CLOUD[0]);
        this.loadImages(this.IMAGES_CLOUD);
        this.x = startX + Math.random() * 500;
        this.animate();
    }

    /**
     * Starts the cloud movement.
     */
    animate() {
        this.moveLeft();
    }

    /**
     * Moves the cloud continuously to the left.
     */
    moveLeft() {
        setInterval( () => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}