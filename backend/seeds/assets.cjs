exports.seed = async (knex) => {
  try {
    // Check if the table is empty before seeding to avoid duplicate entries
    const existingRows = await knex('assets').select('*');
    if (existingRows.length === 0) {
      const generateRandomSerial = () => Math.random().toString(36).substr(2, 9).toUpperCase();
    
      // Fetch IDs from related tables
      const assetTypes = await knex('asset_types').pluck('id'); // Get all asset type IDs
      const categories = await knex('category').pluck('id'); // Get all category IDs
      const branches = await knex('branch').pluck('id'); // Get all branch IDs
    
      const assetData = [];
      for (let i = 0; i < 1000; i++) { // Generate 1,000 rows
        const assetTypeId = assetTypes[Math.floor(Math.random() * assetTypes.length)];
        const categoryId = categories[Math.floor(Math.random() * categories.length)];
        const branchId = branches[Math.floor(Math.random() * branches.length)];
        const assetName = `Asset ${i + 1}`;
        const assetTag = `TAG${i + 1}`;
        const serialNo = generateRandomSerial();
    
        assetData.push({
          asset_types: assetTypeId, // Ensure this matches the migration column name
          asset_name: assetName,
          asset_tag: assetTag,
          serial_no: serialNo,
          category_id: categoryId,
          branch_id: branchId
        });
    
        // Optional: Batch insertion for performance
        if (assetData.length === 100) { // Insert in batches of 100
          await knex('assets').insert(assetData);
          assetData.length = 0; // Clear the array
        }
      }
    
      // Insert any remaining data after the loop
      if (assetData.length > 0) {
        await knex('assets').insert(assetData);
      }
    
      console.log('Seed data inserted into assets table');
    } else {
      console.log('Assets table already contains data');
    }
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }
};
