/**
 * Represents a collectible coin in the game.
 */
class Coin extends CollidableObject {

    height = 120;
    width = 120;

    static pickup_sound = new Audio('assets/audio/coin-pickup-sfx-2.wav');

    offset = {
        top: 40,
        bottom: 40,
        left: 30,
        right: 30
    };

    IMAGES = [
        'assets/img/8_coin/coin_1.png',
        'assets/img/8_coin/coin_2.png'
    ];

    /**
     * Creates a new coin at a calculated position.
     *
     * @param {number} index - The position index of the coin.
     * @param {number} total - The total number of coins.
     */
    constructor(index = 0, total = 10) {
        super().loadImage(this.IMAGES[0]);

        this.loadImages(this.IMAGES);

        const startX = 200;
        const maxX = 1900;
        const spacing = (maxX - startX) / (total - 1);

        this.x = startX + index * spacing + Math.random() * (spacing * 0.3);

        this.y = 90 + Math.random() * 100;

        this.animate();
    }

    /**
     * Animates the coin by cycling through its images.
     */
    animate() {
        setInterval(() => {
            this.currentImage = (this.currentImage + 1) % this.IMAGES.length;
            this.img = this.imageCache[this.IMAGES[this.currentImage]];
        }, 700);
    }
}