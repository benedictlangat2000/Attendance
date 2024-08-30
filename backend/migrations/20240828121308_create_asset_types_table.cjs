exports.up = async (knex) => {
    return knex.schema.createTable('asset_types', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.timestamps(true, true);
    });
  }
  
  exports.down = async (knex) => {
    return knex.schema.dropTable('asset_types');
  }
  