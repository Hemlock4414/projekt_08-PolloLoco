/**
 * Represents the main playable character.
 *
 * Handles movement, animations, sounds and camera movement.
 */
class Character extends MovableObject {

    height = 280;
    y = 160;
    x = 0;
    world;

    ANIMATION_SPEED = 12;

    offset = {
        top: 120,
        bottom: 0,
        left: 0,
        right: 30
    };

    walking_sound = new Audio('assets/audio/sandwalking_step.wav');
    hurt_sound = new Audio('assets/audio/man-oof.wav');
    dead_sound = new Audio('assets/audio/man-final-hurt.wav');
    jump_sound = new Audio('assets/audio/man-jump.mp3');
    stomp_sound = new Audio('assets/audio/stomp.wav');
    idle_long_sound = new Audio('assets/audio/cartoony_snoring.wav');

    wasHurt = false;
    wasDead = false;
    wasIdleLong = false;

    IMAGES_WALKING = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'assets/img/2_character_pepe/3_jump/J-31.png',
        'assets/img/2_character_pepe/3_jump/J-32.png',
        'assets/img/2_character_pepe/3_jump/J-33.png',
        'assets/img/2_character_pepe/3_jump/J-34.png',
        'assets/img/2_character_pepe/3_jump/J-35.png',
        'assets/img/2_character_pepe/3_jump/J-36.png',
        'assets/img/2_character_pepe/3_jump/J-37.png',
        'assets/img/2_character_pepe/3_jump/J-38.png',
        'assets/img/2_character_pepe/3_jump/J-39.png'
    ];
    
    IMAGES_DEAD = [
        'assets/img/2_character_pepe/5_dead/D-51.png',
        'assets/img/2_character_pepe/5_dead/D-52.png',
        'assets/img/2_character_pepe/5_dead/D-53.png',
        'assets/img/2_character_pepe/5_dead/D-54.png',
        'assets/img/2_character_pepe/5_dead/D-55.png',
        'assets/img/2_character_pepe/5_dead/D-56.png',
        'assets/img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'assets/img/2_character_pepe/4_hurt/H-41.png',
        'assets/img/2_character_pepe/4_hurt/H-42.png',
        'assets/img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_IDLE_SHORT = [
        'assets/img/2_character_pepe/1_idle/idle/I-1.png',
        'assets/img/2_character_pepe/1_idle/idle/I-2.png',
        'assets/img/2_character_pepe/1_idle/idle/I-3.png',
        'assets/img/2_character_pepe/1_idle/idle/I-4.png',
        'assets/img/2_character_pepe/1_idle/idle/I-5.png',
        'assets/img/2_character_pepe/1_idle/idle/I-6.png',
        'assets/img/2_character_pepe/1_idle/idle/I-7.png',
        'assets/img/2_character_pepe/1_idle/idle/I-8.png',
        'assets/img/2_character_pepe/1_idle/idle/I-9.png',
        'assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ]

    IMAGES_IDLE_LONG = [
        'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ]

    /**
     * Creates a new character and initializes its animations and sounds.
     */
    constructor() {
        super().loadImage(this.IMAGES_IDLE_SHORT[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE_SHORT);
        this.loadImages(this.IMAGES_IDLE_LONG);
        this.walking_sound.loop = true;
        this.applyGravity();
        this.lastMoveTime = Date.now();
        this.animate();
    }

    /**
     * Starts the character's movement and animation loops.
     */
    animate() {
        this.movementInterval = setInterval(() => {
            this.handleMovement();
            this.handleCamera();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            this.handleAnimation();
        }, 1000 / 60);
    }

    /**
     * Handles character movement based on keyboard input.
     */
    handleMovement() {
        if (!this.world) return;
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.startWalkingSound();
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.startWalkingSound();
        }
        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.jump();
            playSound(this.jump_sound);
        }
    }

    /**
     * Updates the camera position to follow the character.
     */
    handleCamera() {
        if (!this.world) return;

        let targetOffset = this.otherDirection
            ? this.world.canvas.width - 300 - this.width
            : 150;

        let targetCameraX = -this.x + targetOffset;

        let smoothing = 0.25;

        this.world.camera_x +=
            (targetCameraX - this.world.camera_x) * smoothing;
    }

    /**
     * Updates the character's animation based on its current state.
     */
    handleAnimation() {
        if (this.isDead()) {
            this.handleDeadAnimation();
        } else if (this.isHurt()) {
            this.handleHurtAnimation();
        } else if (this.isAboveGround() || this.speedY > 0) {
            this.handleJumpAnimation();
        } else if (this.world && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
            this.handleWalkingAnimation();
        } else {
            this.handleIdleAnimation();
        }
    }

    /**
     * Handles the character's death animation and sound.
     */
    handleDeadAnimation() {
        this.playAnimation(this.IMAGES_DEAD);

        this.stopWalkingSound();
        this.stopIdleLongSound();

        this.wasIdleLong = false;

        if (!this.wasDead) {
            playSound(this.dead_sound);
        }

        this.wasDead = true;
    }

    /**
     * Handles the character's hurt animation and sound.
     */
    handleHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT);

        this.stopWalkingSound();
        this.stopIdleLongSound();

        this.wasIdleLong = false;
        this.lastMoveTime = Date.now();

        if (!this.wasHurt) {
            playSound(this.hurt_sound);
        }

        this.wasHurt = true;
    }

    /**
     * Handles the character's jumping animation.
     */
    handleJumpAnimation() {
        this.playAnimation(this.IMAGES_JUMPING);

        this.stopWalkingSound();
        this.stopIdleLongSound();

        this.wasIdleLong = false;
        this.wasHurt = false;
        this.wasDead = false;
        this.lastMoveTime = Date.now();
    }

    /**
     * Handles the character's walking animation.
     */
    handleWalkingAnimation() {
        this.playAnimation(this.IMAGES_WALKING);

        this.lastMoveTime = Date.now();

        this.stopIdleLongSound();
        this.wasIdleLong = false;

        this.wasHurt = false;
        this.wasDead = false;
    }

    /**
     * Handles the character's idle animations.
     *
     * Switches between short and long idle animations
     * depending on how long the character has been inactive.
     */
    handleIdleAnimation() {
        this.stopWalkingSound();

        let idleTime = Date.now() - this.lastMoveTime;

        if (idleTime > 15000) {
            this.handleLongIdle();
        } else {
            this.handleShortIdle();
        }
    }

    /**
     * Plays the long idle animation and sound.
     */
    handleLongIdle() {
        this.playAnimation(this.IMAGES_IDLE_LONG);

        if (!this.wasIdleLong) {
            playSound(this.idle_long_sound);
        }

        this.wasIdleLong = true;
    }

    /**
     * Plays the short idle animation.
     */
    handleShortIdle() {
        this.playAnimation(this.IMAGES_IDLE_SHORT);

        this.stopIdleLongSound();
        this.wasIdleLong = false;
    }

    /**
     * Checks whether the character is stomping an enemy.
     *
     * @param {MovableObject} enemy - The enemy being checked.
     * @returns {boolean} True if the character is stomping the enemy.
     */
    isStomping(enemy) {
        let characterBottom = this.y + this.height;
        let enemyTop = enemy.y;
        return this.speedY < 0 && characterBottom < enemyTop + (enemy.height / 2);
    }
    
    /**
     * Starts the walking sound if sound is not muted.
     */
    startWalkingSound() {
        if (soundMuted) return;
        if (this.walking_sound.paused) {
            this.walking_sound.play().catch(() => {});
        }
    }

    /**
     * Stops the walking sound and resets its playback position.
     */
    stopWalkingSound() {
        this.walking_sound.pause();
        this.walking_sound.currentTime = 0;
    }

    /**
     * Stops the long idle sound and resets its playback position.
     */
    stopIdleLongSound() {
        this.idle_long_sound.pause();
        this.idle_long_sound.currentTime = 0;
    }

    /**
     * Stops the character's movement and animation loops.
     */
    stop() {
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        this.stopWalkingSound();
        this.stopIdleLongSound();
    }

    /**
     * Plays the next frame of the specified animation.
     *
     * @param {string[]} images - The image paths of the animation.
     */
    playAnimation(images) {
        this.animationCounter = (this.animationCounter || 0) + 1;
        if (this.animationCounter % this.ANIMATION_SPEED !== 0) return;
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Registers player activity: resets the idle timer and stops
     * the long idle sound/state. Call this from any action that
     * should count as "not idle", even if it has no own animation.
     */
    registerActivity() {
        this.lastMoveTime = Date.now();
        this.stopIdleLongSound();
        this.wasIdleLong = false;
    }
}