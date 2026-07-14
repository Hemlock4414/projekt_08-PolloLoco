class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x;
    y = 280;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image(); // entspricht -> this.img = document.getElementById('myImage') <img id="image">;
        this.img.src = path;
    }

    draw(ctx) {

        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch(e) {
            console.log('Error loading image', e);
            console.log('Could not load image, ', this.img.src);
        }
    }
    
    drawFrame(ctx) {

        // Begrenzen auf welche Objekte das Kollisionsrechteck gezeichnet werden soll
        if(this instanceof Character || this instanceof Chicken) {  

            ctx.beginPath();   // Kollisionsrechteck zeichnen
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height); // Kollisionsrechteck mit Start-/Endpunkten des jeweiligen Objekts
            ctx.stroke();
            // this.ctx.rect(50, 50, 150, 80); zu Testzwecken
        }
    }
    
    /**
     * 
     * @param {Array} arr - ['img/image1.png', 'img/image2.png', ...]
     */
    loadImages(arr) {
        arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;  // JSON
        });
    }
}