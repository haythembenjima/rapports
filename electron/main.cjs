// Processus principal Electron : ouvre l'application (index.html) dans une fenêtre de bureau.
const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 920,
    minWidth: 800,
    minHeight: 600,
    title: "Rapport d'Inspection — Gestion",
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, '..', 'index.html'));

  // Les liens externes (clé API Gemini, etc.) s'ouvrent dans le navigateur par défaut.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) { shell.openExternal(url); return { action: 'deny' }; }
    return { action: 'allow' };
  });
}

// Menu minimal en français (Fichier / Édition / Affichage).
function buildMenu() {
  const template = [
    { label: 'Fichier', submenu: [{ role: 'quit', label: 'Quitter' }] },
    { label: 'Édition', submenu: [
      { role: 'undo', label: 'Annuler' }, { role: 'redo', label: 'Rétablir' }, { type: 'separator' },
      { role: 'cut', label: 'Couper' }, { role: 'copy', label: 'Copier' }, { role: 'paste', label: 'Coller' }, { role: 'selectAll', label: 'Tout sélectionner' }
    ]},
    { label: 'Affichage', submenu: [
      { role: 'reload', label: 'Recharger' }, { role: 'resetZoom', label: 'Zoom normal' },
      { role: 'zoomIn', label: 'Zoom +' }, { role: 'zoomOut', label: 'Zoom −' }, { type: 'separator' },
      { role: 'togglefullscreen', label: 'Plein écran' }
    ]}
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
