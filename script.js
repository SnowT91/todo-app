const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

let tasks = [];
let currentFilter = "all"; // Состояние текущего фильтра

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

    // 1. Фильтруем задачи
    let filteredTasks = tasks;
    if (currentFilter === "active") {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(t => t.completed);
    }

    // 2. Решение проблемы "визуальной пустоты" (Empty State)
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<li class="empty-state">No tasks found. Enjoy your day!</li>`;
        return;
    }

    // 3. Отрисовка
    filteredTasks.forEach((task) => {
        // Находим реальный индекс задачи в основном массиве
        const originalIndex = tasks.indexOf(task);

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
            tasks[originalIndex].completed = !tasks[originalIndex].completed;
            saveTasks();
            renderTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.type = "button";

        deleteBtn.addEventListener("click", () => {
            tasks.splice(originalIndex, 1);
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

// Обработчики для фильтров (V2.5)
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Убираем класс active у всех кнопок и добавляем нажатой
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Меняем текущий фильтр и перерисовываем
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Обработчик для очистки выполненных задач (V2.5)
clearCompletedBtn.addEventListener("click", () => {
    // Оставляем только те задачи, которые НЕ завершены
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

// 1. Сохраняем мигрированные данные один раз при загрузке
saveTasks();
// 2. Отрисовываем интерфейс
renderTasks();