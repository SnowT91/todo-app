const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList'); 

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = task.completed ? 'Undo' : 'Done';
        toggleButton.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
        });

        actions.appendChild(toggleButton);
        actions.appendChild(deleteButton);
        li.appendChild(taskText);
        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

function addTask() {
    const Text = taskInput.value.trim();
    if (Text === '') return;

    tasks.push({ 
        text, 
        completed: false 
    });

    taskInput.value = '';
    saveTasks();
}

addButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

renderTasks();
