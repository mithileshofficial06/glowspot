#!/usr/bin/env node

/**
 * Clean Build Script
 * Removes Next.js cache and build artifacts to fix styling and compilation issues
 */

const fs = require('fs');
const path = require('path');

const foldersToDelete = [
  '.next',
  'node_modules/.cache'
];

console.log('🧹 Cleaning build cache...\n');

foldersToDelete.forEach(folder => {
  const folderPath = path.join(__dirname, folder);
  if (fs.existsSync(folderPath)) {
    console.log(`Deleting ${folder}...`);
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`✓ ${folder} deleted`);
  } else {
    console.log(`⊘ ${folder} not found (already clean)`);
  }
});

console.log('\n✨ Build cache cleaned successfully!');
console.log('Run "npm run dev" to start fresh.\n');
