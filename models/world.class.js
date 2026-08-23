/**
 * Represents the game world and manages game objects, collisions and rendering.
 */
class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    statusBarHealth = new StatusBar(40, 0, 'health');
    statusBarCoin = new StatusBar(40, 50, 'coin');
    statusBarBottle = new StatusBar(40, 100, 'bottle');
    statusBarEndboss = new StatusBar(480, 8, 'endboss');
    throwableObjects = [];
    lastThrowTime = 0;
    throwCooldownMs = 1500;

    collectedBottles = 0;
    totalBottles = 0;
    collectedCoins = 0;
    totalCoins = 0;

    gameWon = false;
    gameLost = false;
    gameLostTriggered = false;

    gameWonImage = new Image();
    gameLostImage = new Image();

    /**
     * Creates a new game world.
     *
     * @param {HTMLCanvasElement} canvas - The canvas used for rendering.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.gameWonImage.src = 'assets/img/You won, you lost/You won A.png';
        this.gameLostImage.src = 'assets/img/You won, you lost/Game Over.png';
        this.draw();
        this.setWorld();
        this.totalCoins = this.level.coins.length;
        this.totalBottles = this.level.bottles.length;
        this.statusBarEndboss.hidden = true;
        this.run();
    }

    /**
     * Assigns the world reference to the game objects.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
        this.level.clouds.forEach(cloud => cloud.world = this);
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    }

    /**
     * Starts the game loop.
     */
    run() {
        this.runInterval = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkThrowableCollisions();
            this.checkCollectableCollisions()
            this.checkGameStatus();
        }, 1000 / 60);
    }

    /**
     * Stops the game loop and character animations.
     */
    stop() {
        this.stopped = true;
        clearInterval(this.runInterval);
        this.character.stop();
    }

    /**
     * Creates a throwable bottle when the player presses the throw key.
     */
    checkThrowObjects() {
        let now = Date.now();
        if (this.keyboard.SPACE 
            && this.collectedBottles > 0 
            && now - this.lastThrowTime >= this.throwCooldownMs) {
            let direction = this.character.otherDirection ? 'left' : 'right';
            let offsetX = this.character.otherDirection ? -30 : 100;
            let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + 100, direction);
            this.throwableObjects.push(bottle);
            this.collectedBottles--;
            this.lastThrowTime = now;
        }
    }

    /**
     * Checks for collisions between the character and enemies.
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (!this.character.isColliding(enemy)) return;
            if (enemy.isDead()) return;

            if (enemy instanceof Endboss) {
                this.character.hit();
            } else if (this.character.isStomping(enemy)) {
                enemy.energy = 0;
                playSound(this.character.stomp_sound);
            } else {
                this.character.hit();
            }
        });
    }

    /**
     * Checks for collisions between throwable bottles and enemies.
     */
    checkThrowableCollisions() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.isSplashing) return;

            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !enemy.isDead()) {
                    enemy.hit();
                    bottle.playSplash(() => {
                        bottle.hasHit = true;
                    });
                }
            });
        });
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.hasHit);
    }

    /**
    * Checks for collisions between the character and collectable objects.
    */
    checkCollectableCollisions() {
        this.checkBottleCollisions();
        this.checkCoinCollisions();
    }

    /**
     * Checks for bottle collisions and collects bottles touched by the character.
     */
    checkBottleCollisions() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.collectedBottles++;
                bottle.collected = true;
                playSound(Bottle.pickup_sound);
            }
        });

        this.level.bottles = this.level.bottles.filter(
            bottle => !bottle.collected
        );
    }

    /**
     * Checks for coin collisions and collects coins touched by the character.
     */
    checkCoinCollisions() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.collectedCoins++;
                coin.collected = true;
                playSound(Coin.pickup_sound);
            }
        });

        this.level.coins = this.level.coins.filter(
            coin => !coin.collected
        );
    }

    /**
     * Checks whether the game has been won or lost.
     */
    checkGameStatus() {
        if (this.gameWon || this.gameLost ||
            this.gameWonTriggered || this.gameLostTriggered) return;

        if (this.endboss && this.endboss.isDead()) {
            this.triggerGameWon();
        } else if (this.character.isDead()) {
            this.triggerGameLost();
        }
    }

    /**
     * Triggers the game won state after a short delay.
     */
    triggerGameWon() {
        this.gameWonTriggered = true;

        setTimeout(() => {
            this.gameWon = true;
            clearInterval(this.runInterval);
            this.character.stop();
            showRestartButton();
        }, 2500);
    }

    /**
     * Triggers the game lost state after a short delay.
     */
    triggerGameLost() {
        this.gameLostTriggered = true;

        setTimeout(() => {
            this.gameLost = true;
            clearInterval(this.runInterval);
            this.character.stop();
            showRestartButton();
        }, 2500);
    }

    /**
     * Renders the current game state on the canvas.
     */
    draw() {
        if (this.stopped) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();

        if (!this.gameWon && !this.gameLost) {
            this.drawGameObjects();
            this.drawStatusBars();
        }

        this.drawGameEndScreen();

        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws the background objects with the current camera position.
     */
    drawBackground() {
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Updates and draws the game status bars.
     */
    drawStatusBars() {
        this.statusBarHealth.setPercentage(this.character.energy);
        this.statusBarCoin.setPercentage(
            this.collectedCoins / this.totalCoins * 100
        );
        this.statusBarBottle.setPercentage(
            this.collectedBottles / this.totalBottles * 100
        );
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarBottle);

        if (this.endboss && this.endboss.isAlerted) {
            this.statusBarEndboss.hidden = false;
        }
        if (!this.statusBarEndboss.hidden && this.endboss) {
            this.statusBarEndboss.setPercentage(this.endboss.energy);
            this.addToMap(this.statusBarEndboss);
        }
    }

    /**
     * Draws the character, enemies and collectable objects.
     */
    drawGameObjects() {
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);

        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws the appropriate end screen when the game is finished.
     */
    drawGameEndScreen() {
        if (this.gameWon) {
            this.drawEndScreen(this.gameWonImage);
        } else if (this.gameLost) {
            this.drawEndScreen(this.gameLostImage);
        }
    }

    /**
     * Adds multiple objects to the game map.
     *
     * @param {DrawableObject[]} objects - The objects to add to the map.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds a single object to the game map.
     *
     * @param {DrawableObject} mo - The object to draw.
     */
    addToMap(mo) {
        if(mo.otherDirection) {
            this.flipImage(mo);

        }
        mo.draw(this.ctx);

        // mo.drawFrame(this.ctx);

        if(mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips an object horizontally before drawing it.
     *
     * @param {DrawableObject} mo - The object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the object's original orientation after drawing.
     *
     * @param {DrawableObject} mo - The object to restore.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Draws the game end screen.
     *
     * @param {HTMLImageElement} image - The image to display.
     */
    drawEndScreen(image) {
        this.ctx.save();
        this.ctx.globalAlpha = 1;

        let width = this.canvas.width * 0.8;
        let height = this.canvas.height * 0.8;
        let x = (this.canvas.width - width) / 2;
        let y = (this.canvas.height - height) / 2;

        this.ctx.drawImage(image, x, y, width, height);
        this.ctx.restore();
    }
}