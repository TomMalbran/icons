import Selection from "./Selection.js";
import Storage   from "./Storage.js";
import Utils     from "./Utils.js";


/** @type {Selection} */
let selection = null;

/** @type {Storage} */
let storage   = null;

/** @type {Project} */
let project   = null;



/**
 * The main Function
 * @returns {Void}
 */
function main() {
    selection = new Selection();
    storage   = new Storage();

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
}

/**
 * Selects the given Project
 * @param {Number} projectID
 * @returns {Void}
 */
function selectProject(projectID) {
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
        // TODO: Delete project
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
    }

    if (action && !dontStop) {
        e.preventDefault();
    }
});



// Start
main();
