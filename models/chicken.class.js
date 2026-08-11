class Chicken extends MovableObject {

    y = 330;
    height = 100;
    width = 120;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    hasDied = false; // verhindert, dass das Entfernen mehrfach ausgelöst wird

    hit() {
        this.energy = 0;
    }

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);

        this.x = 650 + Math.random() * 800; // zufällige Startposition (zwischen 200 und 700) aller Chickens
        this.speed = 0.15 + Math.random() * 0.25; // zufällige Geschwindigkeit aller Chickens

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) return; // totes Chicken bewegt sich nicht mehr
            this.moveLeft();
        }, 1000 / 60); // 60 fps

        setInterval(() => {
            if (this.isDead()) {
                this.playDeadAnimation();
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }

    // Zeigt einmalig das Dead-Bild und entfernt das Chicken nach 1 Sekunde aus dem Level
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