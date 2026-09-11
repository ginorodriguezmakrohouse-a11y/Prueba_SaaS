const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..');
const distDir = path.resolve(srcDir, 'dist');

// Files and directories to copy
const itemsToCopy = [
  'index.html',
  'css',
  'js',
  'manifest.json',
  'sw.js',
  'icons',
  'supabase',
  'README.md',
  'REPORTE.md',
  'ANALYTICS.md',
  'OAUTH_2FA.md',
  'CAPACITOR.md',
  '.nojekyll',
  '.gitignore'
];

function copyItem(item) {
  const srcPath = path.join(srcDir, item);
  const destPath = path.join(distDir, item);
  
  if (fs.existsSync(srcPath)) {
    if (fs.lstatSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      fs.readdirSync(srcPath).forEach(file => {
        copyItem(path.join(item, file));
      });
    } else {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${item}`);
    }
  }
}

// Clean and create dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

console.log('Building web assets for Capacitor...');
itemsToCopy.forEach(copyItem);

console.log('Build complete! Assets copied to dist/');