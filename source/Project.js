import Icon from "./Icon.js";



/**
 * The Project
 */
export default class Project {

    id         = 0;
    name       = "";
    position   = 0;
    isSelected = false;

    /** @type {Object.<Number, Icon>} */
    #icons     = {};

    

    /**
     * The Project constructor
     * @param {Number}                 id
     * @param {String}                 name
     * @param {Number}                 position
     * @param {Boolean}                isSelected
     * @param {Object.<Number, Icon>=} icons
     */
    constructor(id, name, position, isSelected, icons = {}) {
        this.id         = id;
        this.name       = name;
        this.position   = position;
        this.isSelected = isSelected;
        this.#icons     = icons;
    }

    /**
     * Returns the Icons
     * @returns {Icon[]}
     */
    get icons() {
        return Object.values(this.#icons);
    }

    /**
     * Returns the Icon keys
     * @returns {String[]}
     */
    get iconKeys() {
        return Object.values(this.#icons).map((icon) => icon.key);
    }

    /**
     * Returns true if there is an Icon with the given name
     * @param {String} name
     * @param {Number=} skipID
     * @returns {Boolean}
     */
    hasIcon(name, skipID = 0) {
        for (const icon of this.icons) {
            if (icon.name == name && icon.id !== skipID) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets an Icon
     * @param {Number} iconID
     * @returns {?Icon}
     */
    getIcon(iconID) {
        return this.#icons[iconID] ?? null;
    }

    /**
     * Sets an Icon
     * @param {Icon} icon
     * @returns {Void}
     */
    setIcon(icon) {
        this.#icons[icon.id] = icon;
    }

    /**
     * Removes an Icon
     * @param {Icon} icon
     * @returns {Void}
     */
    removeIcon(icon) {
        delete this.#icons[icon.id];
    }

    /**
     * Returns an array with the filtered Icons
     * @returns {Icon[]}
     */
    filterIcons(text) {
        const result = [];
        for (const icon of this.icons) {
            if (!text || icon.includes(text)) {
                result.push(icon);
            }
        }
        return result;
    }
}
