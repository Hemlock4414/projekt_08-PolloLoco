/**
 * Stores the current keyboard input state and binds
 * keyboard and mobile touch controls to it.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;

    /**
     * Creates a new Keyboard instance and binds the
     * physical keyboard event listeners.
     *
     * Mobile controls are NOT bound here, since the
     * corresponding buttons may not exist in the DOM yet.
     * Call bindMobileControls() explicitly once the DOM is ready.
     */
    constructor() {
        this.bindKeyEvents();
    }

    /**
     * Binds keydown and keyup listeners to update the
     * keyboard state accordingly.
     */
    bindKeyEvents() {
        window.addEventListener('keydown', (event) => {
            if (event.code === "ArrowRight") {
                this.RIGHT = true;
            }
            if (event.code === "ArrowLeft") {
                this.LEFT = true;
            }
            if (event.code === "ArrowUp") {
                this.UP = true;
            }
            if (event.code === "Space") {
                this.SPACE = true;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.code === "ArrowRight") this.RIGHT = false;
            if (event.code === "ArrowLeft")  this.LEFT  = false;
            if (event.code === "ArrowUp")    this.UP    = false;
            if (event.code === "Space")      this.SPACE = false;
        });
    }

    /**
     * Binds a mobile button to a keyboard property.
     *
     * The corresponding keyboard property is set when the button
     * is touched and reset when the touch ends or is cancelled.
     *
     * @param {string} buttonId - The ID of the mobile button.
     * @param {string} keyboardProp - The keyboard property to control.
     */
    bindMobileButton(buttonId, keyboardProp) {
        const btn = document.getElementById(buttonId);
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this[keyboardProp] = true;
            btn.classList.add('pressed');
        });
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this[keyboardProp] = false;
            btn.classList.remove('pressed');
        });
        btn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this[keyboardProp] = false;
            btn.classList.remove('pressed');
        });
    }

    /**
     * Binds all mobile control buttons to their corresponding
     * keyboard properties.
     *
     * Must be called after the DOM (and the mobile control
     * buttons) has been loaded, e.g. from init().
     */
    bindMobileControls() {
        this.bindMobileButton('btnLeft', 'LEFT');
        this.bindMobileButton('btnRight', 'RIGHT');
        this.bindMobileButton('btnJump', 'UP');
        this.bindMobileButton('btnThrow', 'SPACE');
    }
}