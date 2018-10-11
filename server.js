const express    = require("express");
const bodyParser = require("body-parser");
const store      = require("./store.js");
const session    = require("express-session");
const app        = express();

// ROUTES
const indexRoutes = require("./routes/index"),
    todoRoutes    = require("./routes/todo");
    
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
//   console.log(res.locals.message);
  next();
})

app.use(indexRoutes);
app.use(todoRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server running on port: " + process.env.PORT + " and IP: " + process.env.IP);
})


