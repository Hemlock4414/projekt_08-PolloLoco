class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;

    IMAGES_WALKING = [
        'img/endboss.png',
        'img/endboss-2.png',
        'img/endboss-3.png',
        'img/endboss-4.png'
    ];  

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2200;
        this.animate();
 
    }

    animate() {
        setInterval( () => {

            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}