import Icon  from "./Icon.js";
import Utils from "./Utils.js";



/**
 * The Search
 */
export default class Search {

    #withTags = true;
    #text     = "";
 
    /** @type {Object.<String, Icon>} */
    #data = {};

    /** @type {?HTMLInputElement} */
    #input;
    /** @type {?HTMLElement} */
    #results;
    /** @type {?HTMLElement} */
    #list;
    /** @type {?HTMLElement} */
    #empty;
    /** @type {?HTMLElement} */
    #clear;


    /**
     * Search constructor
     */
    constructor() {
        this.#input   = document.querySelector(".search input");
        this.#results = document.querySelector(".results");
        this.#list    = document.querySelector(".results .icons");
        this.#empty   = document.querySelector(".results .empty");
        this.#clear   = document.querySelector(".clear-search");
    }

    /**
     * Returns the Text
     * @returns {String}
     */
    get text() {
        return this.#text;
    }

    /**
     * Returns the icon with the given Name
     * @returns {Icon}
     */
    getIcon(name) {
        return this.#data[name];
    }

    /**
     * Searches new Icons
     * @param {String[]} iconKeys
     * @returns {Promise}
     */
    async search(iconKeys) {
        this.#text = (this.#input?.value || "").toLowerCase();
        if (!this.#text) {
            return;
        }
        if (!this.#data.length) {
            await this.fetchData();
        }
        const icons = this.findIcons(iconKeys);
        this.showIcons(icons);
    }

    /**
     * Fetches the Icons
     * @returns {Promise}
     */
    async fetchData() {
        if (this.#withTags) {
            // Try to get the data from: http://fonts.google.com/metadata/icons?incomplete=1&key=material_symbols
            const response = await fetch("data/icons.json");
            const result   = await response.json();
            for (const icon of result) {
                if (!this.#data[icon.name]) {
                    this.#data[icon.name] = new Icon(icon.name, icon.category, icon.tags);
                }
            }
        } else {
            const response = await fetch("https://raw.githubusercontent.com/google/material-design-icons/master/update/current_versions.json");
            const result   = await response.json();
            for (const icon of Object.keys(result)) {
                const [ category, name ] = icon.split("::");
                if (!this.#data[name]) {
                    this.#data[name] = new Icon(name, category);
                }
            }
        }
    }

    /**
     * Finds the icons
     * @param {String[]} iconKeys
     * @returns {Icon[]}
     */
    findIcons(iconKeys) {
        const result = [];
        for (const icon of Object.values(this.#data)) {
            if (!iconKeys.includes(icon.key) && icon.includes(this.#text)) {
                result.push(icon);
            }
        }
        return result;
    }

    /**
     * Shows the Results
     * @param {Icon[]} icons
     * @returns {Boolean}
     */
    showIcons(icons) {
        if (this.#results) {
            this.#results.style.display = "flex";
        }
        if (this.#clear) {
            this.#clear.style.display = "flex";
        }
        if (this.#empty) {
            this.#empty.style.display = "none";
        }

        if (this.#list && this.#empty) {
            this.#list.innerHTML = "";
            if (!icons.length) {
                this.#empty.style.display = "block";
                return false;
            }
            for (const icon of icons) {
                this.#list.appendChild(icon.addElement);
            }
        }
        return true;
    }

    /**
     * Adds the given Icon
     * @param {Icon} icon
     * @returns {Void}
     */
    addIcon(icon) {
        if (!this.#text || !this.#list) {
            return;
        }

        const lis   = this.#list.querySelectorAll("li");
        let   added = false;
        for (const li of lis) {
            const iconKey = li.dataset.icon;
            const compare = icon.key.localeCompare(iconKey);
            if (compare < 0) {
                li.before(icon.addElement);
                added = true;
                break;
            }
        }
        if (!added) {
            this.#list.appendChild(icon.addElement);
        }
    }

    /**
     * Removes the given Icon
     * @param {Icon} icon
     * @returns {Void}
     */
    removeIcon(icon) {
        if (!this.#text || !this.#list) {
            return;
        }

        /** @type {?HTMLElement} */
        const element = this.#list.querySelector(`[data-icon=${icon.key}]`);
        if (element) {
            Utils.removeElement(element);
        }
    }

    /**
     * Clears the Search
     * @returns {Void}
     */
    clear() {
        this.#text = "";
        if (this.#input) {
            this.#input.value = "";
        }
        if (this.#results) {
            this.#results.style.display = "none";
        }
        if (this.#clear) {
            this.#clear.style.display = "none";
        }
    }
}
