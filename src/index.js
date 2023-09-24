// Global variables
const taskContainer = document.querySelector(".task__container");
let globalTaskData = [];


const addCard = () => {
    
    // Creating object to get all the task data.
    const taskData = {
        id: `${Date.now()}`,
        img: document.getElementById("imgUrl").value,
        title: document.getElementById("taskTitle").value,
        type: document.getElementById("taskType").value,
        des: document.getElementById("taskDes").value
    };
    
    // Adding cards to array and localStorage. 
    globalTaskData.push(taskData);
    saveToLocalStorage();
    
    // Creating new card 
    const newCard = generateHTML(taskData);
    
    // Inject new card to DOM
    insertToDOM(newCard);
    
    // Clear form
    document.getElementById("imgUrl").value = "";
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskType").value = "";
    document.getElementById("taskDes").value = "";
    
    return;
};

const loadExistingCard = () => {
    // Check localstorage
    const getData = localStorage.getItem("taskyCD");
    
    // parse JSON data, if exist
    if (!getData) return;
    const taskCards = JSON.parse(getData);
    
    globalTaskData = taskCards.card;
    
    globalTaskData.map((taskData) => {
        // generate HTML code for those data
        const newCard = generateHTML(taskData);
        // inject to the DOM
        insertToDOM(newCard);
    });
    
    return;
};

const deleteCard = (event) => {
    const targetID = event.target.getAttribute("name");
    const elementType = event.target.tagName;

    const removeTask = globalTaskData.filter((task) => task.id !== targetID);
    globalTaskData = removeTask;

    saveToLocalStorage();

    // Access DOM to remove card
    if (elementType === "BUTTON"){
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode
        );
    }
    else return taskContainer.removeChild(
        event.target.parentNode.parentNode.parentNode.parentNode
    );
};

const editCard = (event) => {
    const elementType = event.target.tagName;

    let title;
    let des;
    let type;
    let parentElement;
    let submit;

    // Access DOM 
    if (elementType === "BUTTON"){
        parentElement = event.target.parentNode.parentNode.parentNode;
    }
    else {
        parentElement = event.target.parentNode.parentNode.parentNode.parentNode;
    }

    title = parentElement.childNodes[1].childNodes[11].childNodes[1];
    des = parentElement.childNodes[1].childNodes[11].childNodes[3];
    type = parentElement.childNodes[1].childNodes[11].childNodes[5];
    submit = parentElement.childNodes[1].childNodes[15].childNodes[1];

    title.setAttribute("contenteditable", "true");
    des.setAttribute("contenteditable", "true");
    type.setAttribute("contenteditable", "true");
    submit.setAttribute("onclick", "saveEdit.apply(this, arguments)")
    submit.innerHTML = "Save Changes";
};

const saveEdit = (event) => {
    const targetID = event.target.getAttribute("name");
    const elementType = event.target.tagName;

    // Access DOM 
    if (elementType === "BUTTON"){
        parentElement = event.target.parentNode.parentNode.parentNode;
    }
    else {
        parentElement = event.target.parentNode.parentNode.parentNode.parentNode;
    }

    const tasktitle = parentElement.childNodes[1].childNodes[11].childNodes[1];
    const taskdes = parentElement.childNodes[1].childNodes[11].childNodes[3];
    const tasktype = parentElement.childNodes[1].childNodes[11].childNodes[5];
    const submit = parentElement.childNodes[1].childNodes[15].childNodes[1];

    const openTasktitle = parentElement.childNodes[3].childNodes[3].childNodes[1].childNodes[1].childNodes[3].childNodes[3];
    const openTaskdes = parentElement.childNodes[3].childNodes[3].childNodes[1].childNodes[1].childNodes[7].childNodes[3];
    const openTasktype = parentElement.childNodes[3].childNodes[3].childNodes[1].childNodes[1].childNodes[7].childNodes[5];

    openTasktitle.innerHTML = tasktitle.innerHTML;
    openTaskdes.innerHTML = taskdes.innerHTML;
    openTasktype.innerHTML = tasktype.innerHTML;

    const updateData = {
        title: tasktitle.innerHTML,
        type: tasktype.innerHTML,
        des: taskdes.innerHTML
    };

    globalTaskData = globalTaskData.map((task) => {
        if (task.id == targetID) {
            return {...task, ...updateData};
        }
        return task;
    });

    saveToLocalStorage();

    tasktitle.setAttribute("contenteditable", "false");
    taskdes.setAttribute("contenteditable", "false");
    tasktype.setAttribute("contenteditable", "false");
    submit.innerHTML = "Open Task";
};

const insertToDOM = (content) => {
    taskContainer.insertAdjacentHTML("beforeend", content);
    return;
};

const saveToLocalStorage = () => {
    localStorage.setItem("taskyCD", JSON.stringify({card: globalTaskData}));
    return;
};

const generateHTML = (taskData) => {
    return `
    <div class="col-md-6 col-lg-4 mt-3" id=${taskData.id}>
        <div class="card shadow-lg">

            <!-- Card header -->
            <div class="card-header d-flex justify-content-end gap-2">
                
                <!-- Edit button. -->
                <button class="btn btn-outline-info" name=${taskData.id} onclick="editCard.apply(this, arguments)">
                    <i class="fas fa-pencil-alt name=${taskData.id}"></i>
                </button>

                <!-- Delete button -->
                <button class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this, arguments)">
                    <i class="fas fa-trash" name=${taskData.id}></i>
                </button>
                
            </div>

            <!-- image section. -->
            <img src="${taskData.img}"
                class="card-img" alt="TaskY">

            <!-- Card body -->
            <div class="card-body">
                <h5 class="card-title">${taskData.title}</h5>
                <p class="card-text">${taskData.des}</p>
                <span class="badge bg-primary">${taskData.type}</span>
            </div>

            <!-- Card footer. -->
            <div class="card-footer">
                <button class="btn btn-outline-primary" name=${taskData.id}
                        data-bs-toggle="modal"
                        data-bs-target="#modal${taskData.id}"
                        >Open Task
                </button>
            </div>

        </div>

        <div class="openTaskModal">

            <!-- Open Task Modal -->
            <div class="modal fade" 
                id="modal${taskData.id}" tabindex="-1" 
                role="dialog" aria-labelledby="openTaskTitle"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">

                        <!-- Modal header. -->
                        <div class="modal-header">
                            <!-- Modal Title -->
                            <h5 class="modal-title" id="openTaskTitle">${taskData.title}</h5>
                            <!-- Close button -->
                            <button type="button"
                                    class="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close">
                            </button>
                        </div>

                        <!-- Modal Body -->
                        <div class="modal-body">
                            <img src="${taskData.img}" class="card-img" alt="TaskY">
                            <p class="card-text">${taskData.des}</p>
                            <span class="badge bg-primary">${taskData.type}</span>
                        </div>

                        <!-- Modal Footer -->
                        <div class="modal-footer .d-flex justify-content-center">
                            <button type="button" 
                                    class="btn btn-secondary" 
                                    data-bs-dismiss="modal">Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </div>`;
};
