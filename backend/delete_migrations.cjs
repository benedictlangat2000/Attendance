// delete_migrations.js

// Import the Knex configuration
const knexConfig = require('./knexfile.cjs');

// Initialize Knex using the development environment configuration
const knex = require('knex')(knexConfig);

// Get the migration name from command-line arguments
const migrationToDelete = process.argv[2];

if (!migrationToDelete) {
  console.error('Please provide the migration name to delete.');
  process.exit(1);
}

async function deleteMigration() {
  try {
    // Delete the migration record from the knex_migrations table
    const deleted = await knex('knex_migrations')
      .where('name', migrationToDelete)
      .del();

    if (deleted) {
      console.log(`Migration '${migrationToDelete}' deleted successfully.`);
    } else {
      console.log(`Migration '${migrationToDelete}' not found.`);
    }
  } catch (error) {
    console.error('Error deleting migration record:', error);
  } finally {
    // Destroy the Knex instance to close the database connection
    await knex.destroy();
  }
}

// Run the delete function
deleteMigration();
