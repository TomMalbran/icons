import Selection from "./Selection.js";
import Storage   from "./Storage.js";
import Canvas    from "./Canvas.js";
import Search    from "./Search.js";
import Project   from "./Project.js";
import Utils     from "./Utils.js";


/** @type {Selection} */
let selection = null;

/** @type {Storage} */
let storage   = null;

/** @type {Canvas} */
let canvas    = null;

/** @type {Search} */
let search    = null;

/** @type {Project} */
let project   = null;



/**
 * The main Function
 * @returns {Void}
 */
function main() {
    selection = new Selection();
    storage   = new Storage();
    canvas    = new Canvas();
    search    = new Search();

    canvas.restoreMode(storage.getMode());
    if (storage.hasProject) {
        const data = storage.getProject();
        setProject(data);
    } else {
        selection.open(storage.getProjects(), false);
    }
}

/**
 * Creates the Project and restores the State
 * @param {Object} data
 * @returns {Void}
 */
function setProject(data) {
    project = new Project(data);
    canvas.setProject(project);
}

/**
 * Selects the given Project
 * @param {Number} projectID
 * @returns {Boolean}
 */
function selectProject(projectID) {
    const data = storage.getProject(projectID);
    if (!data) {
        return false;
    }
    if (project) {
        // TODO: Remove project
    }
    storage.selectProject(projectID);
    setProject(data);
    return true;
}

/** 
 * Edits/Creats a Project
 * @returns {Promise}
 */
async function editProject() {
    const data = await selection.editProject();
    if (data) {
        storage.setProject(data);
        selection.open(storage.getProjects(), storage.hasProject);
        if (project && data && project.projectID === data.projectID) {
            selectProject(data.projectID);
        }
        selection.closeEdit();
    }
}

/**
 * Deletes the given Project
 * @param {Number} projectID
 * @returns {Void}
 */
function deleteProject(projectID) {
    if (project && project.projectID === projectID) {
        // TODO: Remove project
    }
    storage.removeProject(projectID);
    selection.open(storage.getProjects(), storage.hasProject);
    selection.closeDelete();
}



/**
 * The Click Event Handler
 */
document.addEventListener("click", (e) => {
    const target    = Utils.getTarget(e);
    const action    = target.dataset.action;
    const projectID = Number(target.dataset.project);
    let   dontStop  = false;
    
    switch (action) {
    // Selection Actions
    case "open-select":
        selection.open(storage.getProjects(), storage.hasProject);
        break;
    case "close-select":
        selection.close();
        break;
    case "select-project":
        selectProject(projectID);
        selection.close();
        break;

    // Schema Actions
    case "open-add":
        selection.openEdit({});
        break;
    case "open-edit":
        const projectData = storage.getProject(projectID);
        if (projectData) {
            selection.openEdit(projectData);
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
    case "close-edit":
        selection.closeEdit();
        break;
    case "open-delete":
        selection.openDelete(projectID);
        break;
    case "close-delete":
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
document.querySelector(".search input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        search.search();
    }
});



// Start
main();
