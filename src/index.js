import './style.css';
import project from './project';
import todo from './todo';


let currentproject;
const projectsarr = [];
const projectdiv = document.querySelector(".projects");
const inputfield = document.querySelector(".projectinput");
const submitbutton = document.querySelector(".submitbutton");
const todoButton = document.querySelector(".todo_buttons");
const todosContainer = document.querySelector(".todos");

function saveToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(projectsarr));
}

function loadFromLocalStorage() {
    try {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            const parsedProjects = JSON.parse(storedProjects);
       
            parsedProjects.forEach(storedProject => {
                const newProject = new project(storedProject.name);
                storedProject.todos.forEach(storedTodo => {
                    const newTodo = new todo(storedTodo.title, storedTodo.description, storedTodo.duedate, storedTodo.priority);
                    newProject.addtodo(newTodo);
                });
                projectsarr.push(newProject);
            });
        } else {
            createprojectfromname("test");
            const testProject = projectsarr.find(proj => proj.name === "test");
            if (testProject) {
                const dummyTodo1 = new todo("Dummy Todo 1", "Description for Dummy Todo 1", "2024-04-15", 1);
                const dummyTodo2 = new todo("Dummy Todo 2", "Description for Dummy Todo 2", "2024-04-16", 2);
                testProject.addtodo(dummyTodo1);
                testProject.addtodo(dummyTodo2);
            }
        }
    } catch (error) {
        console.error('Error loading projects from localStorage:', error);
        
    }
}

loadFromLocalStorage();
renderProjects();



function renderProjects() {
    
    projectdiv.innerHTML = "";

   
    projectsarr.forEach(project => {
        const projecttab = document.createElement("div");
        projecttab.classList.add("projecttab");

        const projectnametab = document.createElement("h2");
        projectnametab.classList.add("projectclick");
        projectnametab.textContent = project.name;
        projectnametab.style.fontSize="30px";

        projectnametab.addEventListener("click", () => {
            
            const previousSelectedProject = document.querySelector(".selected");
            if (previousSelectedProject) {
                previousSelectedProject.classList.remove("selected");
            }
            
            projectnametab.classList.add("selected");
        });

        const deletebuttonpj = document.createElement("button");
        deletebuttonpj.textContent = "DELETE";
        deletebuttonpj.style.width="80px"
        deletebuttonpj.style.height="30px"
        deletebuttonpj.style.color="white"
        deletebuttonpj.style.backgroundColor="#B80000"
        deletebuttonpj.style.fontSize="16px"
        deletebuttonpj.style.marginTop="10px"
        deletebuttonpj.style.borderRadius="10px"
        deletebuttonpj.addEventListener("click", () => {
            deleteproject(project); 
        });

        projecttab.appendChild(projectnametab);
        projecttab.appendChild(deletebuttonpj);
        projectdiv.appendChild(projecttab);
    });

    selectproject(); 
}


function updateLocalStorage() {
    saveToLocalStorage();
}


function createprojectfromname(nameofproject) {
    if (nameofproject) {
        const existingProject = projectsarr.find(project => project.name === nameofproject);
        if (existingProject) {
            alert("A project with this name already exists. Please choose a different name.");
            return; 
        }

        const projecttab = document.createElement("div");
        projecttab.classList.add("projecttab");

        projectdiv.appendChild(projecttab);

        const newproject = new project(nameofproject);
        projectsarr.push(newproject);
        console.log("New Project:", newproject); 

        const projectnametab = document.createElement("h2");
        projectnametab.classList.add("projectclick", "selected");
        projectnametab.textContent = nameofproject;

        const deletebuttonpj = document.createElement("button");
        deletebuttonpj.textContent = "DELETE"
        deletebuttonpj.addEventListener("click", () => {
            deleteproject(project); 
        });

        projecttab.appendChild(projectnametab);
        projecttab.appendChild(deletebuttonpj);

        const allProjectTabs = document.querySelectorAll('.projectclick');
        allProjectTabs.forEach(tab => tab.classList.remove('selected'));

        
        projectnametab.classList.add('selected');

        currentproject = newproject;
        console.log("Current Project:", currentproject); 

        selectproject();
        updateLocalStorage();
        renderProjects();
    }
}

function createNewProject() {
    submitbutton.addEventListener("click", () => {

        const projectname = inputfield.value.trim();
        createprojectfromname(projectname);
    });
}

function deleteproject(projectToDelete) {
    const index = projectsarr.indexOf(projectToDelete);
    if (index !== -1) {
        projectsarr.splice(index, 1);
        todosContainer.innerHTML = "";
        renderProjects();
        updateLocalStorage();
    }
}

function selectproject() {

    const projectclicks = document.querySelectorAll(".projectclick");
    projectclicks.forEach(projectclick => {
        projectclick.addEventListener("click", () => {
            const projectname = projectclick.textContent; 
            currentproject = projectsarr.find(proj => proj.name === projectname);
            console.log("Current Project:", currentproject);
            displayTodoOfProject(currentproject);
        });
    });





}

function displayTodoOfProject(projectToBeShown) {

    todosContainer.innerHTML = "";

    projectToBeShown.todos.forEach(todo => {
       
        createtodoelement(todo);
    });


    
}

function createtodoform() {
    console.log("Function createtodoform is called.");
    const existingform = document.querySelector(".todo-form")
    if (!existingform) {
        console.log("Function entes the if barrier");
        const form1 = document.createElement("form");
        form1.classList.add("todo-form");
        todosContainer.insertBefore(form1, todosContainer.firstChild);


        const titleinput = document.createElement("input");
        titleinput.type = "text";
        titleinput.placeholder = "todo title"
        form1.appendChild(titleinput);

        const descriptioninput = document.createElement("input");
        descriptioninput.type = "text";
        descriptioninput.placeholder = "todo desc"
        form1.appendChild(descriptioninput);

        const dateinput = document.createElement("input");
        dateinput.type = "date";
        form1.appendChild(dateinput);

        const priorityinput = document.createElement("input");
        priorityinput.type = "number";
        priorityinput.placeholder = "todo priority"
        form1.appendChild(priorityinput);

        const submitbuttonform = document.createElement("button");
        submitbuttonform.type = "submit"
        submitbuttonform.textContent = "SUBMIT todo";
        form1.appendChild(submitbuttonform);

        form1.addEventListener("submit", (event) => {
            event.preventDefault(); 

            const title = titleinput.value.trim();
            const desc = descriptioninput.value.trim();
            const date = dateinput.value.trim();
            const priority = priorityinput.value.trim();

            if (title && desc && date && priority) {
                const newtodo = new todo(title, desc, date, priority);
                currentproject.addtodo(newtodo);
                createtodoelement(newtodo);
                form1.remove();
                updateLocalStorage();
            } else {
                alert("Please fill all fields");
            }
        });

    }
}

function createtodoelement(todo) {
    const todotab = document.createElement("div");
    todotab.style.width='300px'
    todotab.style.padding="20px"
    todotab.classList.add("todotab");

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title:";
    titleLabel.style.fontWeight = "bold"; 
    const title = document.createElement("div");
    title.textContent = todo.title;

    const descLabel = document.createElement("label");
    descLabel.textContent = "Description:";
    descLabel.style.fontWeight = "bold"; 
    const description = document.createElement("div");
    description.textContent = todo.description;

    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Due Date:";
    dateLabel.style.fontWeight = "bold";
    const duedate = document.createElement("div");
    duedate.textContent = todo.duedate;

    const priorityLabel = document.createElement("label");
    priorityLabel.textContent = "Priority:";
    priorityLabel.style.fontWeight = "bold";
    const priority = document.createElement("div");
    priority.textContent = todo.priority;


    const deletebutton = document.createElement("button");
    deletebutton.textContent = "delete"
    deletebutton.style.width="60px"
    deletebutton.style.height="40px"
    deletebutton.style.color="white"
    deletebutton.style.backgroundColor="#B80000"
    deletebutton.style.fontSize="16px"
    deletebutton.style.marginTop="10px"
    deletebutton.style.borderRadius="10px"
    deletebutton.addEventListener("click", () => {
        deleteTodo(todo); 
    });

    todotab.appendChild(titleLabel);
    todotab.appendChild(title);
    todotab.appendChild(descLabel);
    todotab.appendChild(description);
    todotab.appendChild(dateLabel);
    todotab.appendChild(duedate);
    todotab.appendChild(priorityLabel);
    todotab.appendChild(priority);
    todotab.appendChild(deletebutton);


    todosContainer.insertBefore(todotab, todosContainer.firstChild);

};


function deleteTodo(todo) {
    const index = currentproject.todos.indexOf(todo);
    if (index !== -1) {
        currentproject.todos.splice(index, 1);
        displayTodoOfProject(currentproject);
        updateLocalStorage();
    }
}

todoButton.addEventListener("click", createtodoform);
console.log(todoButton);

createNewProject();
selectproject();


