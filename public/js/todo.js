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

createTodo.addEventListener("submit", async (e) => {
    e.preventDefault();
    const todo = createTodo.querySelector(".todo-input").value;
    if(todo) {
        const response = await request("POST", "/todo", {todo});
        const responseJSON = await response.json();
        const todoID = responseJSON.ID;
        var newTodoElement = `<div class="todo" data-todoID="${todoID}">
                                   <div>
                                        ${todo}
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
        var todoID = getTodo.dataset.todoid;
        request("DELETE", `/todo/${todoID}`, {todoID})
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
        e.preventDefault();
        var getTodo = e.target.parentElement.parentElement.parentElement;
        editButton.getElement().classList.remove("hide-edit-todo-button");
        editButton.clear();
        var todoElement = e.target.previousElementSibling;
		var getUpdatedTodo = todoElement.value.trim();
		var todoID = getTodo.dataset.todoid;
		request("PUT", `/todo/${todoID}`, {todo: getUpdatedTodo, todoID: todoID});
	    todoElement.parentElement.parentElement.innerHTML = `${getUpdatedTodo}`;
    }
})

function request (type, path, data) {
    return window.fetch(path, {
        method: type,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}