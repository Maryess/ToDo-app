const form = document.getElementById("form")
const input = document.getElementById("taskInput")
const tasksList = document.getElementById("tasksList")
const deleteList = document.getElementById("emptyList")

let tasks = []

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach((task) =>liveHTML(task))
}

checkEmptyList()

form.addEventListener('submit',addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)


function addTask(event){
        event.preventDefault()
        //достаем текст задачи из поля вводда
        const taskText = input.value 

        //записываем задачу в виде обьекта
        const newTask = {
            id: Date.now(),
            text: taskText,
            done: false
        }

        //Добавим обьект в массив с задачами
        tasks.push(newTask)

        liveHTML(newTask)
    
        //Очищаем поле ввода и возвращаем на него фокус
        input.value = ""
        input.focus()
    
        //Удаление блока из страницы
        
        checkEmptyList()
        saveToLocalStorage()
}

function deleteTask(event){
    if(event.target.dataset.action != "delete") return  //функция закончит свою работу

    const parenNode = event.target.closest('.list-group-item')
    
    //определить id задачи
    const id = Number(parenNode.id)

    //находим id для удаления
    const index = tasks.findIndex((task) =>task.id === id) //

    
    //удаляю элемент из массива
    tasks.splice(index,1) // второй аргумент - количество удаленных 
    parenNode.remove() 


    checkEmptyList()
    saveToLocalStorage()
}
 

function doneTask(event){

    if(event.target.dataset.action != 'done') return       
    
    

    const parenNode = event.target.closest('.list-group-item')
    const taskTitle = parenNode.querySelector(".task-title")
    taskTitle.classList.toggle('task-title--done')

    //определить id задачи
    const id = Number(parenNode.id)

    //находим id для done
    const index = tasks.find((task) =>{
        if(task.id === id){
            task.done = !task.done
        }    
    }) // отличается от findIndex тем, что возвращает не индекс элемента, а найденный элемент 

    saveToLocalStorage()
}

function checkEmptyList(){


    if(tasks.length === 0){
        const emptyHTML = `
        <li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
        </li> 
        `
        tasksList.insertAdjacentHTML('afterbegin', emptyHTML)

    }else if(tasks.length >0){
        const emptyHTML = document.getElementById("emptyList")
        emptyHTML ? emptyHTML.remove() : null
    }
}

function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function liveHTML(newTask){
    //Формируем cssClass
    const cssClass = newTask.done ? "task-title task-title--done" : "task-title"

    //Формируем разметку для новой задачи 
    const taskHtml =
     `
    <li id = "${newTask.id}"class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${newTask.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>
        ` 

    tasksList.insertAdjacentHTML('beforeend', taskHtml)
}
