class Coin extends CollidableObject {

    height = 120;

    width = 120;

    offset = {
        top: 40,
        bottom: 40,
        left: 30,
        right: 30
    };

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(index = 0, total = 10) {
        super().loadImage(this.IMAGES[0]);

        this.loadImages(this.IMAGES);

        const startX = 200;
        const maxX = 1900; // bewusster Sicherheitsabstand vor dem Endboss (x = 2200)
        const spacing = (maxX - startX) / (total - 1);

        this.x = startX + index * spacing + Math.random() * (spacing * 0.3);

        this.y = 90 + Math.random() * 100;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.currentImage = (this.currentImage + 1) % this.IMAGES.length;
            this.img = this.imageCache[this.IMAGES[this.currentImage]];
        }, 700);
    }
}