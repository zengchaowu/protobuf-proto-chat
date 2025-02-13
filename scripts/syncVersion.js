const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const pubspecPath = path.join(__dirname, '../pubspec.yaml');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const newVersion = packageJson.version;

// Read pubspec.yaml
let pubspec = fs.readFileSync(pubspecPath, 'utf8');

// Update version in pubspec.yaml
pubspec = pubspec.replace(/version: .*/g, `version: ${newVersion}`);

// Write updated pubspec.yaml
fs.writeFileSync(pubspecPath, pubspec, 'utf8');
console.log(`Updated pubspec.yaml version to ${newVersion}`);
