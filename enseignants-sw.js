/* Service worker du site « Base des enseignants » (enseignants.html).
   PRINCIPE DE PRUDENCE : il ne s'occupe QUE des fichiers du site enseignants
   (page, manifeste, icônes). Toute autre requête — l'application principale
   index.html, Firebase, les CDN — passe directement au réseau, sans
   interception ni mise en cache. */
const CACHE = 'enseignants-v1';
const ASSETS = [
    'enseignants.html',
    'enseignants.webmanifest',
    'icons/enseignants-192.png',
    'icons/enseignants-512.png',
    'icons/enseignants-512-maskable.png'
];

const isOurs = (url) => {
    const u = new URL(url);
    if(u.origin !== self.location.origin) return false;
    return ASSETS.some(a => u.pathname.endsWith('/' + a));
};

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k.startsWith('enseignants-') && k !== CACHE).map(k => caches.delete(k))))
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
