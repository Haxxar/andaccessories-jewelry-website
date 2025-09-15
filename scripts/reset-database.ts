#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'products.db');

console.log('🗑️ Resetting database...');

try {
  // Remove existing database file
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✅ Database file removed');
  } else {
    console.log('ℹ️ No existing database file found');
  }

  // Remove data directory if empty
  const dataDir = path.join(process.cwd(), 'data');
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir);
    if (files.length === 0) {
      fs.rmdirSync(dataDir);
      console.log('✅ Data directory removed');
    } else {
      console.log('ℹ️ Data directory contains other files, keeping it');
    }
  }

  console.log('🎉 Database reset complete!');
  console.log('Run "npm run init-db" to create a fresh database.');
  
} catch (error) {
  console.error('❌ Error resetting database:', error);
  process.exit(1);
}

