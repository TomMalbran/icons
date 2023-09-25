import Icon from "./Icon.js";



/**
 * The Search
 */
export default class Search {
    
    #withTags = true;

    /** @type {Object.<String, Icon>} */
    #data = {};
    
    /** @type {HTMLInputElement} */
    #input;
    /** @type {HTMLElement} */
    #results;
    /** @type {HTMLElement} */
    #list;
    /** @type {HTMLElement} */
    #empty;
    /** @type {HTMLElement} */
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
     * Returns the Input value
     * @returns {String}
     */
    get text() {
        return this.#input.value;
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
     * @returns {Promise}
     */
    async search() {
        const text = this.text;
        if (!text) {
            return;
        }
        if (!this.#data.length) {
            await this.fetchData();
        }
        const icons = this.findIcons(text);
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
     * @param {String} text
     * @returns {Icon[]}
     */
    findIcons(text) {
        const search = text.toLowerCase();
        const result = [];

        for (const icon of Object.values(this.#data)) {
            if (icon.includes(search)) {
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
        this.#results.style.display = "flex";
        this.#clear.style.display = "flex";
        this.#empty.style.display = "none";
        this.#list.innerHTML = "";

        if (!icons.length) {
            this.#empty.style.display = "block";
            return false;
        }
        
        for (const icon of icons) {
            this.#list.appendChild(icon.addElement);
        }
        return true;
    }

    /**
     * Clears the Search
     * @returns {Void}
     */
    clear() {
        this.#input.value = "";
        this.#results.style.display = "none";
        this.#clear.style.display = "none";
    }
}
