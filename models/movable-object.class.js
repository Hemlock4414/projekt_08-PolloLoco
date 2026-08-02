class MovableObject extends DrawableObject {

    speed = 10;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval( () => {
            if (this.y < 160 || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                if (this.y > 160) {      // Höhe des Bodens auf dem der Charakter steht
                    this.y = 160;
                    this.speedY = 0;
                }
            }
        }, 1000 / 60);
    }

    isAboveGround() {
        if(this instanceof ThrowableObject) {   // throwable objects sollen immer fallen
            return true;
        }    else {
        return this.y < 160;
        }
    }

    // grundsätzlich symmetrisch machen (betrifft alle Objekte für jede Annäherung von links):
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.x < mo.x + mo.width &&
            this.y + this.height > mo.y &&
            this.y < mo.y + mo.height;
    }

    // Standard-Kollisionsmethode
    // isColliding(mo) {
    //     return this.x + this.width > mo.x &&
    //         this.y + this.height > mo.y &&
    //         this.x < mo.x &&
    //         this.y < mo.y + mo.height;
    // }

    // Alternative mit Offset (Offset ist hier ein Wert, der die Kollisionsbox verkleinert, damit der Charakter nicht schon bei einer leichten Berührung getroffen wird)
    //     isColliding(mo) {
    //     return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
    //         this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
    //         this.x + this.offset.left < mo.x - mo.offset.right &&
    //         this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    // }

    // ursprüngliche Kollisionsmethode
    // if (character.x + character.width > enemy.x &&
    //     character.y + character.height > enemy.y &&
    //     character.x < enemy.x &&
    //     character.y < enemy.y + enemy.height)

    hit() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        if (timePassed > 1) {  // nur alle 1 Sekunde Schaden nehmen
            this.energy -= 5;
            if(this.energy < 0) {
                this.energy = 0;
            }
            this.lastHit = new Date().getTime();
        }
    }

    isDead() {
        return this.energy == 0;
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit; // Differenz in ms
        timePassed = timePassed / 1000; // Differenz in Sekunden
        return timePassed < 1; // Ist das Objekt in den letzten 1 Sekunden getroffen worden?    
    }

    playAnimation(images) {

        // Walking animation
        this.animationCounter = (this.animationCounter || 0) + 1;
        if (this.animationCounter % 6 !== 0) return; // nur jeden 6. Tick ein neues Bild (höhere Zahl = langsamer)
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
        this.speedY = 22;
    }
}