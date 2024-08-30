exports.up = async (knex) => {
  // Check if the asset_type, category, and branch tables exist
  if (!(await knex.schema.hasTable('assets'))) {
    await knex.schema.createTable('assets', (table) => {
      table.increments('id').primary();
      table.integer('asset_type').unsigned().notNullable(); // Ensure the data type matches with `asset_type` table
      table.string('asset_name').notNullable();
      table.string('asset_tag').notNullable();
      table.string('serial_no').notNullable();
      table.integer('category_id').unsigned().notNullable(); // Ensure the data type matches with `category` table
      table.integer('branch_id').unsigned().notNullable(); // Ensure the data type matches with `branch` table
      table.integer('year_of_purchase').notNullable(); // New field for Year of Purchase
      table.string('condition').notNullable(); // New field for Condition

      // Define foreign keys
      table.foreign('asset_type').references('id').inTable('asset_type').onDelete('CASCADE');
      table.foreign('category_id').references('id').inTable('category').onDelete('CASCADE');
      table.foreign('branch_id').references('id').inTable('branch').onDelete('CASCADE');
      
      table.timestamps(true, true); // Adds created_at and updated_at columns
    });
  }
};

exports.down = async (knex) => {
  // Drop the table if it exists
  if (await knex.schema.hasTable('assets')) {
    await knex.schema.dropTable('assets');
  }
};
