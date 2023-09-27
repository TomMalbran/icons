import Project from "./Project.js";
import Icon    from "./Icon.js";



/**
 * The Storage
 */
export default class Storage {

    #currentID = 0;
    #nextID    = 1;
    #projects  = [];


    /**
     * Storage constructor
     */
    constructor() {
        this.#currentID = this.getNumber("currentID", 0);
        this.#nextID    = this.getNumber("nextID", 1);
        this.#projects  = this.getData("projects") || [];
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
     * Returns a list of Projects
     * @returns {Project[]}
     */
    getProjects() {
        const result = [];
        if (!this.#projects.length) {
            return result;
        }
        
        for (const [ index, projectID ] of this.#projects.entries()) {
            const name       = this.getString(projectID, "name");
            const isSelected = projectID === this.#currentID;
            result.push(new Project(projectID, name, index + 1, isSelected));
        }
        return result;
    }

    /**
     * Returns the Project
     * @param {Number=} projectID
     * @returns {?Project}
     */
    getProject(projectID = this.#currentID) {
        const position = this.#projects.findIndex((id) => id === projectID) + 1;
        if (position <= 0) {
            return null;
        }

        const name       = this.getString(projectID, "name");
        const icons      = this.getIcons(projectID);
        const isSelected = projectID === this.#currentID;
        return new Project(projectID, name, position, isSelected, icons);
    }



    /**
     * Selects a Project
     * @param {Number} projectID
     * @returns {Void}
     */
    selectProject(projectID) {
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
        const index = Math.min(Math.max(project.position - 1, 0), this.#projects.length);
        if (!isEdit) {
            this.#projects.push(project.id);
        } else if (this.#projects[index] !== project.id) {
            this.#projects = this.#projects.filter((id) => id !== project.id);
            this.#projects.splice(index, 0, project.id);
        }
        this.setData("projects", this.#projects);
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
        this.#projects = this.#projects.filter((id) => id !== projectID);
        this.setData("projects", this.#projects);

        // Remove as the current Project
        if (this.#currentID === projectID) {
            this.setNumber("currentID", 0);
        }
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
