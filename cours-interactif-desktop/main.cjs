// Processus principal Electron pour « Cours Interactif ».
//
// L'application est un site Next.js (OpenMAIC) avec des routes serveur. On ne peut
// donc pas charger un simple fichier : au démarrage on lance le serveur Next
// « standalone » en local (avec le Node intégré d'Electron, via ELECTRON_RUN_AS_NODE),
// puis on ouvre la fenêtre sur http://127.0.0.1:<port>.
//
// La clé API (Google Gemini) se saisit dans les Paramètres de l'application.

const { app, BrowserWindow, shell, Menu, dialog } = require('electron');
const { spawn } = require('child_process');
const http = require('http');
const net = require('net');
const path = require('path');
const fs = require('fs');

let serverProc = null;
let serverPort = 0;
let mainWindow = null;
let serverExited = null; // { code, signal } si le serveur s'arrête avant d'être prêt
let serverSpawnError = null;

// --- Journalisation -----------------------------------------------------------
const recentLog = [];
let logStream = null;

function logPath() {
  try {
    return path.join(app.getPath('userData'), 'server.log');
  } catch {
    return path.join(require('os').tmpdir(), 'cours-interactif-server.log');
  }
}

function log(line) {
  const s = `${new Date().toISOString()} ${line}`;
  recentLog.push(s);
  if (recentLog.length > 120) recentLog.shift();
  try {
    if (!logStream) logStream = fs.createWriteStream(logPath(), { flags: 'w' });
    logStream.write(s + '\n');
  } catch {
    /* ignore */
  }
}

/** Emplacement du serveur Next standalone (packagé vs développement). */
function standaloneDir() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'standalone')
    : path.join(__dirname, '..', 'cours-interactif', '.next', 'standalone');
}

/** Demande au système un port libre. */
function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

/** Lance server.js avec le binaire Electron utilisé comme Node. */
function startServer(port) {
  const dir = standaloneDir();
  const serverJs = path.join(dir, 'server.js');

  log(`[launcher] version=${app.getVersion()} platform=${process.platform} arch=${process.arch}`);
  log(`[launcher] electron=${process.versions.electron} node=${process.versions.node}`);
  log(`[launcher] execPath=${process.execPath}`);
  log(`[launcher] standaloneDir=${dir}`);
  log(`[launcher] server.js exists=${fs.existsSync(serverJs)}`);
  log(`[launcher] node_modules exists=${fs.existsSync(path.join(dir, 'node_modules'))}`);
  log(`[launcher] .next exists=${fs.existsSync(path.join(dir, '.next'))}`);
  log(`[launcher] PORT=${port}`);

  if (!fs.existsSync(serverJs)) {
    serverSpawnError = new Error(`Fichier serveur introuvable : ${serverJs}`);
    log(`[launcher] ERREUR: ${serverSpawnError.message}`);
    return;
  }

  serverProc = spawn(process.execPath, [serverJs], {
    cwd: dir,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      NODE_ENV: 'production',
      PORT: String(port),
      HOSTNAME: '127.0.0.1',
      NEXT_TELEMETRY_DISABLED: '1',
    },
    windowsHide: true,
  });

  if (serverProc.stdout) serverProc.stdout.on('data', (d) => log('[server] ' + d.toString().trimEnd()));
  if (serverProc.stderr) serverProc.stderr.on('data', (d) => log('[server:err] ' + d.toString().trimEnd()));
  serverProc.on('error', (err) => {
    serverSpawnError = err;
    log('[launcher] erreur de lancement : ' + err.message);
  });
  serverProc.on('exit', (code, signal) => {
    serverExited = { code, signal };
    log(`[server] processus terminé (code=${code} signal=${signal})`);
    serverProc = null;
  });
}

/** Attend que le serveur réponde, ou échoue tôt s'il plante. */
function waitForServer(port, timeoutMs = 300000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const fail = (msg) => reject(new Error(msg));
    const attempt = () => {
      if (serverSpawnError) return fail('Échec du lancement du serveur : ' + serverSpawnError.message);
      if (serverExited) return fail(`Le serveur s'est arrêté au démarrage (code=${serverExited.code}).`);
      const req = http.get({ host: '127.0.0.1', port, path: '/', timeout: 2500 }, (res) => {
        res.resume();
        log(`[launcher] serveur prêt (HTTP ${res.statusCode}) en ${Date.now() - start} ms`);
        resolve();
      });
      req.on('error', retry);
      req.on('timeout', () => {
        req.destroy();
        retry();
      });
    };
    const retry = () => {
      if (serverExited) return fail(`Le serveur s'est arrêté au démarrage (code=${serverExited.code}).`);
      if (Date.now() - start > timeoutMs) {
        return fail("Le moteur de l'application n'a pas démarré à temps.");
      }
      setTimeout(attempt, 400);
    };
    attempt();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'Cours Interactif',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#0b1020',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Écran de chargement le temps que le serveur local démarre.
  mainWindow.loadFile(path.join(__dirname, 'loading.html'));

  // Les liens externes (clé API, documentation…) s'ouvrent dans le navigateur.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url) && !url.includes(`127.0.0.1:${serverPort}`)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function buildMenu() {
  const template = [
    { label: 'Fichier', submenu: [{ role: 'quit', label: 'Quitter' }] },
    {
      label: 'Édition',
      submenu: [
        { role: 'undo', label: 'Annuler' },
        { role: 'redo', label: 'Rétablir' },
        { type: 'separator' },
        { role: 'cut', label: 'Couper' },
        { role: 'copy', label: 'Copier' },
        { role: 'paste', label: 'Coller' },
        { role: 'selectAll', label: 'Tout sélectionner' },
      ],
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload', label: 'Recharger' },
        { role: 'forceReload', label: 'Forcer le rechargement' },
        { role: 'resetZoom', label: 'Zoom normal' },
        { role: 'zoomIn', label: 'Zoom +' },
        { role: 'zoomOut', label: 'Zoom −' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Plein écran' },
        { role: 'toggleDevTools', label: 'Outils de développement' },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(async () => {
  buildMenu();
  createWindow();
  try {
    serverPort = await getFreePort();
    startServer(serverPort);
    await waitForServer(serverPort);
    if (mainWindow) {
      await mainWindow.loadURL(`http://127.0.0.1:${serverPort}/`);
    }
  } catch (err) {
    const tail = recentLog.slice(-22).join('\n');
    log('[launcher] ÉCHEC : ' + (err && err.message ? err.message : String(err)));
    dialog.showErrorBox(
      'Cours Interactif',
      "Impossible de démarrer le moteur de l'application.\n\n" +
        (err && err.message ? err.message : String(err)) +
        '\n\nJournal complet :\n' +
        logPath() +
        '\n\n--- Détails ---\n' +
        tail,
    );
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

function stopServer() {
  if (serverProc && !serverProc.killed) {
    try {
      serverProc.kill();
    } catch {
      /* ignore */
    }
    serverProc = null;
  }
}

app.on('window-all-closed', () => {
  stopServer();
  if (process.platform !== 'darwin') app.quit();
});
app.on('before-quit', stopServer);
app.on('quit', stopServer);
