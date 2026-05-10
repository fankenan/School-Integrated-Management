const { Client } = require('pg');

async function main() {
  // Connect to default postgres database first
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '870707',
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if database exists
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'school_management'"
    );

    if (res.rows.length === 0) {
      await client.query('CREATE DATABASE school_management');
      console.log('Database "school_management" created successfully!');
    } else {
      console.log('Database "school_management" already exists.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

main();