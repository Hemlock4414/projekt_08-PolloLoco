class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;
    energy = 100;

    speed = 1;
    alertRange = 500;    // Abstand, ab dem der Boss den Character bemerkt
    attackRange = 120;   // Abstand, ab dem der Boss angreift statt zu laufen

    isAlerted = false;   // wurde der Boss schon "geweckt"?
    isMoving = false;    // läuft der Boss gerade auf den Character zu?

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ]

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ]

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ]

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G24.png'
    ]

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]); // Boss steht zunächst bewegungslos da
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2200;
        this.animate();
    }

    animate() {

        // Bewegungslogik: prüft Alarm-Zustand und bewegt den Boss auf den Character zu
        setInterval(() => {
            if (this.isDead()) return;

            if (!this.isAlerted) {
                this.checkAlert();
            } else if (this.isMoving && !this.isHurt()) {
                if (this.world.character.x < this.x) {
                    this.moveLeft();
                    this.otherDirection = false;
                } else {
                    this.moveRight();
                    this.otherDirection = true;
                }
            }
        }, 1000 / 60);

        // Animationslogik: wählt je nach Zustand das passende Bildset
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (!this.isAlerted) {
                // Boss steht still, keine laufende Animation nötig
            } else if (this.isInAttackRange()) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }

    // Prüft die Distanz zum Character, löst bei Unterschreitung die Alert-Animation aus
    checkAlert() {
        if (!this.world) return;
        let distance = Math.abs(this.x - this.world.character.x);
        if (distance < this.alertRange) {
            this.isAlerted = true;
            this.playAlertAnimation();
        }
    }

    // Spielt die Alert-Bilder einmal komplett durch, danach beginnt die Bewegung
    playAlertAnimation() {
        let i = 0;
        let alertInterval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_ALERT[i]];
            i++;
            if (i >= this.IMAGES_ALERT.length) {
                clearInterval(alertInterval);
                this.isMoving = true;
            }
        }, 150);
    }

    isInAttackRange() {
        if (!this.world) return false;
        return Math.abs(this.x - this.world.character.x) < this.attackRange;
    }
}