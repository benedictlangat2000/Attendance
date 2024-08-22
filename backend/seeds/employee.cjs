const bcrypt = require('bcrypt');

exports.seed = async (knex) => {
  const employees = [];
  
  const fakeAddresses = [
    "123 Main St, Nairobi, Kenya",
    "456 Mombasa Rd, Mombasa, Kenya",
    "789 Nakuru Ave, Nakuru, Kenya",
    "101 Kisumu Blvd, Kisumu, Kenya",
    "202 Eldoret Way, Eldoret, Kenya",
    "303 Thika Rd, Thika, Kenya",
    "404 Machakos St, Machakos, Kenya",
    // Add more addresses if needed to avoid repetition
  ];

  for (let i = 1; i <= 1000; i++) {
    employees.push({
      name: `Employee ${i}`,
      email: `employee${i}@example.com`,
      password: bcrypt.hashSync('password123', 10),
      branch_id: (i % 7) + 1, // Rotate branch IDs between 1 and 7
      location: fakeAddresses[(i % fakeAddresses.length)], // Assign a fake address
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
