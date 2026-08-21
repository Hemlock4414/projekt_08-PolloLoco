/**
 * Represents a game level and its objects.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    bottles;
    coins;
    level_end_x = 2200;

    /**
     * Creates a new game level.
     *
     * @param {Chicken[]} enemies - The enemies in the level.
     * @param {Cloud[]} clouds - The clouds in the level.
     * @param {BackgroundObject[]} backgroundObjects - The background objects in the level.
     * @param {Bottle[]} bottles - The collectible bottles in the level.
     * @param {Coin[]} coins - The collectible coins in the level.
     */
    constructor(enemies, clouds, backgroundObjects, bottles, coins) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
        this.coins = coins;
    }
}