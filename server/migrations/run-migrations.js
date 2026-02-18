const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function runMigrations() {
  try {
    console.log('🚀 Starting ClipForge database setup...\n');

    // Read complete schema file
    const schemaPath = path.join(__dirname, 'complete_schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    console.log('📄 Running complete_schema.sql...');
    
    // Execute complete schema
    await pool.query(schemaSQL);

    console.log('\n✅ Database schema created successfully!\n');

    // Verify tables
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('📋 Created tables:');
    result.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

    // Count indexes
    const indexResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM pg_indexes
      WHERE schemaname = 'public';
    `);

    console.log(`\n📊 Total indexes: ${indexResult.rows[0].count}`);

    // Check admin user
    const adminResult = await pool.query(`
      SELECT email, role FROM users WHERE role = 'admin' LIMIT 1;
    `);

    if (adminResult.rows.length > 0) {
      console.log('\n👤 Default admin account:');
      console.log(`  Email: ${adminResult.rows[0].email}`);
      console.log('  Password: admin123');
      console.log('  ⚠️  Change this password in production!\n');
    }

    console.log('✅ Database is ready to use!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
