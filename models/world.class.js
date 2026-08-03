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
    // statusBar = new StatusBar();
    throwableObjects = [];
    gameWon = false;

    collectedBottles = 0;
    collectedCoins = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
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
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
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

        // this.level.coins.forEach((coin) => {
        //     if (this.character.isColliding(coin)) {
        //         this.collectedCoins++;
        //         coin.collected = true;
        //     }
        // });
        // this.level.coins = this.level.coins.filter(coin => !coin.collected);
    }

    // Prüft, ob der Endboss besiegt wurde
    checkGameStatus() {
        if (this.gameWon) return;
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && endboss.isDead()) {
            this.gameWon = true;
            clearInterval(this.runInterval);
        }
    }

    // Draw() wird immer wieder aufgerufen um den Canvas zu aktualisieren circa alle 16ms
    draw() {
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
        // Fixed Objects wie Statusleiste zeichnen
        // this.addToMap(this.statusBar);          // Zwischen der Kameraverschiebungen zeichnen, damit die Statusleiste fixiert bleibt
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

        // this.addObjectsToMap(this.level.coins);

        this.ctx.translate(-this.camera_x, 0); // Rückgängigmachen der Kameraverschiebung

        let self = this;    

        if (this.gameWon) {
            this.drawWinScreen();
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

    drawWinScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('DU HAST GEWONNEN!', this.canvas.width / 2, this.canvas.height / 2);
    }
}