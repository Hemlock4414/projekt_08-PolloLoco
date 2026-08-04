class Coin extends CollidableObject {
    height = 80;
    width = 80;
    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = 200 + Math.random() * 2000; // verteilt über das gesamte Level
        this.y = 50 + Math.random() * 100;   // schwebt in der Luft (oberhalb von groundY = 160)
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.currentImage = (this.currentImage + 1) % this.IMAGES.length;
            this.img = this.imageCache[this.IMAGES[this.currentImage]];
        }, 400); // langsames Pulsieren zwischen den beiden Bildern
    }
}