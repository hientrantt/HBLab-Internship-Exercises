const today = new Date();
let popup = document.getElementById("task");
let taskTitle = document.getElementById("task__title");
let taskDescription = document.getElementById("task__description");
let list = new TaskList();
let checkIcon = document.getElementById("task__check");

//RENDER CALENDAR
const renderListTask = () => {
    list.renderList();
}

//ADD TASK CLICK
function haveTask(element, value) {
    for (let item of element.classList) {
        if (item == "calender__task") {
            let task = list.findTaskByDate(value);
            return task;
        }
    }
    return undefined;
}

function addTaskCalenderBtn() {
    let arrTd = document.getElementsByClassName("calender__date");
    let elementToday, date;
    
    for(let item of arrTd){
        for(let classItem of item.classList){
            if(classItem == "calender__today"){
                elementToday = item;
                break;
            }
        }
    }
    
    if(elementToday==undefined){
        alert("Today is the weekend, can't add task!");
    }else{
        date = elementToday.getAttribute("data-date");
        addTaskCalenderDate(elementToday, date);
    }
}

function addTaskCalenderDate(element, value) {
    //show popup edit task cũ nếu đã có task
    //check xem có class "calender__task" hay không? 
    let task = haveTask(element, value);
    closeTask();
    if (task != undefined) {
        popup.classList.add("oldTask");
        popup.style.display = "block";

        document.getElementById("task__categoryBtn").style.display = "none";
        document.getElementById("task__categorySelect").style.display = "block";
        document.getElementById("task__categorySelect").value = task.category;
        document.getElementById("task__title").value = task.title;
        document.getElementById("task__description").value = task.description;
        document.getElementById("task__date").innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${task.date}`;
        popup.setAttribute("data-date", task.date);

        if (task.status == COMPLETED) {
            checkIcon.style.color = "blue";
            checkIcon.style.borderColor = "blue";
        } else {
            checkIcon.style.color = "#8d8d91b6";
            checkIcon.style.borderColor = "#8d8d9169";
        }

        document.getElementById("task__closeBtn").style.display = "none";
        document.getElementById("task__deleteBtn").style.display = "block";

        document.getElementById("task__addBtn").style.display = "none";
        document.getElementById("task__cancelBtn").style.display = "block";
        document.getElementById("task__saveEditBtn").style.display = "block";
        document.getElementById("task__button").style.padding = "0 0 0 58%";

    } else {
        //show popup thêm task nếu chưa có task
        let arr = value.split('.');
        let date = `${arr[0]}.${arr[1]}.${arr[2]}`;
        popup.classList.remove("oldTask");
        popup.style.display = "block";
        document.getElementById("task__date").innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${date}`;
        popup.setAttribute("data-date", date);

        document.getElementById("task__closeBtn").style.display = "block";
        document.getElementById("task__deleteBtn").style.display = "none";

        document.getElementById("task__addBtn").style.display = "block";
        document.getElementById("task__cancelBtn").style.display = "none";
        document.getElementById("task__saveEditBtn").style.display = "none";
        document.getElementById("task__button").style.padding = "0 0 0 76%";
    }

}

// ADD TASK TO LIST
function addTaskToCalendar() {
    let title = document.getElementById("task__title").value.trim();
    let description = document.getElementById("task__description").value.trim();
    let category = document.getElementById("task__categorySelect").value;
    let categoryClicked = document.getElementById("task__categorySelect").style.display;
    let date = popup.getAttribute("data-date");
    let statusColor = document.getElementById("task__check").style.color;

    if (title == "" || description == "" || categoryClicked != "block") {
        alert("The title, description, and category must not empty!");
        return;
    }

    if (statusColor == "blue") {
        statusColor = COMPLETED;
    } else {
        statusColor = TODO;
    }

    let task = new Task(title, description, category, date, statusColor);
    list.addTask(task);

    list.renderList();
    popup.style.display = "none";
    closeTask();
    setStorage();
    updateProgress();
}

//CLOSE
function closeTask() {
    popup.style.display = "none";
    taskTitle.value = "";
    taskDescription.value = "";
    document.getElementById("task__categoryBtn").style.display = "block";
    document.getElementById("task__categorySelect").style.display = "none";
    document.getElementById("task__categoryBtn").setAttribute("data-clicked", 0);
    checkIcon.style.color = "#8d8d91b6";
    checkIcon.style.borderColor = "#8d8d9169";
}

//EDIT
function showCategoryBox() {
    document.getElementById("task__categoryBtn").style.display = "none";
    document.getElementById("task__categorySelect").style.display = "block";
    document.getElementById("task__categoryBtn").setAttribute("data-clicked", 1);
}

function editStatus() {
    if (checkIcon.style.color != "blue") {
        checkIcon.style.color = "blue";
        checkIcon.style.borderColor = "blue";
    } else {
        checkIcon.style.color = "#8d8d91b6";
        checkIcon.style.borderColor = "#8d8d9169";
    }
}

function saveEditTask() {
    let date = popup.getAttribute("data-date");
    list.removeTaskByDate(date);
    addTaskToCalendar();
}

//DELETE
function deleteTaskBtnClick() {
    closeTask();
    let date = popup.getAttribute("data-date");
    deleteTask(date);
}

function deleteTask(date) {
    list.removeTaskByDate(date);
    renderListTask();
    setStorage();
    updateProgress();
}

//STORE / BACKUP
function setStorage() {
    var jsonListTask = JSON.stringify(list.taskList);
    localStorage.setItem("ListTask", jsonListTask);
}

function getStorage() {
    jsonlist = localStorage.getItem("ListTask");
    var tmp = JSON.parse(jsonlist);
    list.taskList = tmp;
    list.renderList();
    updateProgress();
}


//PROGRESS
function updateProgress() {

    let completedTaskInMonth = 0, totalTaskInMonth = 0, completedTaskOfCalendar = 0;
    let listProgress = document.getElementsByClassName("manager__progress__item__counter");

    for (const item of list.taskList) {
        const monthOfTask = item.date.split('.')[1];
        if (monthOfTask == today.getMonth() * 1 + 1) {
            totalTaskInMonth++;
            if (item.status == COMPLETED) {
                completedTaskInMonth++;
                completedTaskOfCalendar++;
            }
        } else if (item.status == COMPLETED) {
            completedTaskOfCalendar++;
        }
    }

    document.getElementById("manager__progress__text").innerHTML = `${completedTaskInMonth}/${totalTaskInMonth}`;
    listProgress[0].innerHTML = completedTaskInMonth;
    listProgress[1].innerHTML = totalTaskInMonth;
    listProgress[2].innerHTML = completedTaskOfCalendar;

    let percent = completedTaskInMonth / totalTaskInMonth * 100;
    if (isNaN(percent)) percent = 0;
    document.getElementById("CompletionLoading").style.setProperty("width", `${percent}%`);

}


// DRAG DROP
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.getAttribute("data-date"));
}

function dropDelete(ev) {
    ev.preventDefault();
    let date = ev.dataTransfer.getData("Text");
    deleteTask(date);
    closeTask();
}

function dropEditDate(ev, element) {
    ev.preventDefault();
    let date = ev.dataTransfer.getData("Text");
    let task = list.findTaskByDate(date);
    deleteTask(date);
    task.date = element.getAttribute("data-date");
    list.addTask(task);
    list.renderList();
    setStorage();
    updateProgress();
}