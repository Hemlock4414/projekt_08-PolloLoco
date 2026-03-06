class Character extends MovableObject {

    height = 280;
    y = 155;
    IMAGES_WALKING = [
        'img/character-walk1.png',
        'img/character-walk2.png',
    ];

    IMAGES_JUMPING = [
        'img/character-jump1.png',
        'img/character-jump2.png',
    ];
    
    IMAGES_DEAD = [
        'img/character-dead.png'
    ];

    IMAGES_HURT = [
        'img/character-hurt.png'
    ];
    
    world;
    walking_sound = new Audio('audio/walking.mp3');

    constructor() {
        super().loadImage('img/character.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
    }

    animate() {

        setInterval( () => {
            if (this.world && this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                this.walking_sound.play();
            }
            
            if(this.world && this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true; // Charakter schaut nach links durch Spiegeln
                this.walking_sound.play();
            }

            if(this.world && this.world.keyboard.UP && !this.isAboveGround()) {
                this.jump();
            }

            if (this.world) {
                this.world.camera_x = -this.x + 100;  // Kamera folgt dem Charakter
            };
        }, 1000 / 60); // 60 fps

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);

            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);

            } else if (this.isAboveGround() || this.speedY > 0) {
                this.playAnimation(this.IMAGES_JUMPING);
                
            } else {
                if (this.world && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 1000 / 60);
    }

    jump() {
        this.speedY = 30;
    }
}
