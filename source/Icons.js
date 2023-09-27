import Dialog  from "./Dialog.js";
import Project from "./Project.js";
import Icon    from "./Icon.js";



/**
 * The Icons
 */
export default class Icons {

    /** @type {Dialog} */
    #editDialog;

    /** @type {Dialog} */
    #deleteDialog;

    /** @type {?Icon} */
    #icon;


    /**
     * Selection constructor
     */
    constructor() {
        // Add/Edit
        this.#editDialog   = new Dialog("edit-icon");

        // Delete
        this.#deleteDialog = new Dialog("delete-icon");
    }

    /**
     * Returns the Icon
     * @returns {Icon}
     */
    get icon() {
        return this.#icon;
    }

    /**
     * Opens the Edit Dialog to Add
     * @param {Icon} icon
     * @returns {Void}
     */
    openAdd(icon) {
        this.#icon = icon;

        this.#editDialog.open();
        this.#editDialog.setTitle("Add an Icon");
        this.#editDialog.setButton("Add");
        this.#editDialog.toggleButton("delete", false);

        this.#editDialog.setContent(".icon-icon", icon.key);
        this.#editDialog.setContent(".icon-name", icon.title);
        this.#editDialog.setInput("name", icon.key);
    }

    /**
     * Opens the Edit Dialog to Edit
     * @param {Icon} icon
     * @returns {Void}
     */
    openEdit(icon) {
        this.#icon = icon;

        this.#editDialog.open();
        this.#editDialog.setTitle("Edit an Icon");
        this.#editDialog.setButton("Edit");
        this.#editDialog.toggleButton("delete", true);

        this.#editDialog.setContent(".icon-icon", icon.key);
        this.#editDialog.setContent(".icon-name", icon.name);
        this.#editDialog.setInput("name", icon.name);
    }

    /**
     * Closes the Add/Edit Dialog
     * @returns {Void}
     */
    closeEdit() {
        this.#icon = null;
        this.#editDialog.close();
    }

    /**
     * Edits an icon
     * @param {Project} project
     * @returns {?Icon}
     */
    editIcon(project) {
        if (!this.#icon) {
            return null;
        }

        this.#editDialog.hideErrors();
        const name = this.#editDialog.getString("name");
        if (!name) {
            this.#editDialog.showError("empty");
        } else if (!name.match(/^[a-z]+[a-z-]*[a-z]+$/)) {
            this.#editDialog.showError("invalid");
        } else if (project.hasIcon(name)) {
            this.#editDialog.showError("repeated");
        }
        if (this.#editDialog.hasError) {
            return null;
        }

        this.#icon.name = name;
        return this.#icon;
    }



    /**
     * Opens the Delete Dialog
     * @returns {Void}
     */
    openDelete() {
        this.#deleteDialog.open();
    }

    /**
     * Closes the Delete and Edit Dialogs
     * @returns {Void}
     */
    closeDelete() {
        this.#editDialog.close();
        this.#deleteDialog.close();
    }
}
