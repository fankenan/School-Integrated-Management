const { Client } = require('pg');
const bcrypt = require('bcrypt');

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

    // Generate fresh hash
    const freshHash = await bcrypt.hash('admin123', 10);
    console.log('Fresh hash:', freshHash);

    // Update user password
    await client.query(
      'UPDATE users SET password = $1 WHERE username = $2',
      [freshHash, 'admin']
    );
    console.log('Password updated successfully!');

    // Verify
    const result = await client.query('SELECT password FROM users WHERE username = $1', ['admin']);
    const isValid = await bcrypt.compare('admin123', result.rows[0].password);
    console.log('Verification - password valid:', isValid);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

main();