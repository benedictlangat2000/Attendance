const bcrypt = require('bcrypt');

exports.seed = async (knex) => {
  const employees = [];
  
  for (let i = 1; i <= 50; i++) {
    employees.push({
      name: `Employee ${i}`,
      email: `employee${i}@example.com`,
      password: bcrypt.hashSync('password123', 10),
      branch_id: (i % 7) + 1, // Assuming you have 7 branches, rotate branch IDs between 1 and 7
      location: `${i} Employee St`,
      category_id: (i % 3) + 1, // Rotate category IDs between 1, 2, 3
    });
  }

  try {
    await knex('employee').insert(employees);
    console.log('Seed data inserted into employee table');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }
};
