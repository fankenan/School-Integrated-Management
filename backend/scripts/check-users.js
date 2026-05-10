const { Client } = require('pg');

async function main() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '870707',
    database: 'school_management',
  });

  try {
    await client.connect();

    // Check users table
    const users = await client.query('SELECT id, username, password, status FROM users');
    console.log('Users in database:');
    console.log(JSON.stringify(users.rows, null, 2));

    // Check if we can login directly
    const user = users.rows[0];
    if (user) {
      console.log('\nTesting password with bcrypt...');
      const bcrypt = require('bcrypt');
      const isValid = await bcrypt.compare('admin123', user.password);
      console.log(`Password valid: ${isValid}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

main();