const express    = require("express");
const bodyParser = require("body-parser");
const store      = require("./store.js");

const app        = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/todo", (req, res) => {
    res.render("todo");
})

app.post("/todo", (req, res) => {
    store.createTodo({
        todo: req.body.todo
    })
    .then(() => {
        
        res.sendStatus(200)
        })
})

app.delete("/todo/:id", (req, res) => {
    
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

app.post("/login", (req, res) => {
    store.authenticateUser({
        username: req.body.username,
        password: req.body.password
    })
    .then(({success}) => {
        (success) ? res.sendStatus(200) : res.sendStatus(401)
        })
})

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server running on port: " + process.env.PORT + " and IP: " + process.env.IP);
})