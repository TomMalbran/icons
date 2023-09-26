import Dialog  from "./Dialog.js";
import Project from "./Project.js";



/**
 * The Selection
 */
export default class Selection {

    /** @type {Dialog} */
    #selectDialog;

    /** @type {?HTMLElement} */
    #search;

    /** @type {?HTMLElement} */
    #selectEmpty;

    /** @type {?HTMLElement} */
    #selectList;

    /** @type {Dialog} */
    #editDialog;

    /** @type {Dialog} */
    #deleteDialog;

    /** @type {Project} */
    #project;

    projectID = 0;
    #file;
    #path;
    #icons;


    /**
     * Selection constructor
     */
    constructor() {
        // Selection
        this.#selectDialog = new Dialog("select-project");
        this.#search       = document.querySelector(".search");
        this.#selectEmpty  = document.querySelector(".select-empty");
        this.#selectList   = document.querySelector(".select-list");

        // Add/Edit
        this.#editDialog   = new Dialog("edit-project");

        // Delete
        this.#deleteDialog = new Dialog("delete-project");
    }

    /**
     * Opens the Select Dialog
     * @param {Project[]} projects
     * @param {Boolean}   hasProject
     * @returns {Void}
     */
    open(projects, hasProject) {
        this.#search?.classList.add("hidden");
        if (this.#selectEmpty) {
            this.#selectEmpty.style.display = projects.length ? "none" : "block";
        }
        if (this.#selectList) {
            this.#selectList.innerHTML = "";
        }

        for (const project of projects) {
            const li = document.createElement("li");
            li.dataset.action  = "select-project";
            li.dataset.project = project.id;
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
            editBtn.dataset.project = project.id;
            buttons.appendChild(editBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML       = "Delete";
            deleteBtn.className       = "btn btn-small";
            deleteBtn.dataset.action  = "open-delete-project";
            deleteBtn.dataset.project = project.id;
            buttons.appendChild(deleteBtn);

            this.#selectList?.appendChild(li);
        }

        this.#selectDialog.toggleClose(hasProject);
        this.#selectDialog.open();
    }

    /**
     * Closes the Select Dialog
     * @returns {Void}
     */
    close() {
        this.#selectDialog.close();
        this.#search?.classList.remove("hidden");
   }



    /**
     * Opens the Add Dialog
     * @returns {Void}
     */
    openAdd() {
        this.file = null;
        this.path = "";

        this.#editDialog.open();
        this.#editDialog.setTitle("Add a Project");
        this.#editDialog.setButton("Add");

        this.#editDialog.setInput("name", "");
        this.#editDialog.setInput("position", "0");
    }

    /**
     * Opens the Edit Dialog
     * @param {Project} project
     * @returns {Void}
     */
    openEdit(project) {
        this.#project = project;
        this.#file = null;
        this.#path = "";

        this.#editDialog.open();
        this.#editDialog.setTitle("Edit the Project");
        this.#editDialog.setButton("Edit");

        this.#editDialog.setInput("name", project.name);
        this.#editDialog.setInput("position", project.position);
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
            this.#file = file;
            this.#path = file.name;
        });
    }

    /**
     * Removes a File in the Add/Edit Dialog
     * @returns {Void}
     */
    removeFile() {
        this.files = null;
        this.path  = "";
        this.icons = null;
        this.#editDialog.setInput("name", "");
    }

    /**
     * Edits/Create a Project
     * @returns {Promise.<?Project>}
     */
    editProject() {
        return new Promise((resolve) => {
            const name     = this.#editDialog.getString("name");
            const position = this.#editDialog.getNumber("position");
            let   icons    = {};

            this.#editDialog.hideErrors();
            if (!name) {
                this.#editDialog.showError("name");
            }
            if (this.file) {
                const reader = new FileReader();
                reader.readAsText(this.file);
                reader.onload = () => {
                    const text = String(reader.result);
                    try {
                        icons = JSON.parse(text);
                    } catch {
                        this.#editDialog.showError("json");
                    }
                };
            }

            if (this.#editDialog.hasError) {
                resolve(null);
                return;
            }

            if (this.#project) {
                this.#project.name     = name;
                this.#project.position = position;
                resolve(this.#project);
            } else {
                resolve(new Project(0, name, position, false, icons));
            }
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
