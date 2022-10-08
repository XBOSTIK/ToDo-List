// Нахожу все нужные мне элементы
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
// const emptyList = document.querySelector('#emptyList');
const tasksList = document.querySelector('.tasks__list');
const clearTaskBtn = document.querySelector('.clearAll-btn');

let tasks = [];
renderTaskFromLocalStorage();


checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);
tasksList.addEventListener('click', editTask);
clearTaskBtn.addEventListener('click', clearAllTask);



function addTask(event){
    event.preventDefault();

    //Текст задачи
    let taskValue = taskInput.value;

    const newTask = {
        id: Date.now(),
        title: taskValue,
        done: false,
        status: 'pending'
    }

    tasks.push(newTask);
    saveToLocalStorage();

    renderTask(newTask);

    // cleaer taskValue and add focus
    taskInput.value = ``;
    taskInput.focus();
    checkEmptyList();


}

function deleteTask(event){

    if(event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('li');

    const idTask = +parentNode.id;
    tasks = tasks.filter(task => task.id !== idTask)

    saveToLocalStorage()

    parentNode.remove();
    checkEmptyList();
}

function doneTask(event){
    if(event.target.dataset.action !== 'done') return; 

    const parentNode = event.target.closest('li');
    parentNode.classList.toggle('active');

    const idTask = +parentNode.id;
    const task = tasks.find(task => task.id === idTask);
    task.done = !task.done;
    task.status = task.status === "done" ? 'pending' : 'done';
    saveToLocalStorage()

    checkEmptyList();
}

function editTask(event){
    if(event.target.dataset.action === 'edit'){
        const parentNode = event.target.closest('li');
        let taskInput = parentNode.querySelector('.tasks__list-text');

        taskInput.removeAttribute('readonly');
        taskInput.focus();
        event.target.innerHTML = `<i class="fa-solid fa-floppy-disk"></i>`;
        event.target.dataset.action = 'save';


    } else if (event.target.dataset.action === 'save') {
        const parentNode = event.target.closest('li');
        let taskInput = parentNode.querySelector('.tasks__list-text');

        taskInput.setAttribute('readonly', "readonly");
        event.target.innerHTML = ` <i class="fa-solid fa-pen"></i>`;
        event.target.dataset.action = 'edit';

        const idTask = +parentNode.id;
        const task = tasks.find(task => task.id === idTask);
        task.title = taskInput.value;
        saveToLocalStorage()
    }
}

function clearAllTask(event){
    if(tasks.length !== 0) {
        const parentNode = event.target.closest('div');
        let allTasks = parentNode.querySelectorAll('.tasks__list-item');
        allTasks.forEach(task => task.remove())
        tasks = [];
        saveToLocalStorage()
        checkEmptyList();
    }
}

function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = `
        <li class="tasks__list-empty" id="emptyList">
            <i class="fa-solid fa-chevron-left"></i>
            <span>Empty Tasks</span>
            <i class="fa-solid fa-chevron-right"></i>
        </li>`;

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}


function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task){

    // Разметка задачи
    const taskHTML =`
    <li id="${task.id}" class="tasks__list-item ${task.done ? 'active' : ''}">
        <input type="text" class="tasks__list-text" value="${task.title}" readonly></input>
        <div class="tasks__list-buttons">
            <input type="checkbox" class="tasks__list-input done-btn" data-action="done" ${task.done ? 'checked' : ''}></input>
            <button class="tasks__list-btn edit-btn" data-action="edit">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="tasks__list-btn delete-btn" data-action="delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </li>
    `;
    tasksList.insertAdjacentHTML('beforeend', taskHTML)

}

function renderTaskFromLocalStorage(taskStatus = 'all'){
    if(localStorage.getItem('tasks')){
        tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks.forEach(task => {
            if(taskStatus === task.status || taskStatus === "all"){
                renderTask(task)
            }
        });
    }
}

// filtersBtn btns
const filtersBtn = document.querySelectorAll('.sorting-btn')
filtersBtn.forEach(item => {
    item.addEventListener('click', selectSortingBtn)
})
function selectSortingBtn(){
    filtersBtn.forEach(item => {
        item.classList.remove('active');
    })
    this.classList.add('active');
    dataBtn = this.getAttribute('data-action');

    let oldList = document.querySelectorAll('.tasks__list-item');
    oldList.forEach(item => item.remove())
    
    renderTaskFromLocalStorage(dataBtn);
}


