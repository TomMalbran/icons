/**
 * The icon
 */
export default class Icon {

    // New Icon
    key      = "";
    category = "";
    tags     = [];

    // Saved Icon
    id       = 0;
    #name    = "";

    /** @type {?HTMLElement} */
    #editElement;

    /** @type {?HTMLElement} */
    #addElement;



    /**
     * Creates an Icon
     * @param {String}    key
     * @param {String}    category
     * @param {String[]=} tags
     * @param {Number=}   id
     * @param {String=}   name
     */
    constructor(key, category, tags = [], id = 0, name = "") {
        this.key      = key;
        this.category = category;
        this.tags     = tags;
        this.id       = id;
        this.#name    = name;
    }

    /**
     * Returns the Data
     * @returns {Object}
     */
    get data() {
        return {
            id       : this.id,
            key      : this.key,
            name     : this.#name,
            category : this.category,
            tags     : this.tags,
        };
    }

    /**
     * Returns the Name
     * @returns {String}
     */
    get name() {
        return this.#name;
    }

    /**
     * Returns the Title
     * @returns {String}
     */
    get title() {
        return this.getTitle(this.#name || this.key);
    }

    /**
     * Returns the Add Element
     * @returns {HTMLElement}
     */
    get addElement() {
        if (!this.#addElement) {
            this.#addElement = this.createElement(true);
        }
        return this.#addElement;
    }

    /**
     * Returns the Edit Element
     * @returns {HTMLElement}
     */
    get editElement() {
        if (!this.#editElement) {
            this.#editElement = this.createElement(false);
        }
        return this.#editElement;
    }

    /**
     * Sets the icon Name
     * @param {String} name
     * @returns {Void}
     */
    set name(name) {
        this.#name = name;
        if (this.#editElement) {
            const label = this.#editElement.querySelector(".icon-label");
            if (label) {
                label.innerHTML = this.title;
            }
        }
    }



    /**
     * Returns true if the Icon includes the given text
     * @param {String} text
     * @returns {Boolean}
     */
    includes(text) {
        if (this.tags.length) {
            for (const tag of this.tags) {
                if (tag.includes(text)) {
                    return true;
                }
            }
        }
        return this.key.includes(text);
    }

    /**
     * Returns the Title
     * @param {String} text
     * @returns {String}
     */
    getTitle(text) {
        return text.replace(/_/g, " ");
    }

    /**
     * Creates the Icon element
     * @param {Boolean} isAdd
     * @returns {HTMLElement}
     */
    createElement(isAdd) {
        const li = document.createElement("li");
        li.dataset.action = isAdd ? "open-add-icon" : "open-edit-icon";
        li.dataset.icon   = String(isAdd ? this.key : this.id);
        li.className      = "icon";

        const item = document.createElement("span");
        item.className = "material-symbols-outlined";
        item.innerHTML = this.key;
        li.appendChild(item);

        const label = document.createElement("span");
        label.className = "icon-label";
        label.innerHTML = this.getTitle(isAdd ? this.key : this.#name);
        li.appendChild(label);

        return li;
    }
}
