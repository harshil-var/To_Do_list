const inputBox = document.getElementById('inputBox');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

let editTodo = null;

// Helper function to create DOM elements for a todo item
const createTodoElement = (text) => {
    const li = document.createElement("li");
    
    const p = document.createElement("p");
    p.textContent = text;
    li.appendChild(p);

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.classList.add("btn", "editBtn");
    editBtn.title = "Edit";
    
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.classList.add("btn", "deleteBtn");
    deleteBtn.title = "Delete";

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    li.appendChild(actionsDiv);

    return li;
}

// Function to add todo
const addTodo = () => {
    const inputText = inputBox.value.trim();
    if (inputText.length <= 0) {
        alert("You must write something in your to do!");
        return false;
    }

    if (addBtn.innerHTML.includes("fa-check")) {
        // We are in edit mode
        const originalText = editTodo.querySelector('p').textContent;
        editLocalTodos(originalText, inputText);
        editTodo.querySelector('p').textContent = inputText;
        
        // Reset button
        addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
        inputBox.value = "";
        editTodo = null;
    }
    else {
        // Add new mode
        const li = createTodoElement(inputText);
        todoList.appendChild(li);
        inputBox.value = "";
        saveLocalTodos(inputText);
    }
    inputBox.focus();
}

// Function to update : (Edit/Delete) todo
const updateTodo = (e) => {
    // Find the closest button if they clicked specifically on the <i> icon
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.classList.contains("deleteBtn")) {
        const li = btn.closest('li');
        // Add fade out animation class
        li.classList.add('fadeOut');
        deleteLocalTodos(li.querySelector('p').textContent);
        
        // Wait for animation to finish before removing from DOM
        setTimeout(() => {
            li.remove();
        }, 400);
    }

    if (btn.classList.contains("editBtn")) {
        const li = btn.closest('li');
        inputBox.value = li.querySelector('p').textContent;
        inputBox.focus();
        
        // Change add button to save button icon
        addBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        editTodo = li;
    }
}

// Function to save local todo
const saveLocalTodos = (todo) => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to get local todo
const getLocalTodos = () => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
        todos.forEach(todo => {
            const li = createTodoElement(todo);
            todoList.appendChild(li);
        });
    }
}

// Function to delete local todo
const deleteLocalTodos = (todoText) => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    let todoIndex = todos.indexOf(todoText);
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

// Function to update local todo
const editLocalTodos = (oldText, newText) => {
    let todos = JSON.parse(localStorage.getItem("todos"));
    let todoIndex = todos.indexOf(oldText);
    if (todoIndex !== -1) {
        todos[todoIndex] = newText;
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

// Call addTodo on Enter keypress
inputBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

document.addEventListener('DOMContentLoaded', getLocalTodos);
addBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', updateTodo);
