/**
 * The Search
 */
export default class Search {
    
    #withTags = true;
    #data     = null;
    
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
        this.#list    = document.querySelector(".results ol");
        this.#empty   = document.querySelector(".results-empty");
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
     * Searches new Icons
     * @returns {Promise}
     */
    async search() {
        const text = this.text;
        if (!text) {
            return;
        }
        if (!this.#data) {
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
            this.#data = result;            
        } else {
            const response = await fetch("https://raw.githubusercontent.com/google/material-design-icons/master/update/current_versions.json");
            const result   = await response.json();
            this.#data = Object.keys(result);                
        }
    }

    /** 
     * Finds the icons
     * @param {String}
     * @returns {String[]}
     */
    findIcons(text) {
        const search = text.toLowerCase();
        const result = [];
        
        for (const icon of this.#data) {
            if (this.#withTags) {
                for (const tag of icon.tags) {
                    if (result.includes(icon.name)) {
                        continue;
                    }
                    if (tag.includes(search)) {
                        result.push(icon.name);
                        break;
                    }
                }
            } else {
                const name = icon.split("::")[1];
                if (!result.includes(name) && name.includes(search)) {
                    result.push(name);
                }
            }
        }
        return result;
    }

    /**
     * Shows the Results
     * @param {String[]} icons
     * @returns {Boolean}
     */
    showIcons(icons) {
        this.#results.style.display = "block";
        this.#clear.style.display = "flex";
        this.#list.innerHTML = "";

        if (!icons.length) {
            this.#empty.style.display = "block";
            return false;
        }
        this.#empty.style.display = "none";
        
        for (const icon of icons) {
            const li = document.createElement("li");
            li.dataset.action = "select-icon";
            li.dataset.icon   = icon;

            const item = document.createElement("span");
            item.className = "material-symbols-outlined";
            item.innerHTML = icon;
            li.appendChild(item);

            const label = document.createElement("span");
            label.innerHTML = icon.replace(/_/g, " ");
            li.appendChild(label);
            
            this.#list.appendChild(li);
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
