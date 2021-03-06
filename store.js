const crypto = require("crypto");
const knexfile = require("./knexfile.js");
const knex = require("knex")(knexfile);

function getTodo ({userID}) {
    return knex("todos")
    .where({user_id: userID})
    .select("id", "todos")
}

function createTodo ({todo, userID}) {
    return knex("todos")
    .insert({
        todos: todo,
        user_id: userID
    })
    .returning("id")
}

function updateTodo ({todo, todoID}) {
    return knex("todos")
    .where({
        id: todoID
    })
    .update({todos: todo, updated_at: knex.fn.now()})
}

// Could add a verification step to check if the todo description matches the ID
function deleteTodo ({todoID}) {
    return knex("todos")
    .del()
    .where({
        id: todoID
    })
}

function getUserID (user) {
    return knex("user")
    .select("id")
    .where({
        username:user
    })
}

async function checkDuplicateUsername ({username}) {
    const [userData] = await knex("user").select("username").where({username});
    return userData ? {userFound: userData.username} : {userFound: null};
}

function createUser ({username, password}) {
    console.log(`Add user ${username} with password ${password}`)
    const {salt, hash} = saltHashPassword({password});
    return knex("user").insert({
        username: username,
        encrypted_password: hash,
        salt: salt
    })
}

async function authenticateUser({ username, password }) {
    console.log(`Authenticating user ${username}`);
    const [user] = await knex("user").where({username});
    if(!user) return {success: false, user: null}
    const {hash} = saltHashPassword({
        password, 
        salt: user.salt
        })
    return {success: hash === user.encrypted_password, user: username}
        
}

function saltHashPassword ({
    password,
    salt = randomString()
}) {

    const hash = crypto
        .createHmac("sha512", salt)
        .update(password)
        
    return {
        salt: salt,
        hash: hash.digest("hex")
    }
}

function randomString () {
    return crypto.randomBytes(4).toString("hex");
}

module.exports = {createUser, saltHashPassword, authenticateUser, createTodo, deleteTodo, updateTodo, getTodo, getUserID, checkDuplicateUsername}





