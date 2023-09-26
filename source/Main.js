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
 * @returns {Boolean}
 */
function selectProject(projectID) {
    const newProject = storage.getProject(projectID);
    if (!newProject) {
        return false;
    }

    project = newProject;
    storage.selectProject(projectID);
    canvas.setProject(newProject);
    search.clear();
    return true;
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
    selection.closeEdit();
}

/**
 * Deletes the given Project
 * @param {Number} projectID
 * @returns {Void}
 */
function deleteProject(projectID) {
    if (project && project.id === projectID) {
        // TODO: Remove project
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
    canvas.showIcons(project.icons);
    icons.closeEdit();
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
        const newProject = storage.getProject(projectID);
        if (newProject) {
            selection.openEdit(newProject);
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
        search.search();
        break;
    case "clear-search":
        search.clear();
        break;

    // Icons
    case "open-add-icon":
        const iconData = search.getIcon(icon);
        if (iconData) {
            icons.openAdd(iconData);
        }
        break;
    case "edit-icon":
        editIcon();
        break;
    case "close-edit-icon":
        icons.closeEdit();
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
        search.search();
    }
});



// Start
main();
