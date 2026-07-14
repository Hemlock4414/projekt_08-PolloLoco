class MovableObject extends DrawableObject {

    speed = 10;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval( () => {
            if(this.y < 180) {          // Höhe des Bodens, auf dem der Charakter steht
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if(this instanceof ThrowableObject) {   // throwable objects sollen immer fallen
            return true;
        }    else {
        return this.y < 180;
        }
    }

    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x &&
            this.y < mo.y + mo.height;
    }

// Alternative mit Offset
//     isColliding(mo) {
//     return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
//         this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
//         this.x + this.offset.left < mo.x - mo.offset.right &&
//         this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
// }

    hit() {
        this.energy -= 5;
        if(this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isDead() {
        return this.energy == 0;
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit; // Differenz in ms
        timePassed = timePassed / 1000; // in Sekunden
        return timePassed < 1; // Ist das Objekt in den letzten 5 Sekunden getroffen worden?    
    }

    playAnimation(images) {

        // Walking animation
        let index = this.currentImage % images.length; 
        // let index = 0 % 6; -> 0 Rest 0
        // let index = 1 % 6; -> 0 Rest 1
        // let index = 2 % 6; -> 0 Rest 2   
        // let index = 7 % 6; -> 1 Rest 1
        // index = 0, 1, 2, 3, 4, 5, 0
        // Endlosschleife entsteht
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 30;
    }
}