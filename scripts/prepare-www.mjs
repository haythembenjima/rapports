// Prépare le dossier www/ (racine web embarquée par Capacitor pour l'APK Android) :
// y copie index.html ET enseignants.html (base des enseignants) + leurs assets et les fichiers
// OCR (ocr/) s'ils existent, puis injecte le script natif dans les deux pages HTML.
import { rm, mkdir, copyFile, cp, access, readFile, writeFile } from 'node:fs/promises';

await rm('www', { recursive: true, force: true });
await mkdir('www', { recursive: true });
await copyFile('index.html', 'www/index.html');
await copyFile('enseignants.html', 'www/enseignants.html');

// Assets de la base des enseignants (manifeste, service worker, icônes) — copiés s'ils existent.
for (const f of ['enseignants.webmanifest', 'enseignants-sw.js']) {
  try { await copyFile(f, 'www/' + f); } catch { /* facultatif */ }
}
try { await access('icons'); await cp('icons', 'www/icons', { recursive: true }); } catch { /* facultatif */ }

// Injecte <script src="native-entry.js"> (plugins Capacitor bundlés) dans le <head> des pages.
// Le fichier native-entry.js est produit par esbuild (étape du workflow) ; le tag est inoffensif s'il manque.
async function injectNative(file) {
  try {
    let html = await readFile(file, 'utf8');
    if (!html.includes('native-entry.js')) {
      const tag = '<script src="native-entry.js"></script>\n';
      if (html.includes('</head>')) html = html.replace('</head>', '    ' + tag + '</head>');
      else html = tag + html;
      await writeFile(file, html);
      console.log('native-entry.js injecté dans ' + file);
    }
  } catch (e) {
    console.log('Injection native-entry.js ignorée (' + file + ') :', e.message);
  }
}
await injectNative('www/index.html');
await injectNative('www/enseignants.html');

try {
  await access('ocr');
  await cp('ocr', 'www/ocr', { recursive: true });
  console.log('OCR copié dans www/ocr');
} catch {
  console.log('Dossier ocr/ absent — OCR via CDN au runtime.');
}
console.log('www/ prêt (index.html + enseignants.html).');
