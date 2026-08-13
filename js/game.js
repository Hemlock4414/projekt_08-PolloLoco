let canvas;

let fullscreen = false;

// ctx = context

let world;

let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('myCanvas');
    initLevel();
    world = new World(canvas, keyboard);

    console.log('My Character is', world.character);

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

// Fullscreen

function toggleFullscreen() {
    if (document.fullscreenElement) {
        exitFullscreen();
    } else {
        enterFullscreen(document.getElementById('fullscreen'));
    }
}

function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

document.addEventListener('fullscreenchange', () => {
    let btn = document.getElementById('fullscreenBtn');
    if (document.fullscreenElement) {
        addFullscreenStyle();
        btn.textContent = '⤡';
    } else {
        removeFullscreenStyle();
        btn.textContent = '⛶';
    }
});

function addFullscreenStyle() {
    fullscreen = true;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
}

function removeFullscreenStyle() {
    fullscreen = false;
    canvas.style.width = '';
    canvas.style.height = '';
}