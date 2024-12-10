import Project from "./Project.js";
import Icon    from "./Icon.js";



/**
 * The Canvas
 */
export default class Canvas {

    /** @type {?HTMLElement} */
    #main;

    /** @type {?HTMLElement} */
    #title;
    /** @type {?HTMLElement} */
    #icons;
    /** @type {?HTMLElement} */
    #empty;
    /** @type {?HTMLElement} */
    #list;


    /**
     * Canvas constructor
     */
    constructor() {
        this.#main  = document.querySelector("main");

        this.#title = document.querySelector("header h1");
        this.#icons = document.querySelector(".mine");
        this.#empty = document.querySelector(".mine .empty");
        this.#list  = document.querySelector(".mine .icons");
    }

    /**
     * Sets the Project
     * @param {Project} project
     * @returns {Void}
     */
    setProject(project) {
        if (this.#main) {
            this.#main.style.display = "flex";
        }
        if (this.#title) {
            this.#title.innerHTML = project.name;
        }
        this.showIcons(project.icons);
    }

    /**
     * Shows the Icons
     * @param {Icon[]}  icons
     * @param {String=} text
     * @returns {Void}
     */
    showIcons(icons, text = "") {
        if (this.#icons) {
            if (text && !icons.length) {
                this.#icons.style.display = "none";
            } else {
                this.#icons.style.display = "flex";
            }
        }

        if (this.#empty) {
            this.#empty.style.display = icons.length ? "none" : "block";
        }
        if (this.#list) {
            this.#list.innerHTML = "";
            for (const icon of icons) {
                this.#list.append(icon.editElement);
            }
        }
    }

    /**
     * Clears the Project
     * @returns {Void}
     */
    clearProject() {
        if (this.#title) {
            this.#title.innerHTML = "Icons";
        }
        if (this.#list) {
            this.#list.innerHTML = "";
        }
        if (this.#main) {
            this.#main.style.display = "none";
        }
    }
}
