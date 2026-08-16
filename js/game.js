let canvas;

let fullscreen = false;

let soundMuted = true;

// ctx = context

let world;

let keyboard = new Keyboard();

let soundtrack = new Audio('audio/mexican-guitar.mp3');
soundtrack.loop = true;
soundtrack.muted = true;

function init() {
    canvas = document.getElementById('myCanvas');
    soundtrack.play().catch(() => {});
    // soundtrack.play().catch(err => console.warn('Soundtrack play failed:', err.name, err.message));
}

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    initLevel();
    world = new World(canvas, keyboard);
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
// End Fullscreen

function showRestartButton() {
    document.getElementById('hudControls-topLeft').style.display = 'flex';
}

function restart() {
    document.getElementById('hudControls-topLeft').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    if (world) world.stop();
    world = null;
}

function toggleMute() {
    soundMuted = !soundMuted;
    soundtrack.muted = soundMuted;
    let btn = document.getElementById('muteBtn');
    btn.textContent = soundMuted ? '🔇' : '🔊';
}

function playSound(audio) {
    if (soundMuted) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

function openControlsDialog() {
    document.getElementById('controlsDialog').showModal();
}

function closeControlsDialog() {
    document.getElementById('controlsDialog').close();
}