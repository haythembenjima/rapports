// Télécharge les fichiers de l'OCR (Tesseract.js + cœur WASM + données françaises)
// dans le dossier ocr/ afin de les EMBARQUER dans l'installateur (OCR 100% hors-ligne).
// Exécuté par le workflow GitHub Actions avant electron-builder.
import { writeFile, mkdir } from 'node:fs/promises';

const OUT = 'ocr';
const TJS = '5.1.1';        // version tesseract.js (lib + worker, doivent correspondre)
const CORE = '5.0.0';       // version tesseract.js-core (WASM)
const LANG = '4.0.0_fast';  // données tessdata « fast » : bien plus rapides sur CPU mobile
const PDFJS = '3.11.174';   // pdf.js (rendu des PDF en images pour l'OCR / l'IA)

const files = [
  [`https://cdn.jsdelivr.net/npm/tesseract.js@${TJS}/dist/tesseract.min.js`, 'tesseract.min.js'],
  [`https://cdn.jsdelivr.net/npm/tesseract.js@${TJS}/dist/worker.min.js`, 'worker.min.js'],
  [`https://cdn.jsdelivr.net/npm/tesseract.js-core@${CORE}/tesseract-core.wasm.js`, 'tesseract-core.wasm.js'],
  [`https://cdn.jsdelivr.net/npm/tesseract.js-core@${CORE}/tesseract-core.wasm`, 'tesseract-core.wasm'],
  [`https://cdn.jsdelivr.net/npm/tesseract.js-core@${CORE}/tesseract-core-simd.wasm.js`, 'tesseract-core-simd.wasm.js'],
  [`https://cdn.jsdelivr.net/npm/tesseract.js-core@${CORE}/tesseract-core-simd.wasm`, 'tesseract-core-simd.wasm'],
  [`https://cdn.jsdelivr.net/npm/tesseract.js-core@${CORE}/tesseract-core-lstm.wasm.js`, 'tesseract-core-lstm.wasm.js'],
  [`https://cdn.jsdelivr.net/npm/tesseract.js-core@${CORE}/tesseract-core-lstm.wasm`, 'tesseract-core-lstm.wasm'],
  [`https://cdn.jsdelivr.net/npm/tesseract.js-core@${CORE}/tesseract-core-simd-lstm.wasm.js`, 'tesseract-core-simd-lstm.wasm.js'],
  [`https://cdn.jsdelivr.net/npm/tesseract.js-core@${CORE}/tesseract-core-simd-lstm.wasm`, 'tesseract-core-simd-lstm.wasm'],
  [`https://tessdata.projectnaptha.com/${LANG}/fra.traineddata.gz`, 'fra.traineddata.gz'],
  // Version NON compressée du modèle « fast » : évite l'étape de décompression
  // (qui peut rester bloquée dans la WebView Android à cause des en-têtes .gz).
  [`https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/fra.traineddata`, 'fra.traineddata'],
  [`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS}/pdf.min.js`, 'pdf.min.js'],
  [`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS}/pdf.worker.min.js`, 'pdf.worker.min.js'],
];

await mkdir(OUT, { recursive: true });
for (const [url, name] of files) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Échec téléchargement ${url} (HTTP ${r.status})`);
  const buf = Buffer.from(await r.arrayBuffer());
  await writeFile(`${OUT}/${name}`, buf);
  console.log('OK', name, (buf.length / 1024).toFixed(0) + ' Ko');
}
console.log('OCR embarqué prêt dans', OUT + '/');
