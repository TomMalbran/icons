import Project from "./Project.js";
import Icon    from "./Icon.js";



/**
 * The Storage
 */
export default class Storage {

    #currentID  = 0;
    #nextID     = 1;

    /** @type {Number[]} */
    #projectIDs = [];
    /** @type {Object.<Number, Project>} */
    #projects   = {};


    /**
     * Storage constructor
     */
    constructor() {
        this.#currentID  = this.getNumber("currentID", 0);
        this.#nextID     = this.getNumber("nextID", 1);
        this.#projectIDs = this.getData("projects") || [];
    }

    /**
     * Returns the Next ID
     * @returns {Number}
     */
    get nextID() {
        const nextID = this.#nextID;
        this.#nextID += 1;
        this.setNumber("nextID", this.#nextID);
        return nextID;
    }

    /**
     * Returns the Key
     * @param {(String|Number)[]} keys
     * @returns {String}
     */
    getKey(keys) {
        return "icons-" + keys.join("-");
    }

    /**
     * Returns true if there is an item
     * @param {...(String|Number)} keys
     * @returns {Boolean}
     */
    hasItem(...keys) {
        const key = this.getKey(keys);
        return !!localStorage.getItem(key);
    }

    /**
     * Returns a stored String
     * @param {...(String|Number)} keys
     * @returns {String}
     */
    getString(...keys) {
        const key = this.getKey(keys);
        return localStorage.getItem(key) || "";
    }

    /**
     * Saves a String
     * @param {...*} items
     * @returns {Void}
     */
    setString(...items) {
        const value = items.pop();
        const key   = this.getKey(items);
        localStorage.setItem(key, value);
    }

    /**
     * Returns a stored Number for the current Schema
     * @param {...*} items
     * @returns {Number}
     */
    getNumber(...items) {
        const defValue = items.pop();
        const key      = this.getKey(items);
        return Number(localStorage.getItem(key)) || defValue;
    }

    /**
     * Saves a Number to the current Schema
     * @param {...*} items
     * @returns {Void}
     */
    setNumber(...items) {
        const value = items.pop();
        const key   = this.getKey(items);
        localStorage.setItem(key, String(value));
    }

    /**
     * Returns a stored Object for the current Schema
     * @param {...(String|Number)} keys
     * @returns {?Object}
     */
    getData(...keys) {
        const key  = this.getKey(keys);
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    /**
     * Saves an Object to the current Schema
     * @param {...*} items
     * @returns {Void}
     */
    setData(...items) {
        const value = items.pop();
        const key   = this.getKey(items);
        localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Removes an Item from the current Schema
     * @param {...(String|Number)} keys
     * @returns {Void}
     */
    removeItem(...keys) {
        const key = this.getKey(keys);
        localStorage.removeItem(key);
    }



    /**
     * Returns true if there a Project selected
     * @returns {Boolean}
     */
    get hasProject() {
        return this.#currentID > 0 && this.hasItem(this.#currentID, "name");
    }

    /**
     * Returns the Current Project ID
     * @returns {Number}
     */
    get projectID() {
        return this.#currentID;
    }

    /**
     * Returns a list of Projects
     * @returns {Project[]}
     */
    get projects() {
        const result = [];
        for (const projectID of this.#projectIDs) {
            if (!this.#projects[projectID]) {
                this.getProject(projectID);
            }
            result.push(this.#projects[projectID]);
        }
        return result;
    }

    /**
     * Returns the Project
     * @param {Number=} projectID
     * @returns {?Project}
     */
    getProject(projectID = this.#currentID) {
        const position = this.#projectIDs.findIndex((id) => id === projectID) + 1;
        if (position <= 0) {
            return null;
        }

        if (!this.#projects[projectID]) {
            const name       = this.getString(projectID, "name");
            const icons      = this.getIcons(projectID);
            const isSelected = projectID === this.#currentID;
            this.#projects[projectID] = new Project(projectID, name, position, isSelected, icons);
        }

        return this.#projects[projectID];
    }



    /**
     * Selects a Project
     * @param {Number} projectID
     * @returns {Void}
     */
    selectProject(projectID) {
        if (this.#projects[this.#currentID]) {
            this.#projects[this.#currentID].isSelected = false;
        }
        if (this.#projects[projectID]) {
            this.#projects[projectID].isSelected = true;
        }

        this.#currentID = projectID;
        this.setNumber("currentID", this.#currentID);
    }

    /**
     * Saves the Project
     * @param {Project} project
     * @returns {Void}
     */
    setProject(project) {
        const isEdit = Boolean(project.id);

        // Update the next ID if this is a new Project
        if (!isEdit) {
            project.id = this.nextID;
        }

        // Save the Project data
        this.setString(project.id, "name", project.name);

        // Save the order
        const index = Math.min(Math.max(project.position - 1, 0), this.#projectIDs.length);
        if (!isEdit) {
            this.#projectIDs.push(project.id);
        } else if (this.#projectIDs[index] !== project.id) {
            this.#projectIDs = this.#projectIDs.filter((id) => id !== project.id);
            this.#projectIDs.splice(index, 0, project.id);
        }
        this.setData("projects", this.#projectIDs);
    }

    /**
     * Removes a Project
     * @param {Number} projectID
     * @returns {Void}
     */
    removeProject(projectID) {
        const project = this.getProject(projectID);
        if (!project) {
            return;
        }

        this.removeItem(projectID, "name");

        // Remove the icons
        const iconIDs = this.getIconIDs(projectID);
        for (const iconID of iconIDs) {
            this.removeItem(projectID, "icon", iconID);
        }
        this.removeItem(projectID, "icons");

        // Save the order
        this.#projectIDs = this.#projectIDs.filter((id) => id !== projectID);
        this.setData("projects", this.#projectIDs);

        // Remove as the current Project
        if (this.#currentID === projectID) {
            this.setNumber("currentID", 0);
        }

        delete this.#projects[projectID];
    }



    /**
     * Returns the Icon IDs
     * @param {Number=} projectID
     * @returns {Number[]}
     */
    getIconIDs(projectID = this.#currentID) {
        const icons = this.getData(projectID, "icons");
        return icons || [];
    }

    /**
     * Returns the stored Icons
     * @param {Number=} projectID
     * @returns {Object.<Number, Icon>}
     */
    getIcons(projectID = this.#currentID) {
        const iconIDs = this.getIconIDs(projectID);
        const result  = [];
        for (const iconID of iconIDs) {
            const icon = this.getData(projectID, "icon", iconID);
            result[icon.id] = new Icon(icon.key, icon.category, icon.tags, icon.id, icon.name);
        }
        return result;
    }

    /**
     * Sets the Icon
     * @param {Icon} icon
     * @returns {Void}
     */
    setIcon(icon) {
        if (!icon.id) {
            icon.id = this.nextID;
            const iconIDs = this.getIconIDs();
            iconIDs.push(icon.id);
            this.setData(this.#currentID, "icons", iconIDs);
        }

        this.setData(this.#currentID, "icon", icon.id, icon.data);
    }

    /**
     * Removes the Icon
     * @param {Icon} icon
     * @returns {Void}
     */
    removeIcon(icon) {
        let iconIDs = this.getIconIDs();
        iconIDs = iconIDs.filter((id) => id !== icon.id);
        this.setData(this.#currentID, "icons", iconIDs);

        this.removeItem(this.#currentID, "icon", icon.id);
    }



    /**
     * Returns the Mode
     * @returns {String}
     */
    getMode() {
        return this.getString("mode") || "light";
    }

    /**
     * Sets the Dark Mode
     * @returns {Void}
     */
    setDarkMode() {
        this.setString("mode", "dark");
    }

    /**
     * Sets the Light Mode
     * @returns {Void}
     */
    setLightMode() {
        this.setString("mode", "light");
    }
}
