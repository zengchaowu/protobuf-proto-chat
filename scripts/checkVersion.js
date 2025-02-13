const fs = require('fs');
const { execSync } = require('child_process');

function getVersionFromPubspec() {
    const pubspecContent = fs.readFileSync('pubspec.yaml', 'utf8');
    const versionMatch = pubspecContent.match(/version:\s*(\S+)/);
    return versionMatch ? versionMatch[1] : null;
}

function getVersionFromPackageJson() {
    const packageJsonContent = fs.readFileSync('package.json', 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    return packageJson.version;
}

try {
    // 检查 pubspec.yaml 和 package.json 是否被修改
    const modifiedFiles = execSync('git diff --cached --name-only').toString();
    const pubspecVersion = getVersionFromPubspec();
    const packageJsonVersion = getVersionFromPackageJson();
    console.log(pubspecVersion, packageJsonVersion);

    if (modifiedFiles.includes('pubspec.yaml') && modifiedFiles.includes('package.json')) {
        console.log('Both pubspec.yaml and package.json versions have been modified.');
    } else {
        console.error('Error: You must modify the version number in both pubspec.yaml and package.json before committing.');
        process.exit(1);
    }

    // 进一步检查版本号是否一致
    if (pubspecVersion !== packageJsonVersion) {
        console.error(`Error: Version mismatch! pubspec.yaml version: ${pubspecVersion}, package.json version: ${packageJsonVersion}`);
        process.exit(1);
    } else {
        console.log('Version numbers are consistent.');
    }
} catch (error) {
    console.error('Error checking versions:', error.message);
    process.exit(1);
}
