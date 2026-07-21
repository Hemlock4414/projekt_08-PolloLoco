let level1;

function initLevel() {  // startet erst beim Drücken auf START

    level1 = new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Endboss()
        ],
        [
            new Cloud()
        ],
        [
            new BackgroundObject('img/5_background/layers/air.png', -719),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', -720),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', -720),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', -720),

            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 0),
            new BackgroundObject('img/5_background/layers/air.png', 719), // 1 Pixel weniger, damit die Bilder nahtlos aneinander anschließen
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720),

            new BackgroundObject('img/5_background/layers/air.png', 719*2),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720*2),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720*2),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720*2),
            new BackgroundObject('img/5_background/layers/air.png', 719*3),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720*3),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720*3),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720*3)
        ]
    );
}