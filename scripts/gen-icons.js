/**
 * Generate PNG icons from SVG for PWA
 * Uses sharp library
 * 
 * Instalar: npm install -g sharp-cli
 * Ejecutar: node scripts/gen-icons.js
 */

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const svgPath = path.join(__dirname, '..', 'icons', 'icon.svg');
const outDir = path.join(__dirname, '..', 'icons');

// Read SVG source
const svg = fs.readFileSync(svgPath, 'utf8');

// Generate PNGs using sharp if available
try {
  const sharp = require('sharp');
  console.log('Generating PNG icons from SVG...');
  
  sizes.forEach((size) => {
    const outPath = path.join(outDir, `icon-${size}x${size}.png`);
    sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(outPath, (err, info) => {
        if (err) {
          console.error(`Error generating icon-${size}x${size}.png:`, err.message);
        } else {
          console.log(`✅ icon-${size}x${size}.png (${info.size} bytes)`);
        }
      });
  });
} catch (e) {
  console.log('⚠️  Sharp no disponible. Instalar con: npm install -g sharp-cli');
  console.log('   O usar: npx sharp-cli');
  console.log('   Tamaños requeridos:', sizes.join(', '));
}

// Also generate favicon.ico from 32x32
try {
  const sharp = require('sharp');
  const faviconPath = path.join(__dirname, '..', 'favicon.ico');
  sharp(Buffer.from(svg))
    .resize(32, 32)
    .toFile(faviconPath, (err) => {
      if (err) console.error('Error generating favicon.ico:', err.message);
      else console.log('✅ favicon.ico');
    });
} catch (e) {
  console.log('⚠️  favicon.ico no disponible (sharp no instalado)');
}

console.log('\n✅ Generación de iconos completada.');