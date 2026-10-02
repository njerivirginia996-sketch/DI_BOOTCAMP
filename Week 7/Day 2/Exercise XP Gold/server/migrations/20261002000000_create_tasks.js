exports.up = async function (knex) {
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('title', 200).notNullable();
    table.boolean('completed').notNullable().defaultTo(false);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('tasks');
};