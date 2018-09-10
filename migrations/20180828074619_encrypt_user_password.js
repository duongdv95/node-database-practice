const { saltHashPassword } = require("../store.js");

exports.up = async function(knex, Promise) {
    await knex.schema.table("user", table => {
            table.string("encrypted_password").notNullable()
            table.string("salt").notNullable()
        })
    const users = await knex("user")
    await Promise.all(users.map(convertPassword))
    await knex.schema.table("user", table => table.dropColumn("password"))

    function convertPassword(user) {
        const { salt, hash } = saltHashPassword(user.password)
        return knex("user")
            .where({ id: user.id })
            .update({
                salt,
                encrypted_password: hash
            })
    }
};



exports.down = function(knex, Promise) {
    return knex.schema.table('user', t => {
        t.dropColumn('salt')
        t.dropColumn('encrypted_password')
        t.string('password').notNullable()
    })
};
