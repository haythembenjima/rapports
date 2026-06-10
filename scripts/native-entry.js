// Point d'entrée natif (Android/Capacitor) — bundlé par esbuild en www/native-entry.js.
// Importe le cœur Capacitor et les plugins, puis expose des références fiables sur window.__cap
// pour que l'application (index.html, sans bundler) puisse enregistrer/partager des fichiers.
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

window.__cap = {
  isNative: Capacitor.isNativePlatform(),
  Filesystem,
  Directory,
  Share,
};
