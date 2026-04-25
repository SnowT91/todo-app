const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList"); 

let tasks = [];

// Safe localStorage loading
try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (error) {
    tasks = [];
}

// Convert old V1 tasks (strings) to V2 tasks (objects)
tasks = tasks.map(task => {
    if (typeof task === "string") {
        return { text: task, completed: false };
    }
    return {
        text: task.text || '',
        completed: Boolean(task.completed)
    }
});

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');

        if (task.completed) {
            li.classList.add("completed");
        }

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = task.completed ? "Undo" : "Done";
        toggleBtn.type = "button";

        toggleBtn.addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.type = "button";

        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        actions.appendChild(toggleBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(taskText);
        li.appendChild(actions);

        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({ text, completed: false });
    taskInput.value = "";
    taskInput.focus();
    saveTasks();
    renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

// 1. Сохраняем мигрированные данные один раз при загрузке
saveTasks();
// 2. Отрисовываем интерфейс
renderTasks();