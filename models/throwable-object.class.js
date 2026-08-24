/**
 * Represents a throwable bottle that can rotate in the air
 * and create a splash effect when it hits the ground.
 */
class ThrowableObject extends MovableObject {

    isSplashing = false;
    hasHit = false;

    splash_sound = new Audio('assets/audio/bottle-smash.mp3');

    IMAGES_ROTATION = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ]

    IMAGES_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ]

    /**
     * Creates a new throwable bottle.
     *
     * @param {number} x - The starting x-position.
     * @param {number} y - The starting y-position.
     * @param {'left'|'right'} direction - The throwing direction.
     */
    constructor(x, y, direction = 'right') {
        super().loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');

        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);

        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.groundY = 370;
        this.direction = direction;

        this.throw();
        this.animate();

        this.splash_sound.volume = 0.4;
    }

    /**
     * Starts the splash animation when the bottle hits the ground.
     */
    onGroundHit() {
        this.playSplash(() => { this.hasHit = true; });
    }

    /**
     * Throws the bottle in the specified direction.
     */
    throw() {
        this.speedY = 20;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (!this.isSplashing) {
                this.x += this.direction === 'left' ? -10 : 10;
            }
        }, 25);
    }

    /**
     * Starts the bottle rotation animation.
     */
    animate() {
        this.rotationInterval = setInterval(() => {
            if (!this.isSplashing) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 1000 / 60);
    }

    /**
     * Plays the splash animation after the bottle hits the ground.
     *
     * @param {Function} onComplete - Callback executed after the animation finishes.
     */
    playSplash(onComplete) {
        if (this.isSplashing) return;
        this.isSplashing = true;
        this.speedY = 0;
        playSound(this.splash_sound);

        let i = 0;
        this.splashInterval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_SPLASH[i]];
            i++;
            if (i >= this.IMAGES_SPLASH.length) {
                clearInterval(this.splashInterval);
                this.stop();
                if (onComplete) onComplete();
            }
        }, 1000 / 20);
    }

    /**
     * Stops the bottle's movement and rotation intervals.
     */
    stop() {
        clearInterval(this.throwInterval);
        clearInterval(this.rotationInterval);
    }
}