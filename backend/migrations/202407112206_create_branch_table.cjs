exports.up = async (knex) => {
  await knex.schema.createTableIfNotExists('branch', (table) => {
    table.increments('id').primary();
    table.string('branch').notNullable();
    table.decimal('latitude', 10, 8).notNullable();
    table.decimal('longitude', 11, 8).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('branch');
};