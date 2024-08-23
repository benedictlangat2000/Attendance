exports.up = async (knex) => {
  await knex.schema.createTable('attendance', (table) => {
    table.increments('id').primary(); // Primary key for the attendance table
    table.integer('employee_id').unsigned().notNullable().references('id').inTable('employee').onDelete('CASCADE'); // Foreign key referencing 'employee' table
    table.integer('branch_id').unsigned().notNullable().references('id').inTable('branch').onDelete('CASCADE');  // Foreign key referencing 'branch' table
    table.datetime('checkin_date').nullable(); // Check-in date and time (nullable)
    table.datetime('checkout_date').nullable(); // Check-out date and time (nullable)
    table.string('checkin_ip').nullable(); // IP address of the user at check-in (nullable)
    table.string('checkout_ip').nullable(); // IP address of the user at check-out (nullable)
    table.timestamps(true, true); // Timestamps for created_at and updated_at
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('attendance'); // Drop table if it exists
};
