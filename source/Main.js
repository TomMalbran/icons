import Selection from "./Selection.js";
import Storage   from "./Storage.js";
import Canvas    from "./Canvas.js";
import Search    from "./Search.js";
import Icons     from "./Icons.js";
import Project   from "./Project.js";
import Utils     from "./Utils.js";


// The variables
let selection = new Selection();
let storage   = new Storage();
let canvas    = new Canvas();
let search    = new Search();
let icons     = new Icons();

/** @type {?Project} */
let project   = null;



/**
 * The main Function
 * @returns {Void}
 */
function main() {
    canvas.restoreMode(storage.getMode());
    project = storage.getProject();
    if (project) {
        canvas.setProject(project);
    } else {
        selection.open(storage.getProjects(), false);
    }
}

/**
 * Selects the given Project
 * @param {Number} projectID
 * @returns {Void}
 */
function selectProject(projectID) {
    const newProject = storage.getProject(projectID);
    if (!newProject) {
        return;
    }

    project = newProject;
    storage.selectProject(projectID);
    search.clear();
    canvas.setProject(project);
}

/**
 * Shows the Icons
 * @returns {Void}
 */
function showIcons() {
    if (!project) {
        return;
    }

    const icons = project.filterIcons(search.text);
    canvas.showIcons(icons, search.text);
}

/**
 * Edits/Creates a Project
 * @returns {Promise}
 */
async function editProject() {
    const newProject = await selection.editProject();
    if (!newProject) {
        return;
    }

    storage.setProject(newProject);
    selection.open(storage.getProjects(), storage.hasProject);
    if (project && project.id === newProject.id) {
        canvas.setProject(newProject);
    }

    project = newProject;
    selection.closeEdit();
}

/**
 * Deletes the given Project
 * @param {Number} projectID
 * @returns {Void}
 */
function deleteProject(projectID) {
    if (project && project.id === projectID) {
        search.clear();
        canvas.clearProject();
        project = null;
    }

    storage.removeProject(projectID);
    selection.open(storage.getProjects(), storage.hasProject);
    selection.closeDelete();
}

/**
 * Edits/Adds an Icon
 * @returns {Void}
 */
function editIcon() {
    if (!project) {
        return;
    }
    const icon = icons.editIcon(project);
    if (!icon) {
        return;
    }

    storage.setIcon(icon);
    project.setIcon(icon);
    search.removeIcon(icon);
    showIcons();
    icons.closeEdit();
}

/**
 * Deletes an Icon
 * @returns {Void}
 */
function deleteIcon() {
    if (!project) {
        return;
    }
    const icon = icons.icon;
    if (!icon) {
        return;
    }

    storage.removeIcon(icon);
    project.removeIcon(icon);
    search.addIcon(icon);
    showIcons();
    icons.closeDelete();
}

/**
 * Searches the Icons
 * @returns {Void}
 */
function searchIcons() {
    search.search(project.iconKeys);
    showIcons();
}



/**
 * The Click Event Handler
 */
document.addEventListener("click", (e) => {
    const target    = Utils.getTarget(e);
    const dataset   = target.dataset;
    const action    = dataset.action;
    const projectID = Number(dataset.project);
    const icon      = dataset.icon;
    const iconID    = Number(icon);
    let   dontStop  = false;

    switch (action) {
    // Selection Actions
    case "open-select-project":
        selection.open(storage.getProjects(), storage.hasProject);
        break;
    case "close-select-project":
        selection.close();
        break;
    case "select-project":
        selectProject(projectID);
        selection.close();
        break;

    // Schema Actions
    case "open-add-project":
        selection.openAdd();
        break;
    case "open-edit-project":
        const projectToEdit = storage.getProject(projectID);
        if (projectToEdit) {
            selection.openEdit(projectToEdit);
        }
        break;
    case "upload-file":
        selection.selectFile();
        break;
    case "remove-file":
        selection.removeFile();
        break;
    case "edit-project":
        editProject();
        break;
    case "close-edit-project":
        selection.closeEdit();
        break;
    case "open-delete-project":
        selection.openDelete(projectID);
        break;
    case "close-delete-project":
        selection.closeDelete();
        break;
    case "delete-project":
        deleteProject(selection.projectID);
        break;

    // Search
    case "search-icon":
        searchIcons();
        break;
    case "clear-search":
        search.clear();
        showIcons();
        break;

    // Icons
    case "open-add-icon":
        const iconToAdd = search.getIcon(icon);
        if (iconToAdd) {
            icons.openAdd(iconToAdd);
        }
        break;
    case "open-edit-icon":
        const iconToEdit = project.getIcon(iconID);
        if (iconToEdit) {
            icons.openEdit(iconToEdit);
        }
        break;
    case "edit-icon":
        editIcon();
        break;
    case "close-edit-icon":
        icons.closeEdit();
        break;
    case "open-delete-icon":
        icons.openDelete();
        break;
    case "delete-icon":
        deleteIcon();
        break;
    case "close-delete-icon":
        icons.closeDelete();
        break;

    // Light-Dark Modes
    case "light-mode":
        storage.setLightMode();
        canvas.setLightMode();
        break;
    case "dark-mode":
        storage.setDarkMode();
        canvas.setDarkMode();
        break;
    }

    if (action && !dontStop) {
        e.preventDefault();
    }
});

/**
 * The Search Event Handler
 */
document.querySelector(".search input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchIcons();
    }
});



// Start
main();
