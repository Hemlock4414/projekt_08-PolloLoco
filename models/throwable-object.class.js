class ThrowableObject extends MovableObject {

    isSplashing = false;
    hasHit = false;

    splash_sound = new Audio('audio/bottle-smash.mp3');

    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ]

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ]

    constructor(x, y, direction = 'right') {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');

        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);

        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.groundY = 370; // gleiche Bodenhöhe wie die liegende Flasche
        this.direction = direction;

        this.throw();
        this.animate();

        this.splash_sound.volume = 0.4;
    }

    onGroundHit() {
        // Flasche ist am Boden aufgeschlagen, ohne Gegner getroffen zu haben
        this.playSplash(() => { this.hasHit = true; });
    }

    throw() {
        this.speedY = 20;   // initiale Wurfgeschwindigkeit nach oben
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (!this.isSplashing) {
                this.x += this.direction === 'left' ? -10 : 10;   // horizontale Geschwindigkeit nach rechts
            }
        }, 25);
    }

    // Rotation, solange die Flasche fliegt
    animate() {
        this.rotationInterval = setInterval(() => {
            if (!this.isSplashing) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 1000 / 60);
    }

    // Wird von außen (World) beim Treffer aufgerufen
    playSplash(onComplete) {
        if (this.isSplashing) return; // nicht doppelt starten
        this.isSplashing = true;
        this.speedY = 0; // Flasche bleibt an Ort und Stelle stehen für den Splash
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
        }, 1000 / 20); // etwas langsamer, damit der Splash sichtbar ist (~300ms gesamt)
    }

    // Räumt alle Intervalle der Flasche auf (verhindert das Leak von vorher)
    stop() {
        clearInterval(this.throwInterval);
        clearInterval(this.rotationInterval);
    }
}