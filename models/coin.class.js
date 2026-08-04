class Coin extends CollidableObject {

    height = 120;

    width = 120;

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(index = 0) {
        super().loadImage(this.IMAGES[0]);

        this.loadImages(this.IMAGES);

        // Größerer, garantierter Mindestabstand statt rein zufälliger Verteilung über das ganze Level
        this.x = 200 + index * 250 + Math.random() * 100;

        this.y = 90 + Math.random() * 100; // schwebt niedriger als zuvor, weiterhin in der Luft

        this.animate();
    }

    // Langsames Pulsieren zwischen den beiden Bildern (kein Gehen wie bei Chicken, daher eigene, einfache Animation statt playAnimation())
    animate() {
        setInterval(() => {
            this.currentImage = (this.currentImage + 1) % this.IMAGES.length;
            this.img = this.imageCache[this.IMAGES[this.currentImage]];
        }, 700);
    }
}