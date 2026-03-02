let level1;

function initLevel() {  // startet erst beim Drücken auf START

    level1 = new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Endboss()
        ],
        [
            new Cloud()
        ],
        [
            new BackgroundObject('img/background-sky.png', -719),
            new BackgroundObject('img/background-far-1.png', -720),
            new BackgroundObject('img/background-mid-2.png', -720),
            new BackgroundObject('img/background-close-1.png', -720),

            new BackgroundObject('img/background-sky.png', 0),
            new BackgroundObject('img/background-far-1.png', 0),
            new BackgroundObject('img/background-mid-2.png', 0),
            new BackgroundObject('img/background-close-1.png', 0),
            new BackgroundObject('img/background-sky.png', 719),
            new BackgroundObject('img/background-far-2.png', 720),
            new BackgroundObject('img/background-mid-2.png', 720),
            new BackgroundObject('img/background-close-2.png', 720),

            new BackgroundObject('img/background-sky.png', 719*2),
            new BackgroundObject('img/background-far-1.png', 720*2),
            new BackgroundObject('img/background-mid-2.png', 720*2),
            new BackgroundObject('img/background-close-1.png', 720*2),
            new BackgroundObject('img/background-sky.png', 719*3),
            new BackgroundObject('img/background-far-2.png', 720*3),
            new BackgroundObject('img/background-mid-2.png', 720*3),
            new BackgroundObject('img/background-close-2.png', 720*3)
        ]
    );
}