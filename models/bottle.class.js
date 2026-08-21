/**
 * Represents a collectible bottle in the game.
 */
class Bottle extends CollidableObject {

    y = 360;
    height = 70;
    width = 60;

    static pickup_sound = new Audio('assets/audio/bottle-collect.mp3');

    IMAGES = [
        'assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
        'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    ];

    /**
     * Creates a new bottle at a random position.
     */
    constructor() {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = 200 + Math.random() * 2000;
        Bottle.pickup_sound.volume = 0.1;
    }
}