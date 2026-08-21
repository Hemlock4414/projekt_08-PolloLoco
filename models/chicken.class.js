/**
 * Represents a chicken enemy.
 *
 * Handles movement, animations and death behavior.
 */
class Chicken extends MovableObject {

    y = 330;
    height = 100;
    width = 120;
    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    hasDied = false;

    /**
     * Sets the chicken's energy to zero.
     */
    hit() {
        this.energy = 0;
    }

    /**
     * Creates a new chicken enemy at a random position and speed.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);

        this.x = 650 + Math.random() * 1100;
        this.speed = 0.20 + Math.random() * 0.30;

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.animate();
    }

    /**
     * Starts the movement and animation loops of the chicken.
     */
    animate() {
        setInterval(() => {
            if (this.isDead()) return;
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playDeadAnimation();
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }

    /**
     * Plays the death animation and removes the chicken after a delay.
     */
    playDeadAnimation() {
        if (this.hasDied) return;
        this.hasDied = true;
        this.img = this.imageCache[this.IMAGES_DEAD[0]];

        setTimeout(() => {
            let index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }, 1000);
    }
}