/**
 * The Storage
 */
export default class Storage {

    /**
     * Storage constructor
     */
    constructor() {
        this.currentID = this.getNumber("currentID", 0);
        this.nextID    = this.getNumber("nextID", 1);
        this.projects  = this.getData("projects") || [];
    }

    /**
     * Returns true if there is an item
     * @param {...(String|Number)} keys
     * @returns {Boolean}
     */
    hasItem(...keys) {
        return !!localStorage.getItem(keys.join("-"));
    }

    /**
     * Returns a stored String
     * @param {...(String|Number)} keys
     * @returns {String}
     */
    getString(...keys) {
        return localStorage.getItem(keys.join("-")) || "";
    }

    /**
     * Saves a String
     * @param {...*} items
     * @returns {Void}
     */
    setString(...items) {
        const value = items.pop();
        localStorage.setItem(items.join("-"), value);
    }

    /**
     * Returns a stored Number for the current Schema
     * @param {...*} items
     * @returns {Number}
     */
    getNumber(...items) {
        const defValue = items.pop();
        return Number(localStorage.getItem(items.join("-"))) || defValue;
    }

    /**
     * Saves a Number to the current Schema
     * @param {...*} items
     * @returns {Void}
     */
    setNumber(...items) {
        const value = items.pop();
        localStorage.setItem(items.join("-"), String(value));
    }

    /**
     * Returns a stored Object for the current Schema
     * @param {...(String|Number)} keys
     * @returns {?Object}
     */
    getData(...keys) {
        const data = localStorage.getItem(keys.join("-"));
        return data ? JSON.parse(data) : null;
    }

    /**
     * Saves an Object to the current Schema
     * @param {...*} items
     * @returns {Void}
     */
    setData(...items) {
        const value = items.pop();
        localStorage.setItem(items.join("-"), JSON.stringify(value));
    }

    /**
     * Removes an Item from the current Schema
     * @param {...(String|Number)} keys
     * @returns {Void}
     */
    removeItem(...keys) {
        localStorage.removeItem(keys.join("-"));
    }



    /**
     * Returns true if there a Project selected
     * @returns {Boolean}
     */
    get hasProject() {
        return this.currentID > 0 && this.hasItem(this.currentID, "name");
    }

    /**
     * Returns a list of Projects
     * @returns {Object[]}
     */
    getProjects() {
        const result = [];
        if (!this.projects.length) {
            return result;
        }
        
        for (const [ index, projectID ] of this.projects.entries()) {
            const name = this.getString(projectID, "name");
            result.push({
                projectID, name,
                position   : index + 1,
                isSelected : projectID === this.currentID,
            });
        }
        return result;
    }

    /**
     * Returns the Project
     * @param {Number=} projectID
     * @returns {Object}
     */
    getProject(projectID = this.currentID) {
        const position = this.projects.findIndex((id) => id === projectID) + 1;
        if (position <= 0) {
            return null;
        }

        const name = this.getString(projectID, "name");
        return { projectID, name, position };
    }



    /**
     * Selects a Project
     * @param {Number} projectID
     * @returns {Void}
     */
    selectProject(projectID) {
        this.currentID = projectID;
        this.setNumber("currentID", this.currentID);
    }

    /**
     * Saves the Project
     * @param {Object} data
     * @returns {Promise}
     */
    async setProject(data) {
        const isEdit = Boolean(data.projectID);

        // Update the next ID if this is a new Project
        if (!isEdit) {
            data.projectID = this.nextID;
            this.nextID += 1;
            this.setNumber("nextID", this.nextID);
        }

        // Save the Project data
        this.setString(data.projectID, "name", data.name);

        // Save the order
        const index = Math.min(Math.max(data.position - 1, 0), this.projects.length);
        if (!isEdit) {
            this.projects.push(data.projectID);
        } else if (this.projects[index] !== data.projectID) {
            this.projects = this.projects.filter((id) => id !== data.projectID);
            this.projects.splice(index, 0, data.projectID);
        }
        this.setData("projects", this.projects);
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

        // Save the order
        this.projects = this.projects.filter((id) => id !== projectID);
        this.setData("projects", this.projects);

        // Remove as the current Project
        if (this.currentID === projectID) {
            this.setNumber("currentID", 0);
        }
    }
}
