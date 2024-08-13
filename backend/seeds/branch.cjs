exports.seed = async (knex) => {
  try {
    // Check if the table is empty before seeding to avoid duplicate entries
    const existingRows = await knex('branch').select('*');
    if (existingRows.length === 0) {
      await knex('branch').insert([
        { branch: 'Embakasi', latitude: -1.28333, longitude: 36.86667 },
        { branch: 'Hurlingham', latitude: -1.28333, longitude: 36.78333 },
        { branch: 'Sarit', latitude: -1.26667, longitude: 36.78333 },
        { branch: 'Kasarani', latitude: -1.23333, longitude: 36.86667 },
        { branch: 'Kisumu', latitude: -0.1, longitude: 34.75 },
        { branch: 'Nakuru', latitude: -0.28333, longitude: 36.06667 },
        { branch: 'Mombasa', latitude: -4.05, longitude: 39.66667 },
      ]);
      console.log('Seed data inserted into branch table');
    } else {
      console.log('Branch table already contains data');
    }
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }
};