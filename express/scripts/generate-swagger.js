/**
 * Generate swagger.json from swagger-jsdoc spec
 * Usage: node scripts/generate-swagger.js
 */

const fs = require('fs');
const path = require('path');
const swaggerSpec = require('../src/config/swagger');

const outPath = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(outPath)) fs.mkdirSync(outPath, { recursive: true });

fs.writeFileSync(path.join(outPath, 'swagger.json'), JSON.stringify(swaggerSpec, null, 2));
console.log('Generated docs/swagger.json');
