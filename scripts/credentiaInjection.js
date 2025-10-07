require('dotenv').config();
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const rootDir = path.join(__dirname, '..');
const zipPath = path.join(rootDir, 'credenciales.zip');
const driveUrl = process.env.AUTH_ZIP_URL;

(async () => {
  try {
    console.log('⬇️ Descargando credenciales...');
    const res = await fetch(driveUrl);  
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(zipPath, buffer);

    console.log('📦 Descomprimiendo...');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(rootDir, true);

    fs.unlinkSync(zipPath);
    console.log('✅ Credenciales listas en la raíz del proyecto');
  } catch (err) {
    console.error('❌ Error en el script:', err);
    process.exit(1);
  }
})();