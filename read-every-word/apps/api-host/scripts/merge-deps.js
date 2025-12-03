const fs = require('fs');
const path = require('path');

const rootPackageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../../package.json'), 'utf8')
);
const distPackageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../dist/package.json'), 'utf8')
);

// Merge dependencies from root
distPackageJson.dependencies = rootPackageJson.dependencies || {};
distPackageJson.main = 'main.js'; // Update main entry point

// Remove nx config (not needed for deployment)
delete distPackageJson.nx;

fs.writeFileSync(
  path.join(__dirname, '../dist/package.json'),
  JSON.stringify(distPackageJson, null, 2) + '\n'
);
