let canvas;

// ctx = context

let world;

let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('myCanvas');
    world = new World(canvas, keyboard);

    console.log('My Character is', world.charactercharacter);

}

// Listen for keyboard events
window.addEventListener('keydown', (event) => {
    if (event.code === "ArrowRight") {
        keyboard.RIGHT = true;
    }
    if (event.code === "ArrowLeft") {
        keyboard.LEFT  = true;
    }
    if (event.code === "ArrowUp") {
        keyboard.UP    = true;
    }
    if (event.code === "ArrowDown"){
        keyboard.DOWN  = true;
    }
    if (event.code === "Space") {
        keyboard.SPACE = true;
    }
});

// Beides ist funktional exakt gleich. Der Unterschied ist nur Schreibstil, nicht Verhalten.
// Wenn ein if genau eine Anweisung ausführt, dürfen die geschweiften Klammern weggelassen werden.

window.addEventListener('keyup', (event) => {
    if (event.code === "ArrowRight") keyboard.RIGHT = false;
    if (event.code === "ArrowLeft")  keyboard.LEFT  = false;
    if (event.code === "ArrowUp")    keyboard.UP    = false;
    if (event.code === "ArrowDown")  keyboard.DOWN  = false;
    if (event.code === "Space")      keyboard.SPACE = false;
});

// 20, 20, 50, 150);  x-axis, y-axis, width, height