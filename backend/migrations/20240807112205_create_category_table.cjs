exports.up = async (knex) => {
    await knex.schema.createTableIfNotExists('category', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = async (knex) => {
    await knex.schema.dropTableIfExists('category');
  };