exports.seed = async (knex) => {
    await knex('asset_types').insert([
      { name: 'Laptop' },
      { name: 'iPad' },
      { name: 'Cisco Phones' },
    ]);
  };
  