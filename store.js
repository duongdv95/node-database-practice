const crypto = require("crypto");
const knexfile = require("./knexfile.js");
const knex = require("knex")(knexfile);

function getTodo () {
    return knex("todos")
    .select("id", "todos")
    // .then((todos) => {
    //     console.log(JSON.stringify(todos))
    // })
}

function createTodo ({todo}) {
    return knex("todos").insert({
        todos: todo
    }).returning("id")
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
    if(!user) return {success: false}
    const {hash} = saltHashPassword({
        password, 
        salt: user.salt
        })
    return {success: hash === user.encrypted_password}
        
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

module.exports = {createUser, saltHashPassword, authenticateUser, createTodo, deleteTodo, updateTodo, getTodo}






