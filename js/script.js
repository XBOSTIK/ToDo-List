// Нахожу все нужные мне элементы
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const emptyList = document.querySelector('#emptyList');
const tasksList = document.querySelector('.tasks__list');
const clearTaskBtn = document.querySelector('.clearAll-btn');

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);
tasksList.addEventListener('click', editTask);
clearTaskBtn.addEventListener('click', clearAllTask);


// Функция для создание таска
function addTask(event){
    event.preventDefault();

    //Текст задачи
    let taskValue = taskInput.value;

    // Разметка задачи
    const taskHTML =`
        <li class="tasks__list-item">
            <input type="text" class="tasks__list-text" value="${taskValue}" readonly></input>
            <div class="tasks__list-buttons">
                <input type="checkbox" class="tasks__list-input done-btn" data-action="done"></input>
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

    // cleaer taskValue and add focus
    taskInput.value = ``;
    taskInput.focus();

    // Если есть таск, то убираем надпись "empty list"
    if(tasksList.children.length > 1) {
        emptyList.classList.add('hidden');
    }

}

// deleye task
function deleteTask(event){

    if(event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('li');
    parentNode.remove();

    // Если есть таск, то убираем надпись "empty list"
    if(tasksList.children.length === 1) {
        emptyList.classList.remove('hidden');
    }
}

// done task
function doneTask(event){
    if(event.target.dataset.action !== 'done') return; 

    const parentNode = event.target.closest('li');
    parentNode.classList.toggle('active');
}

// edit task
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

    }
}

// clear All Tasks
function clearAllTask(event){
    if(tasksList.children.length > 1) {
        let taskARR = [...tasksList.children];
        taskARR.forEach(task => {
            if(task.classList.contains('tasks__list-item')) {
                console.log(task)
                task.closest('li').remove();
                emptyList.classList.remove('hidden');
            }
        })
    }
}
