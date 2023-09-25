import Dialog from "./Dialog.js";



/**
 * The Selection
 */
export default class Selection {

    /** @type {Dialog} */
    #selectDialog;

    /** @type {HTMLElement} */
    #selectEmpty;

    /** @type {HTMLElement} */
    #selectList;

    /** @type {Dialog} */
    #editDialog;

    /** @type {Dialog} */
    #deleteDialog;

    
    /**
     * Selection constructor
     */
    constructor() {
        // Selection
        this.#selectDialog = new Dialog("select-project");
        this.#selectEmpty  = document.querySelector(".select-empty");
        this.#selectList   = document.querySelector(".select-list");

        // Add/Edit
        this.#editDialog   = new Dialog("edit-project");

        // Delete
        this.#deleteDialog = new Dialog("delete-project");
    }

    /**
     * Opens the Select Dialog
     * @param {Object[]} projects
     * @param {Boolean}  hasProject
     * @returns {Void}
     */
    open(projects, hasProject) {
        this.#selectDialog.open();
        this.#selectDialog.toggleClose(hasProject);
        this.#selectEmpty.style.display = projects.length ? "none" : "block";
        this.#selectList.innerHTML = "";

        for (const project of projects) {
            const li = document.createElement("li");
            li.dataset.action  = "select-project";
            li.dataset.project = project.projectID;
            if (project.isSelected) {
                li.className = "selected";
            }

            const name = document.createElement("div");
            name.innerHTML = project.name;
            name.className = "select-name";
            li.appendChild(name);

            const buttons = document.createElement("div");
            li.appendChild(buttons);

            const editBtn = document.createElement("button");
            editBtn.innerHTML       = "Edit";
            editBtn.className       = "btn btn-small";
            editBtn.dataset.action  = "open-edit-project";
            editBtn.dataset.project = project.projectID;
            buttons.appendChild(editBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML       = "Delete";
            deleteBtn.className       = "btn btn-small";
            deleteBtn.dataset.action  = "open-delete-project";
            deleteBtn.dataset.project = project.projectID;
            buttons.appendChild(deleteBtn);

            this.#selectList.appendChild(li);
        }
    }

    /**
     * Closes the Select Dialog
     * @returns {Void}
     */
    close() {
        this.#selectDialog.close();
    }



    /**
     * Opens the Edit Dialog
     * @param {Object} data
     * @returns {Void}
     */
    openEdit(data) {
        const isEdit = Boolean(data.projectID);
        this.data    = data;
        this.file    = null;
        this.path    = "";

        this.#editDialog.open();
        this.#editDialog.setTitle(isEdit  ? "Edit the Project" : "Add a Project");
        this.#editDialog.setButton(isEdit ? "Edit" : "Add");

        this.#editDialog.setInput("name",     isEdit ? data.name     : "");
        this.#editDialog.setInput("position", isEdit ? data.position : "0");
    }

    /**
     * Closes the Add/Edit Dialog
     * @returns {Void}
     */
    closeEdit() {
        this.#editDialog.close();
    }

    /**
     * Selects a File in the Add/Edit Dialog
     * @returns {Void}
     */
    selectFile() {
        this.#editDialog.selectFile("file", (file) => {
            this.file = file;
            this.path = file.name;
        });
    }

    /**
     * Removes a File in the Add/Edit Dialog
     * @returns {Void}
     */
    removeFile() {
        this.files = null;
        this.path  = "";
        this.data.icons = null;
        this.#editDialog.setInput("name", "");
    }

    /**
     * Edits/Create a Project
     * @returns {Promise}
     */
    editProject() {
        return new Promise((resolve) => {
            this.data.name     = this.#editDialog.getInput("name");
            this.data.position = this.#editDialog.getInput("position");
            this.data.icons    = {};

            this.#editDialog.hideErrors();
            if (!this.data.name) {
                this.#editDialog.showError("name");
            }
            if (this.file) {
                const reader = new FileReader();
                reader.readAsText(this.file);
                reader.onload = () => {
                    const text = String(reader.result);
                    try {
                        this.data.icons = JSON.parse(text);
                    } catch {
                        this.#editDialog.showError("json");
                    }
                };
            }

            if (this.#editDialog.hasError) {
                resolve();
                return;
            }
            resolve(this.data);
        });
    }



    /**
     * Opens the Delete Dialog
     * @param {Number} projectID
     * @returns {Void}
     */
    openDelete(projectID) {
        this.projectID = projectID;
        this.#deleteDialog.open();
    }

    /**
     * Closes the Delete Dialog
     * @returns {Void}
     */
    closeDelete() {
        this.projectID = 0;
        this.#deleteDialog.close();
    }
}
