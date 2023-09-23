import Project from "./Project.js";



/**
 * The Canvas
 */
export default class Canvas {
    
    /**
     * Canvas constructor
     */
    constructor() {
        /** @type {Project} */
        this.project = null;

        /** @type {HTMLElement} */
        this.body = document.querySelector("body");

        /** @type {HTMLElement} */
        this.main = document.querySelector("main");

        /** @type {HTMLElement} */
        this.title = document.querySelector("header h1");

        /** @type {HTMLElement} */
        this.light = document.querySelector(".light");
        
        /** @type {HTMLElement} */
        this.dark = document.querySelector(".dark");
    }

    /**
     * Sets the Project
     * @param {Project} project
     * @returns {Void}
     */
    setProject(project) {
        this.project = project;

        this.main.style.display = "block";
        this.title.innerHTML = project.name;
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
        this.body.classList.add("light-mode");
        this.body.classList.remove("dark-mode");
        this.light.classList.add("selected");
        this.dark.classList.remove("selected");
    }

    /**
     * Sets the Dark Mode
     * @returns {Void}
     */
    setDarkMode() {
        this.body.classList.remove("light-mode");
        this.body.classList.add("dark-mode");
        this.light.classList.remove("selected");
        this.dark.classList.add("selected");
    }
}
