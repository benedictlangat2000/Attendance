
exports.seed = async (knex) => {
  await knex('category').insert([
    {
      name: 'HR',
    },
    {
      name: 'ICT',
    },
    {
      name: 'FINANCE',
    },
    {
      name: 'Membership',
    },
    {
      name: 'Marketing',
    },
  ]);
};
