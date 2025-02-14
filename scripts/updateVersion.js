const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const pubspecPath = path.join(__dirname, '..', 'pubspec.yaml');

function updateVersion(filePath, versionType) {
    const data = fs.readFileSync(filePath, 'utf8');
    let version;

    if (filePath.endsWith('json')) {
        const jsonData = JSON.parse(data);
        version = jsonData.version;
        jsonData.version = incrementVersion(version, versionType);
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    } else if (filePath.endsWith('yaml')) {
        version = data.match(/version: ([0-9]+\.[0-9]+\.[0-9]+)/)[1];
        const newVersion = incrementVersion(version, versionType);
        const newData = data.replace(/version: [0-9]+\.[0-9]+\.[0-9]+/, `version: ${newVersion}`);
        fs.writeFileSync(filePath, newData);
    }
}

function incrementVersion(version, type) {
    const parts = version.split('.').map(Number);
    switch (type) {
        case 'major':
            parts[0] += 1;
            parts[1] = 0;
            parts[2] = 0;
            break;
        case 'minor':
            parts[1] += 1;
            parts[2] = 0;
            break;
        case 'patch':
            parts[2] += 1;
            break;
        default:
            throw new Error('Invalid version type');
    }
    return parts.join('.');
}

const args = process.argv.slice(2);
if (args.length < 1) {
    console.error('Usage: node updateVersion.js <incrementType>');
    process.exit(1);
}

const incrementType = args[0];
updateVersion(packageJsonPath, incrementType);
updateVersion(pubspecPath, incrementType);
console.log(`Updated versions in package.json and pubspec.yaml to ${incrementType}.`);
