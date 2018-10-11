const express = require("express"),
    router  = express.Router(),
    store     = require("../store.js");
    
router.get("/", (req, res) => {
    res.render("index");
})

router.get("/register", (req, res) => {
    res.render("register");
})

router.get("/login", (req, res) => {
    res.render("login");
});

router.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

router.post("/createUser", async (req, res) => {
    if (req.body.username.length == 0 || req.body.password.length == 0) {
        console.log("Missing Username/Password")
        return
    }
    const {userFound} = await store.checkDuplicateUsername({username: req.body.username});
    if(!userFound){
        await store.createUser({
            username: req.body.username,
            password: req.body.password
        })
        res.sendStatus(200)   
    } else {
        console.log("username taken");
        return
    }

})

router.post("/login", async (req, res) => {
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
            res.setHeader("redirected", "/todo");
            res.sendStatus(200);
        })
    } else {
        req.session.error = "Authentication failed";
        res.setHeader("redirected", "/login");
        res.sendStatus(401);
    }
    
})

module.exports = router;