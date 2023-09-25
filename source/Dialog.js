/**
 * The Dialog
 */
export default class Dialog {

    #isOpen   = false;
    #hasError = false;
    
    /** @type {HTMLElement} */
    #container;

    
    /**
     * The Dialog constructor
     * @param {String} name
     */
    constructor(name) {
        this.#container = document.querySelector(`[data-dialog="${name}"]`);
    }

    /**
     * Returns true if the Dialog is Open
     * @returns {Boolean}
     */
    get isOpen() {
        return this.#isOpen;
    }

    /**
     * Returns true if the Dialog has Error
     * @returns {Boolean}
     */
    get hasError() {
        return this.#hasError;
    }


    
    /**
     * Opens the Dialog
     * @returns {Void}
     */
    open() {
        this.#isOpen = true;
        this.#container.style.display = "block";
        this.hideErrors();

        /** @type {HTMLInputElement} */
        const input = this.#container.querySelector("[data-field=name] input");
        if (input) {
            input.focus();
        }
    }

    /**
     * Closes the Dialog
     * @returns {Void}
     */
    close() {
        this.#isOpen = false;
        this.#container.style.display = "none";
        this.hideErrors();
    }



    /**
     * Toggles the Close X
     * @param {Boolean} show
     * @returns {Void}
     */
    toggleClose(show) {
        const element = this.#container.querySelector(".close");
        if (!element) {
            return;
        }
        if (show) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    }
    
    /**
     * Set the Dialog title
     * @param {String} text
     * @returns {Void}
     */
    setTitle(text) {
        const element = this.#container.querySelector("h2");
        if (element) {
            element.innerHTML = text;
        }
    }

    /**
     * Set the content of a Dialog item
     * @param {String} selector
     * @param {String} content
     * @returns {Void}
     */ 
    setContent(selector, content) {
        if (!selector) {
            return;
        }
        const element = this.#container.querySelector(selector);
        if (element) {
            element.innerHTML = content;
        }
    }

    /**
     * Set the Dialog button
     * @param {String} text
     * @returns {Void}
     */
    setButton(text) {
        const element = this.#container.querySelector(".dialog-btn");
        if (element) {
            element.innerHTML = text;
        }
    }

    /**
     * Returns the Input value
     * @param {String} name
     * @returns {(Boolean|String)}
     */
    getInput(name) {
        /** @type {HTMLInputElement} */
        const input = this.#container.querySelector(`[data-field=${name}] input`);
        if (input.type === "checkbox") {
            return input.checked;
        }
        return input.value;
    }

    /**
     * Sets the Input value
     * @param {String} name
     * @param {*}      value
     * @returns {Void}
     */
    setInput(name, value) {
        const element = this.#container.querySelector(`[data-field=${name}]`);
        if (!element) {
            return;
        }
        if (element.classList.contains("file-input")) {
            const name = element.querySelector(".file-name");
            name.innerHTML = value;
            return;
        }
        const input = element.querySelector("input");
        if (input.type === "checkbox") {
            input.checked = Boolean(value);
            return;
        }
        input.value = value;
    }

    /**
     * Selects a File in the Dialog
     * @param {String}   name
     * @param {Function} onSelect
     * @returns {Void}
     */
    selectFile(name, onSelect) {
        const input    = document.createElement("input");
        input.type     = "file";
        input.accept   = ".json";
        input.onchange = () => {
            const file = input.files[0];
            this.setInput(name, file.name);
            onSelect(file);
        };
        input.click();
    }

    /**
     * Hides the Errors
     * @param {String}  error
     * @param {String=} message
     * @returns {Void}
     */
    showError(error, message = null) {
        this.#hasError = true;

        /** @type {HTMLElement} */
        const element = this.#container.querySelector(`[data-error=${error}]`);
        if (element) {
            element.style.display = "block";
            if (message) {
                element.innerText = message;
            }
        }
    }

    /**
     * Hides the Errors
     * @returns {Void}
     */
    hideErrors() {
        this.#hasError = false;
        const errors = this.#container.querySelectorAll(".error");
        // @ts-ignore
        for (const error of errors) {
            error.style.display = "none";
        }
    }
}
