const User = require('../models/User');
require('dotenv').config();

async function verifyAdmin() {
  try {
    const adminEmail = 'dipendrak299@gmail.com';
    const admin = await User.findByEmail(adminEmail);

    if (admin) {
      console.log('✓ Admin user found in database:');
      console.log('   ID:', admin.id);
      console.log('   Name:', admin.name);
      console.log('   Email:', admin.email);
      console.log('   Role:', admin.role);
      console.log('   Email Verified:', admin.email_verified);
      console.log('   Created At:', admin.created_at);
      console.log('\n✅ Admin account is ready to use!');
    } else {
      console.log('❌ Admin user not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyAdmin();
