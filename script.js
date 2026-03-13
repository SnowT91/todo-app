function addTask() {
    const input = document.getElementById('taskInput');
    const task = input.value;
    if (task === '') return;
    const li = document.createElement('li');
    li.textContent = task;
    li.onclick = function() {
    li.remove();
    };
    document.getElementById('taskList').appendChild(li);
    input.value = '';
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
function saveTasks() {
    const lists = document.qetElementById('taskList');
    lists.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task;
        li.onclick = function() {
            tasks.splice(index, 1);
            saveTasks();
        };
    lists.appendChild(li);
    });
}
function addTask() {
    const input = document.getElementById('taskInput');
    if (task === '') return;
    tasks.push(input.value);
    saveTasks();
    input.value = '';
}
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}
renderTasks()