const createUser = document.querySelector(".create-user");
const loginUser = document.querySelector(".login-user");
const createTodo = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list");
var editButton = (function() {
    var button;
    var state = false;
    return {
        store: function(element) {
            button = element;
            state = true;
        },
        getElement: function() {
            return button;
        },
        exists: function() {
            return state;
        },
        clear: function() {
            state = false;
        }
    }
})();

createUser.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = createUser.querySelector(".username").value;
    const password = createUser.querySelector(".password").value;
    post("/createUser", {username, password});
})

loginUser.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = loginUser.querySelector(".username").value;
    const password = loginUser.querySelector(".password").value;
    post("/login", {username, password})
        .then(({ status }) => {
            (status === 200) ? alert("Login succes!") : alert("Login failed!")
        })
})

createTodo.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoText = createTodo.querySelector(".todo-input").value;
    if(todoText) {
        var newTodoElement = `<div class="todo">
                                   <div>
                                        ${todoText}
                                   </div>
                                   <div>
                                        <input type="submit" value="edit" class="edit-todo-button"></input>
                                        <input type="submit" value="x" class="delete-todo-button"></input>
                                   </div>
                              </div>`;
        todoList.insertAdjacentHTML("beforeend", newTodoElement);
    }
    createTodo.querySelector(".todo-input").value = "";
})

document.addEventListener("click", function(e) {
    if(e.target && e.target.className == "delete-todo-button"){
        var getTodo = e.target.parentElement.parentElement;
        getTodo.remove();
    }
})

document.addEventListener("click", function(e) {
    if(!editButton.exists()) {
        if(e.target && e.target.className == "edit-todo-button"){
            editButton.store(e.target);
            editButton.getElement().classList.add("hide-edit-todo-button");
            var todoElement = e.target.parentElement.previousElementSibling;
    		var getTodo = todoElement.innerHTML.trim();
    	    todoElement.innerHTML = `<form>
    	                                  <input type="text" value="${getTodo}"></input><input type="submit" value="finish" class="update-todo-button"></input>
    	                             </form>`;
        }
    }

})

document.addEventListener("click", function(e) {
    if(e.target && e.target.className == "update-todo-button"){
        editButton.getElement().classList.remove("hide-edit-todo-button");
        editButton.clear();
        var todoElement = e.target.previousElementSibling;
		var getTodo = todoElement.value.trim();
		console.log(getTodo);
	    todoElement.parentElement.parentElement.innerHTML = `${getTodo}`;
    }
})

function post (path, data) {
    return window.fetch(path, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}