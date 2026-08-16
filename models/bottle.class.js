class Bottle extends CollidableObject {

    y = 360;   // Bodenposition, analog zur Boden-Flasche in throwable-object.class.js
    height = 70;
    width = 60;

    pickup_sound = new Audio('audio/bottle-collect.mp3');

    IMAGES = [
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = 200 + Math.random() * 2000; // verteilt über das gesamte Level
    }
}