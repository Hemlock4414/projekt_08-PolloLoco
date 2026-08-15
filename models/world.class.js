class World {

    character = new Character();

    level = level1;
    // enemies = level1.enemies;
    // clouds = level1.clouds;
    // backgroundObjects = level1.backgroundObjects;

    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBar(40, 0, 'health');
    statusBarCoin = new StatusBar(40, 50, 'coin');
    statusBarBottle = new StatusBar(40, 100, 'bottle');
    statusBarEndboss = new StatusBar(480, 8, 'endboss');
    throwableObjects = [];
    gameWon = false;

    collectedBottles = 0;
    totalBottles = 0;
    collectedCoins = 0;
    totalCoins = 0;

    gameLost = false;
    gameLostTriggered = false;

    gameWonImage = new Image();
    gameLostImage = new Image();

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.gameWonImage.src = 'img/You won, you lost/You won A.png';
        this.gameLostImage.src = 'img/You won, you lost/Game Over.png';
        this.draw();
        this.setWorld();
        this.totalCoins = this.level.coins.length;
        this.totalBottles = this.level.bottles.length;
        this.statusBarEndboss.hidden = true;
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
        this.level.clouds.forEach(cloud => cloud.world = this);
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    }

    run() {
        this.runInterval = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkThrowableCollisions();
            this.checkCollectableCollisions()
            this.checkGameStatus();
        }, 1000 / 60);
    }

    checkThrowObjects() {
        if (this.keyboard.SPACE && this.collectedBottles > 0 && !this.throwCooldown) {
            let direction = this.character.otherDirection ? 'left' : 'right';
            let offsetX = this.character.otherDirection ? -30 : 100;
            let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + 100, direction);
            this.throwableObjects.push(bottle);
            this.collectedBottles--;
            this.throwCooldown = true;
        }
        if (!this.keyboard.SPACE) {
            this.throwCooldown = false;
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (!this.character.isColliding(enemy)) return;
            if (enemy.isDead()) return; // tote Gegner fügen keinen Schaden mehr zu

            if (enemy instanceof Endboss) {
                this.character.hit();
                // this.character.energy -= 5; // wird ersetzt durch this.character.hit();
            } else if (this.character.isStomping(enemy)) {
                enemy.energy = 0;                           // sofort besiegt
            } else {
                this.character.hit();
                console.log('Collision with Character ', enemy, 'HP ', this.character.energy);
                // this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    // Prüft, ob eine geworfene Flasche einen Gegner trifft (fehlte bisher komplett)
    checkThrowableCollisions() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.isSplashing) return; // steckt schon in der Splash-Animation, nicht nochmal treffen

            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !enemy.isDead()) {
                    enemy.hit();
                    bottle.playSplash(() => {
                        bottle.hasHit = true; // erst NACH der Animation zum Entfernen markieren
                    });
                }
            });
        });

        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.hasHit);
    }

    checkCollectableCollisions() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.collectedBottles++;
                bottle.collected = true;
            }
        });
        this.level.bottles = this.level.bottles.filter(bottle => !bottle.collected);

        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.collectedCoins++;
                coin.collected = true;
            }
        });
        this.level.coins = this.level.coins.filter(coin => !coin.collected);
    }

    // Prüft, ob der Endboss besiegt wurde
    checkGameStatus() {
        if (this.gameWon || this.gameLost || this.gameWonTriggered || this.gameLostTriggered) return;

        if (this.endboss && this.endboss.isDead()) {
            this.gameWonTriggered = true;
            setTimeout(() => {
                this.gameWon = true;
                clearInterval(this.runInterval);
                this.stopped = true;
                showBackToStartButton();
            }, 2500);
        } else if (this.character.isDead()) {
            this.gameLostTriggered = true;
            setTimeout(() => {
                this.gameLost = true;
                clearInterval(this.runInterval);
                this.stopped = true;
                showBackToStartButton();
            }, 2500);
        }
    }

    // Draw() wird immer wieder aufgerufen um den Canvas zu aktualisieren circa alle 16ms
draw() {

        if (this.stopped) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // mit dieser Zeile wird der Canvas immer wieder geleert bevor neu gezeichnet wird
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Kamera folgt dem Charakter indem der Canvas verschoben wird
        this.ctx.translate(this.camera_x, 0); // Y-Achse bleibt unverändert, da die Kamera nur horizontal folgt

        this.addObjectsToMap(this.level.backgroundObjects);
        // this.backgroundObjects.forEach((bgo) => {
        //     this.addToMap(bgo);
        // });
        // Funktion unten (addObjectsToMap) fasst alles zusammen

        this.addObjectsToMap(this.level.clouds);
        // this.clouds.forEach(cloud => {
        //     this.addToMap(cloud);
            //this.ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
        // });

        this.ctx.translate(-this.camera_x, 0);  // Rückgängigmachen der Kameraverschiebung

        if (!this.gameWon && !this.gameLost) {
            // Fixed Objects wie Statusleiste zeichnen
            this.statusBarHealth.setPercentage(this.character.energy);
            this.statusBarCoin.setPercentage(this.collectedCoins / this.totalCoins * 100);
            this.addToMap(this.statusBarCoin);
            this.addToMap(this.statusBarHealth);
            this.statusBarBottle.setPercentage(this.collectedBottles / this.totalBottles * 100);
            this.addToMap(this.statusBarBottle);
            if (this.endboss && this.endboss.isAlerted) {
                this.statusBarEndboss.hidden = false;
            }
            if (!this.statusBarEndboss.hidden && this.endboss) {
                this.statusBarEndboss.setPercentage(this.endboss.energy);
                this.addToMap(this.statusBarEndboss);
            }
            // Zwischen der Kameraverschiebungen zeichnen, damit die Statusleiste fixiert bleibt
            this.ctx.translate(this.camera_x, 0);   // Kamera wieder aktivieren

            this.addToMap(this.character);
            // this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);

            // einfachere forEach Schleife
            // this.enemies.forEach(enemy => {
            //     this.addToMap(enemy);
                //this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
                // Funktion unten (addToMap) fasst alles zusammen
            // });
            this.addObjectsToMap(this.level.enemies);

            this.addObjectsToMap(this.throwableObjects);

            this.addObjectsToMap(this.level.bottles);

            this.addObjectsToMap(this.level.coins);

            this.ctx.translate(-this.camera_x, 0); // Rückgängigmachen der Kameraverschiebung
        }

        let self = this;    

        if (this.gameWon) {
            this.drawEndScreen(this.gameWonImage);
        } else if (this.gameLost) {
            this.drawEndScreen(this.gameLostImage);
        }

        requestAnimationFrame(function() {
            self.draw();
        });
        // Unübliche alte Lösung wegen einer Callback-Funktion
        // self ist eine übliche Ersatzvariable:
        // Man speichert den ursprünglichen Kontext (this) in einer Variablen wie self, that oder me.
        // Dadurch bleibt der Bezug zur Klasse erhalten.

        // Moderne Lösung mit Arrow Function:
        // requestAnimationFrame(() => {
        // this.draw();

    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if(mo.otherDirection) {
            this.flipImage(mo);

        }
        mo.draw(this.ctx);

        mo.drawFrame(this.ctx);  // Kollisionsrechteck zeichnen

        if(mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);    // Ursprungspunkt verschieben
        this.ctx.scale(-1, 1);  // Spiegeln
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    drawEndScreen(image) {
        this.ctx.save();
        this.ctx.globalAlpha = 1; // Transparenzgrad, anpassbar

        let width = this.canvas.width * 0.8;    // skalieren beide Achsen auf 80 %
        let height = this.canvas.height * 0.8;
        let x = (this.canvas.width - width) / 2;
        let y = (this.canvas.height - height) / 2;

        this.ctx.drawImage(image, x, y, width, height);
        this.ctx.restore();
    }
}