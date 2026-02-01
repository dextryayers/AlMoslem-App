const fs = require('fs');
const path = require('path');

const sourcePublic = path.join(__dirname, 'public');
const destPublic = path.join(__dirname, '.next', 'standalone', 'public');

const sourceStatic = path.join(__dirname, '.next', 'static');
const destStatic = path.join(__dirname, '.next', 'standalone', '.next', 'static');

function copyDir(src, dest) {
    if (!fs.existsSync(src)) return; // Skip if source doesn't exist
    
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('Preparing cPanel deployment...');

console.log('Copying public folder...');
copyDir(sourcePublic, destPublic);

console.log('Copying .next/static folder...');
copyDir(sourceStatic, destStatic);

// Copy .htaccess
const sourceHtaccess = path.join(__dirname, '.htaccess');
const destHtaccess = path.join(__dirname, '.next', 'standalone', '.htaccess');
if (fs.existsSync(sourceHtaccess)) {
    console.log('Copying .htaccess...');
    fs.copyFileSync(sourceHtaccess, destHtaccess);
}

console.log('✅ Success! Folder .next/standalone siap di-upload ke cPanel.');
