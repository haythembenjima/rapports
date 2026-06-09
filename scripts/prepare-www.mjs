// Prépare le dossier www/ (racine web embarquée par Capacitor pour l'APK Android) :
// y copie index.html et les fichiers OCR (ocr/) s'ils existent.
import { rm, mkdir, copyFile, cp, access } from 'node:fs/promises';

await rm('www', { recursive: true, force: true });
await mkdir('www', { recursive: true });
await copyFile('index.html', 'www/index.html');
try {
  await access('ocr');
  await cp('ocr', 'www/ocr', { recursive: true });
  console.log('OCR copié dans www/ocr');
} catch {
  console.log('Dossier ocr/ absent — OCR via CDN au runtime.');
}
console.log('www/ prêt.');
