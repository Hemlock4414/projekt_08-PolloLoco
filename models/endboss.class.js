/**
 * Represents the endboss of the game.
 *
 * Handles movement, attacks, animations and health.
 */
class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;

    energy = 100;
    speed = 4;
    damage = 25;

    alertRange = 500;
    attackRange = 250;

    isAlerted = false;
    isMoving = false;

    hasDied = false;
    deadAnimationIndex = 0;

    alert_sound = new Audio('assets/audio/endboss_alert.mp3');
    hurt_sound = new Audio('assets/audio/endboss-hurt.mp3');
    dead_sound = new Audio('assets/audio/endboss-death.mp3');

    IMAGES_WALKING = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ]

    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ]

    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ]

    IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ]

    /**
     * Creates a new endboss and loads its animations.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2200;
        this.animate();
    }

    /**
     * Starts the endboss movement and animation loops.
     */
    animate() {
        setInterval(() => {
            this.handleMovement();
        }, 1000 / 60);

        setInterval(() => {
            this.handleAnimation();
        }, 150);
    }

    /**
     * Handles the endboss movement and alert state.
     */
    handleMovement() {
        if (this.isDead()) return;
        if (!this.isAlerted) {
            this.checkAlert();
            return;
        }
        if (this.isMoving && !this.isHurt() && !this.isTouchingCharacter()) {
            if (this.world.character.x < this.x) {
                this.moveLeft();
                this.otherDirection = false;
            } else {
                this.moveRight();
                this.otherDirection = true;
            }
        }
    }

    /**
     * Updates the endboss animation based on its current state.
     */
    handleAnimation() {
        if (this.isDead()) {
            this.playDeadAnimation();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (!this.isAlerted) {
            return;
        } else if (this.isInAttackRange()) {
            this.playAnimation(this.IMAGES_ATTACK);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Reduces the endboss energy and plays the corresponding sound.
     */
    hit() {
        this.energy -= this.damage;
        if (this.energy <= 0) {
            this.energy = 0;
            playSound(this.dead_sound);
        } else {
            playSound(this.hurt_sound);
        }
        this.lastHit = new Date().getTime();
    }

    /**
     * Checks whether the character is within the alert range.
     */
    checkAlert() {
        if (!this.world) return;
        let distance = Math.abs(this.x - this.world.character.x);
        if (distance < this.alertRange) {
            this.isAlerted = true;
            playSound(this.alert_sound);
            this.playAlertAnimation();
        }
    }

    /**
     * Plays the alert animation and starts movement afterwards.
     */
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

    /**
     * Checks whether the character is within attack range.
     *
     * @returns {boolean} True if the character is within attack range.
     */
    isInAttackRange() {
        if (!this.world) return false;
        let character = this.world.character;
        let distance;
        if (this.x < character.x) {
            distance = character.x - (this.x + this.width);
        } else {
            distance = this.x - (character.x + character.width);
        }
        return distance < this.attackRange;
    }

    /**
     * Checks whether the endboss is touching the character.
     *
     * @returns {boolean} True if the endboss is touching the character.
     */
    isTouchingCharacter() {
        let character = this.world.character;
        return this.x < character.x + character.width &&
            this.x + this.width > character.x &&
            this.y < character.y + character.height &&
            this.y + this.height > character.y;
    }

    /**
     * Plays the endboss death animation frame by frame.
     */
    playDeadAnimation() {
        if (this.hasDied) return;
        if (this.deadAnimationIndex >= this.IMAGES_DEAD.length) {
            this.hasDied = true;
            return;
        }
        this.img = this.imageCache[this.IMAGES_DEAD[this.deadAnimationIndex]];
        this.deadAnimationIndex++;
    }
}