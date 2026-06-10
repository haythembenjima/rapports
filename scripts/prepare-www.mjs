// Prépare le dossier www/ (racine web embarquée par Capacitor pour l'APK Android) :
// y copie index.html et les fichiers OCR (ocr/) s'ils existent, et injecte le script natif.
import { rm, mkdir, copyFile, cp, access, readFile, writeFile } from 'node:fs/promises';

await rm('www', { recursive: true, force: true });
await mkdir('www', { recursive: true });
await copyFile('index.html', 'www/index.html');

// Injecte <script src="native-entry.js"> (plugins Capacitor bundlés) dans le <head> de www/index.html.
// Le fichier native-entry.js est produit par esbuild (étape du workflow) ; le tag est inoffensif s'il manque.
try {
  let html = await readFile('www/index.html', 'utf8');
  if (!html.includes('native-entry.js')) {
    const tag = '<script src="native-entry.js"></script>\n';
    if (html.includes('</head>')) html = html.replace('</head>', '    ' + tag + '</head>');
    else html = tag + html;
    await writeFile('www/index.html', html);
    console.log('native-entry.js injecté dans www/index.html');
  }
} catch (e) {
  console.log('Injection native-entry.js ignorée :', e.message);
}

try {
  await access('ocr');
  await cp('ocr', 'www/ocr', { recursive: true });
  console.log('OCR copié dans www/ocr');
} catch {
  console.log('Dossier ocr/ absent — OCR via CDN au runtime.');
}
console.log('www/ prêt.');
