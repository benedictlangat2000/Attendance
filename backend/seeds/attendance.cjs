exports.seed = async (knex) => {
    try {
      // Check if the table is empty before seeding to avoid duplicate entries
      const existingRows = await knex('attendance').select('*');
      if (existingRows.length === 0) {
        const generateRandomDate = (start, end) => {
          return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        };
  
        const getRandomIp = () => {
          return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
        };
  
        const startDate = new Date('2023-01-01T00:00:00');
        const endDate = new Date('2023-12-31T23:59:59');
  
        const attendanceData = [];
        for (let i = 0; i < 50; i++) {
          const checkinDate = generateRandomDate(startDate, endDate);
          const checkoutDate = Math.random() > 0.5 ? generateRandomDate(checkinDate, endDate) : null;
          const ipAddress = getRandomIp();
          const employeeId = Math.floor(Math.random() * 10) + 1; // Assuming you have 10 employees
          const branchId = Math.floor(Math.random() * 5) + 1; // Assuming you have 5 branches
  
          attendanceData.push({
            employee_id: employeeId,
            branch_id: branchId,
            checkin_date: checkinDate.toISOString().slice(0, 19).replace('T', ' '),
            checkout_date: checkoutDate ? checkoutDate.toISOString().slice(0, 19).replace('T', ' ') : null,
            ip_address: ipAddress
          });
        }
  
        await knex('attendance').insert(attendanceData);
        console.log('Seed data inserted into attendance table');
      } else {
        console.log('Attendance table already contains data');
      }
    } catch (error) {
      console.error('Error inserting seed data:', error);
    }
  };
  