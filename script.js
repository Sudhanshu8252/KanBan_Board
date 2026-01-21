let tasksData = {};
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const columns = [todo, progress, done];
let dragElement = null;

function addTask(title, desc, column) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");
    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `;
    column.appendChild(div);

    div.addEventListener("drag", () => {
        dragElement = div;
    });

    div.querySelector("button").addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    });

    return div;
}

function updateTaskCount() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll('.task');
        const count = col.querySelector('.right');

        tasksData[col.id] = Array.from(tasks).map(t => ({
            title: t.querySelector('h2').innerText,
            desc: t.querySelector('p').innerText
        }));

        localStorage.setItem("tasks", JSON.stringify(tasksData));
        count.textContent = tasks.length;
    });
}

if (localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"));
    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => addTask(task.title, task.desc, column));
    }
    updateTaskCount();
}

function addDragEvents(column) {
    column.addEventListener("dragenter", e => { e.preventDefault(); column.classList.add("hover-over"); });
    column.addEventListener("dragleave", () => { column.classList.remove("hover-over"); });
    column.addEventListener("dragover", e => e.preventDefault());
    column.addEventListener("drop", () => {
        column.classList.remove("hover-over");
        column.appendChild(dragElement);
        updateTaskCount();
    });
}

addDragEvents(todo);
addDragEvents(progress);
addDragEvents(done);

const toggleModalButton = document.querySelector('#toggle-modal');
const modal = document.querySelector('.modal');
const modalBg = document.querySelector('.modal .bg');
const addTaskButton = document.querySelector('#add-new-task');

toggleModalButton.addEventListener("click", () => modal.classList.toggle("active"));
modalBg.addEventListener("click", () => modal.classList.remove("active"));

addTaskButton.addEventListener("click", () => {
    const title = document.querySelector('#task-title-input').value.trim();
    const desc = document.querySelector('#task-desc-input').value.trim();
    if (title === "") return;
    addTask(title, desc, todo);
    updateTaskCount();
    document.querySelector('#task-title-input').value = "";
    document.querySelector('#task-desc-input').value = "";
    modal.classList.remove("active");
});
