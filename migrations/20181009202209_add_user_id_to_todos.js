
exports.up = async function(knex, Promise) {
    await knex.schema.table("todos", table => {
            table.integer("user_id").notNullable().defaultTo(0);
        })
};



exports.down = function(knex, Promise) {
    return knex.schema.table('todos', t => {
        t.dropColumn('user_id')
    })
};
