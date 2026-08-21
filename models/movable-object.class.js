/**
 * Represents a movable game object.
 *
 * Provides movement, gravity, collision and animation functionality.
 */
class MovableObject extends DrawableObject {

    speed = 10;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    groundY = 160;

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    /**
     * Applies gravity to the object and handles ground contact.
     */
    applyGravity() {
        setInterval( () => {
            if (this.y < this.groundY || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                if (this.y > this.groundY) {
                    this.y = this.groundY;
                    this.speedY = 0;
                    this.onGroundHit();
                }
            }
        }, 1000 / 60);
    }

    /**
     * Handles actions when the object hits the ground.
     *
     * Can be overridden by child classes.
     */
    onGroundHit() {
        // Default
    }

    /**
     * Checks whether the object is above the ground.
     *
     * @returns {boolean} True if the object is above the ground.
     */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /**
     * Checks whether this object is colliding with another object.
     *
     * @param {MovableObject} mo - The object to check for collision.
     * @returns {boolean} True if the objects are colliding.
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Reduces the object's energy if enough time has passed since the last hit.
     */
    hit() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        if (timePassed > 1) {
            this.energy -= 5;
            if(this.energy < 0) {
                this.energy = 0;
            }
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks whether the object has no energy left.
     *
     * @returns {boolean} True if the object's energy is zero.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Checks whether the object has been hit recently.
     *
     * @returns {boolean} True if the last hit occurred less than one second ago.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;    
    }

    /**
     * Plays the next frame of the specified animation.
     *
     * @param {string[]} images - The image paths of the animation.
     */
    playAnimation(images) {

        this.animationCounter = (this.animationCounter || 0) + 1;
        if (this.animationCounter % 4 !== 0) return;
        let index = this.currentImage % images.length; 
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump.
     */
    jump() {
        this.speedY = 22;
    }
}