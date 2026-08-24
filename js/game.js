let canvas;
let fullscreen = false;
let world;
let keyboard = new Keyboard();

let soundtrack = new Audio('assets/audio/soft-mexican-guitar.mp3');
soundtrack.loop = true;
soundtrack.muted = true;
let soundMuted = true;

/**
 * Initializes the game.
 *
 * Gets the canvas element, starts the soundtrack, and
 * binds the controls for mobile devices.
 */
function init() {
    canvas = document.getElementById('myCanvas');
    soundMuted = localStorage.getItem('soundMuted') !== 'false';
    soundtrack.muted = soundMuted;
    updateMuteIcon();
    bindAutoplayUnlock();
    keyboard.bindMobileControls();
}

/**
 * Starts the soundtrack automatically after the first click or
 * key press after loading, if the sound is not muted.
 * Necessary because browsers may block autoplay with sound without
 * a user interaction.
 */
function bindAutoplayUnlock() {
    function startOnInteraction() {
        if (!soundMuted && soundtrack.paused) {
            soundtrack.play().catch(() => {});
        }
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('keydown', startOnInteraction);
    }
    document.addEventListener('click', startOnInteraction);
    document.addEventListener('keydown', startOnInteraction);
}

/**
 * Starts the game and initializes the current level.
 *
 * Hides the start screen, activates the mobile controls,
 * and creates a new World instance.
 */
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('mobileControls').classList.add('game-active');
    initLevel();
    world = new World(canvas, keyboard);
}

/**
 * Toggles fullscreen mode.
 */
function toggleFullscreen() {
    if (document.fullscreenElement) {
        exitFullscreen();
    } else {
        enterFullscreen(document.getElementById('fullscreen'));
    }
}

/**
 * Enables fullscreen mode for the specified element.
 *
 * @param {HTMLElement} element - The element to display in fullscreen mode.
 */
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

/**
 * Exits fullscreen mode.
 */
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

/**
 * Handles changes to the fullscreen state.
 *
 * Updates the canvas and fullscreen icon according to
 * the current fullscreen state.
 */
document.addEventListener('fullscreenchange', () => {
    let icon = document.getElementById('fullscreenIcon');
    if (document.fullscreenElement) {
        addFullscreenStyle();
        icon.src = 'assets/img/icons/icons8-normal-screen-48.png';
        icon.alt = 'Exit fullscreen';
    } else {
        removeFullscreenStyle();
        icon.src = 'assets/img/icons/icons8-full-screen-48.png';
        icon.alt = 'Fullscreen';
    }
});

/**
 * Adjusts the canvas to fullscreen mode.
 */
function addFullscreenStyle() {
    fullscreen = true;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
}

/**
 * Resets the canvas size to its default values.
 */
function removeFullscreenStyle() {
    fullscreen = false;
    canvas.style.width = '';
    canvas.style.height = '';
}

/**
 * Displays the restart button.
 */
function showRestartButton() {
    document.getElementById('hudControls-topLeft').style.display = 'flex';
}

/**
 * Resets the game and displays the start screen.
 *
 * Stops the current World instance if one exists and
 * deactivates the mobile controls.
 */
function restart() {
    document.getElementById('hudControls-topLeft').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('mobileControls').classList.remove('game-active');
    if (world) world.stop();
    world = null;
}

/**
 * Restarts the game immediately without returning to the start screen.
 *
 * Stops the current World instance, reinitializes the level,
 * and creates a fresh World instance.
 */
function tryAgain() {
    document.getElementById('hudControls-topLeft').style.display = 'none';
    if (world) world.stop();
    world = null;
    initLevel();
    world = new World(canvas, keyboard);
}

/**
 * Toggles the sound on or off.
 *
 * Updates the mute button icon accordingly.
 */
function toggleMute() {
    soundMuted = !soundMuted;
    soundtrack.muted = soundMuted;
    localStorage.setItem('soundMuted', soundMuted);
    if (!soundMuted && soundtrack.paused) {
        soundtrack.play().catch(() => {});
    }
    updateMuteIcon();
}

/**
 * Updates the mute button icon according to the current mute state.
 */
function updateMuteIcon() {
    let icon = document.getElementById('muteIcon');
    icon.src = soundMuted ? 'assets/img/icons/icons8-mute-50.png' : 'assets/img/icons/icons8-audio-50.png';
    icon.alt = soundMuted ? 'Mute' : 'Unmute';
}

/**
 * Plays a sound if sound is not muted.
 *
 * Resets the playback position to the beginning before playing.
 *
 * @param {HTMLAudioElement} audio - The audio element to play.
 */
function playSound(audio) {
    if (soundMuted) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

/**
 * Opens the controls dialog.
 */
function openControlsDialog() {
    document.getElementById('controlsDialog').showModal();
}

/**
 * Closes the controls dialog.
 */
function closeControlsDialog() {
    document.getElementById('controlsDialog').close();
}

/**
 * Opens the legal information dialog.
 */
function openLegalDialog() {
    document.getElementById('legalDialog').showModal();
}

/**
 * Closes the legal information dialog.
 */
function closeLegalDialog() {
    document.getElementById('legalDialog').close();
}