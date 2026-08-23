/**
 * Represents a drawable object in the game.
 *
 * Provides basic image loading and rendering functionality.
 */
class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x;
    y = 280;
    height = 150;
    width = 100;

    /**
     * Loads an image from the specified path.
     *
     * @param {string} path - The path to the image.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {

        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch(e) {
            console.log('Error loading image', e);
            console.log('Could not load image, ', this.img.src);
        }
    }

    /**
     * Loads multiple images into the image cache.
     *
     * @param {string[]} arr - An array of image paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
        });
    }
    
    /**
     * Draws the collision frame of supported game objects.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    // drawFrame(ctx) {

    //     if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof Coin || this instanceof Bottle ) {  

    //         ctx.beginPath();
    //         ctx.lineWidth = '5';
    //         ctx.strokeStyle = 'blue';
    //         ctx.rect(this.x, this.y, this.width, this.height);
    //         ctx.stroke();
    //     }
    // }

    /**
     * Draws the real collision frame of supported game objects including the offsets.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof Coin || this instanceof Bottle) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.left - this.offset.right,
                this.height - this.offset.top - this.offset.bottom
            );
            ctx.stroke();
        }
    }
}