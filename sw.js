/* Service worker de l'application principale (index.html).
   PRINCIPE DE PRUDENCE : il ne gère QUE les fichiers locaux de l'app (page,
   manifeste, bibliothèques vendorisées, icônes). Toute autre requête — Firebase,
   l'IA Gemini, l'API GitHub, n'importe quel CDN — passe directement au réseau,
   sans interception ni mise en cache. */
const CACHE = 'rapport-v1';
const ASSETS = [
    'index.html',
    'index.webmanifest',
    'vendor/tailwindcss-play.js',
    'vendor/fontawesome-6.0.0-all.min.js',
    'vendor/html2pdf.bundle.min.js',
    'vendor/docx-9.0.2.umd.js',
    'icons/enseignants-192.png',
    'icons/enseignants-512.png',
    'icons/enseignants-512-maskable.png'
];

const isOurs = (url) => {
    const u = new URL(url);
    if(u.origin !== self.location.origin) return false;
    return ASSETS.some(a => u.pathname.endsWith('/' + a)) || u.pathname.endsWith('/');
};

self.addEventListener('install', (e) => {
    // addAll échoue en bloc si un fichier manque : on met en cache fichier par fichier (tolérant).
    e.waitUntil(
        caches.open(CACHE)
            .then(c => Promise.all(ASSETS.map(a => c.add(a).catch(() => {}))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k.startsWith('rapport-') && k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    if(e.request.method !== 'GET' || !isOurs(e.request.url)) return;   // tout le reste : réseau normal
    // Réseau d'abord (pour toujours servir la dernière version), cache en secours hors ligne.
    e.respondWith(
        fetch(e.request)
            .then(resp => {
                const copy = resp.clone();
                caches.open(CACHE).then(c => c.put(e.request, copy));
                return resp;
            })
            .catch(() => caches.match(e.request, { ignoreSearch: true }))
    );
});
