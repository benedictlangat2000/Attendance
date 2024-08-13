exports.up = async (knex) => {
  // Check if the table exists
  if (!(await knex.schema.hasTable('employee'))) {
      await knex.schema.createTable('employee', (table) => {
          table.increments('id').primary();
          table.string('name').notNullable();
          table.string('email').notNullable();
          table.string('password').notNullable();
          table.integer('branch_id').unsigned().notNullable(); // Ensure the data type matches with `branch` table
          table.string('location').notNullable(); // Added the location field
          table.integer('category_id').unsigned().notNullable(); // Ensure the data type matches with `category` table
          table.foreign('branch_id').references('id').inTable('branch').onDelete('CASCADE');
          table.foreign('category_id').references('id').inTable('category').onDelete('CASCADE');
          table.timestamps(true, true); // Adds created_at and updated_at columns
      });
  }
};

exports.down = async (knex) => {
  // Drop the table if it exists
  if (await knex.schema.hasTable('employee')) {
      await knex.schema.dropTable('employee');
  }
};
