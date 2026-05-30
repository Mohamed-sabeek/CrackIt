import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    const adminEmail = 'safeeofficial1730@gmail.com';
    const adminPassword = 'SafeeCrackIt@1730';

    // Check if admin user already exists
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      console.log('Seeding Fixed Admin user account...');
      await User.create({
        name: 'Safee Admin',
        email: adminEmail,
        password: adminPassword, // Will be hashed automatically by pre-save hook
        role: 'admin'
      });
      console.log('Fixed Admin user seeded successfully.');
    } else {
      console.log('Fixed Admin user already exists. Skipping seeding.');
    }
  } catch (error) {
    console.error(`Admin Seeding failed: ${error.message}`);
  }
};

export default seedAdmin;
