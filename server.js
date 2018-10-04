const express    = require("express");
const bodyParser = require("body-parser");
const store      = require("./store.js");
const session    = require("express-session");
const app        = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(session({
    secret: "merp",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: null}
}));

app.use(function(req, res, next) {
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
})

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/test', function(req, res, next) {
    req.session.reload(function(err){
        console.log(err)
    })
  if (req.session.isLoggedIn) {
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>isLoggedIn: ' + req.session.isLoggedIn + '</p>')
    res.end()
  } else {
    res.end('Not logged in')
  }
})

app.get("/todo", async (req, res) => {
    const todos = await store.getTodo();
    const todosArray = todos.map(obj => {
        var todo = {id: obj.id, todos: obj.todos}
        return todo
    })
    res.render("todo", {todosArray});
})

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
})

// POST ROUTE
app.post("/todo", (req, res) => {
    store.createTodo({
        todo: req.body.todo
    })
    .then(([id]) => {
        res.status(200)
        res.send({ID: id})
        })
})

// PUT ROUTE
app.put("/todo/:id", (req, res) => {
    store.updateTodo({
        todo: req.body.todo,
        todoID: req.body.todoID
    })
    .then(() => {
        res.sendStatus(200)
    })
})

// DELETE ROUTE
app.delete("/todo/:id", (req, res) => {
    store.deleteTodo({
        todoID: req.body.todoID
    })
    .then(() => {
        res.sendStatus(200)
    })
})

app.post("/createUser", (req, res) => {
    store.createUser({
        username: req.body.username,
        password: req.body.password
    })
    .then(() => {

        res.sendStatus(200)
    })
})

app.post("/login", async (req, res) => {
    store.authenticateUser({
        username: req.body.username,
        password: req.body.password
    })
    .then(({success}) => {
        (success) ? res.sendStatus(200) : res.sendStatus(401)
          if (success) {
              req.session.isLoggedIn = true;
              console.log(`isLoggedIn = ${req.session.isLoggedIn}`);
          } else {
              req.session.isLoggedIn = false;
              console.log(`isLoggedIn = ${req.session.isLoggedIn}`);
          }
        })
})

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server running on port: " + process.env.PORT + " and IP: " + process.env.IP);
})


