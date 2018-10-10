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
  if (err) res.locals.message = err;
  if (msg) res.locals.message = msg;
  next();
})

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get("/todo", isLoggedIn, async (req, res) => {
    const [userData] = await store.getUserID(req.session.user);
    const userID = userData.id;
    const todos = await store.getTodo({userID});
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
});

app.get("/register", (req, res) => {
    res.render("register");
})

app.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret");
    
})
// POST ROUTE
app.post("/todo", async (req, res) => {
    const [userData] = await store.getUserID(req.session.user);
    const userID = userData.id;
    const [id] = await store.createTodo({todo: req.body.todo, userID})
    if(id) {
        res.status(200)
        res.send({ID: id, userID})
    }
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

app.post("/createUser", isLoggedIn, (req, res) => {
    store.createUser({
        username: req.body.username,
        password: req.body.password
    })
    .then(() => {
        res.sendStatus(200)
    })
})

app.post("/login", async (req, res) => {
    const authenticationData = await store.authenticateUser({
        username: req.body.username,
        password: req.body.password
    })
    
    const success = authenticationData.success;
    const user = authenticationData.user;
    if (success) {
        req.session.regenerate(function() {
            req.session.user = user;
            req.session.success = "You are logged in! You can view secret page now."
            console.log(req.session.success);
            res.setHeader("redirected", "/todo");
            res.sendStatus(200);
        })
    } else {
        req.session.error = "Authentication failed";
        console.log(req.session.error);
        res.setHeader("redirected", "/login");
        res.sendStatus(401);
    }
    
})

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server running on port: " + process.env.PORT + " and IP: " + process.env.IP);
})


