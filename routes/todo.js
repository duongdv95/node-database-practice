const express = require("express"),
    router    = express.Router(),
    store     = require("../store.js");


// Get all todos
router.get("/todo", isLoggedIn, async (req, res) => {
    const [userData] = await store.getUserID(req.session.user);
    const userID = userData.id;
    const todos = await store.getTodo({userID});
    const todosArray = todos.map(obj => {
        var todo = {id: obj.id, todos: obj.todos}
        return todo
    })
    res.render("todo", {todosArray});
})

// Create todo
router.post("/todo", async (req, res) => {
    const [userData] = await store.getUserID(req.session.user);
    const userID = userData.id;
    const [id] = await store.createTodo({todo: req.body.todo, userID})
    if(id) {
        res.status(200)
        res.send({ID: id, userID})
    }
})

// Update todo
router.put("/todo/:id", async (req, res) => {
    await store.updateTodo({
        todo: req.body.todo,
        todoID: req.body.todoID
    });
    res.sendStatus(200);
})

// Delete todo
router.delete("/todo/:id", async (req, res) => {
    await store.deleteTodo({
        todoID: req.body.todoID
    });
    res.sendStatus(200);
})

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

module.exports = router;