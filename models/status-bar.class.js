/**
 * Represents a status bar for health, bottles, coins or the endboss.
 */
class StatusBar extends DrawableObject {

    percentage = 100;
    hidden = false;

    IMAGES_HEALTH = [
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    IMAGES_BOTTLE = [ 
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    IMAGES_COIN = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png' 
    ];

    IMAGES_ENDBOSS = [
        'assets/img/7_statusbars/2_statusbar_endboss/green/green0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/green/green100.png'
    ];

    /**
     * Creates a new status bar.
     *
     * @param {number} x - The x-position of the status bar.
     * @param {number} y - The y-position of the status bar.
     * @param {'health'|'bottle'|'coin'|'endboss'} type - The type of status bar.
     */
    constructor(x, y, type) {
        super();

        if (type === 'health') {
            this.IMAGES = this.IMAGES_HEALTH;
        } else if (type === 'bottle') {
            this.IMAGES = this.IMAGES_BOTTLE;
        } else if (type === 'coin') {
            this.IMAGES = this.IMAGES_COIN;
        } else if (type === 'endboss') {
            this.IMAGES = this.IMAGES_ENDBOSS;
        } else {
            console.log('Unknown status bar type:', type);
        }

        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the status bar to the specified percentage.
     *
     * @param {number} percentage - The current percentage value.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the image index based on the current percentage.
     *
     * @returns {number} The index of the image representing the percentage.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        else if (this.percentage >= 80) return 4;
        else if (this.percentage >= 60) return 3;
        else if (this.percentage >= 40) return 2;
        else if (this.percentage >= 20) return 1;
        else return 0;
    }
}