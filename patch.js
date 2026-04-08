const db = require('./backend/db');
const bcrypt = require('bcrypt');

async function run() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    await db.query(`
      INSERT INTO users (name, email, password_hash, role) 
      VALUES ('Super Admin', 'admin@campuskonnect.app', $1, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `, [hash]);
    console.log("DB Prep Done.");
  } catch (err) {
    console.error("DB failed (ok if no Postgres config running locally): ", err);
  } finally {
    process.exit();
  }
}
run();
