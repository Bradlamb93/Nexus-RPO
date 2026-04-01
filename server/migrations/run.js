const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function migrate() {
  console.log('Running migrations...');

  const migrationsDir = __dirname;
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`  Running ${file}...`);
    await db.query(sql);
    console.log(`  ✓ ${file} complete`);
  }

  console.log('All migrations complete.');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
