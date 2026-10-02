exports.up = async function (knex) {
  await knex.schema.createTable('options', (table) => {
    table.increments('id').primary();
    table.string('option', 500).notNullable();
  });

  await knex.schema.createTable('questions', (table) => {
    table.increments('id').primary();
    table.text('question').notNullable();
    table.string('difficulty', 20).notNullable();
    table.integer('correct_option_id').unsigned().notNullable()
      .references('id').inTable('options').onDelete('RESTRICT');
    table.text('explanation').notNullable();
  });

  await knex.schema.createTable('questions_options', (table) => {
    table.integer('question_id').unsigned().notNullable()
      .references('id').inTable('questions').onDelete('CASCADE');
    table.integer('option_id').unsigned().notNullable()
      .references('id').inTable('options').onDelete('CASCADE');
    table.primary(['question_id', 'option_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('questions_options');
  await knex.schema.dropTableIfExists('questions');
  await knex.schema.dropTableIfExists('options');
};