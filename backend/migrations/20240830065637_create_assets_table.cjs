exports.up = async (knex) => {
    // Check if the asset_type, category, and branch tables exist
    if (!(await knex.schema.hasTable('asset_types'))) {
      throw new Error('asset_types table is missing.');
    }
    if (!(await knex.schema.hasTable('category'))) {
      throw new Error('category table is missing.');
    }
    if (!(await knex.schema.hasTable('branch'))) {
      throw new Error('branch table is missing.');
    }
  
    await knex.schema.createTable('assets', (table) => {
      table.increments('id').primary();
      table.integer('asset_types').unsigned().notNullable().references('id').inTable('asset_types').onDelete('CASCADE');
      table.string('asset_name').notNullable();
      table.string('asset_tag').notNullable();
      table.string('serial_no').notNullable();
      table.integer('category_id').unsigned().notNullable().references('id').inTable('category').onDelete('CASCADE');
      table.integer('branch_id').unsigned().notNullable().references('id').inTable('branch').onDelete('CASCADE');
      table.timestamps(true, true);
    });
  };
  
  exports.down = async (knex) => {
    if (await knex.schema.hasTable('assets')) {
      await knex.schema.dropTable('assets');
    }
  };
  