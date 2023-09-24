import Project from "./Project.js";



/**
 * The Canvas
 */
export default class Canvas {

    /** @type {HTMLElement} */
    #body;
    /** @type {HTMLElement} */
    #main;
    /** @type {HTMLElement} */
    #title;
    /** @type {HTMLElement} */
    #light;
    /** @type {HTMLElement} */
    #dark;

    
    /**
     * Canvas constructor
     */
    constructor() {
        this.#body  = document.querySelector("body");
        this.#main  = document.querySelector("main");
        this.#title = document.querySelector("header h1");
        this.#light = document.querySelector(".light");
        this.#dark  = document.querySelector(".dark");
    }

    /**
     * Sets the Project
     * @param {Project} project
     * @returns {Void}
     */
    setProject(project) {
        this.#main.style.display = "flex";
        this.#title.innerHTML = project.name;
    }



    /**
     * Restores the Light or Dark mode
     * @param {String} mode
     * @returns {Void}
     */
    restoreMode(mode) {
        if (mode === "light") {
            this.setLightMode();
        } else {
            this.setDarkMode();
        }
    }
    
    /**
     * Sets the Light Mode
     * @returns {Void}
     */
    setLightMode() {
        this.#body.classList.add("light-mode");
        this.#body.classList.remove("dark-mode");
        this.#light.classList.add("selected");
        this.#dark.classList.remove("selected");
    }

    /**
     * Sets the Dark Mode
     * @returns {Void}
     */
    setDarkMode() {
        this.#body.classList.remove("light-mode");
        this.#body.classList.add("dark-mode");
        this.#light.classList.remove("selected");
        this.#dark.classList.add("selected");
    }
}
