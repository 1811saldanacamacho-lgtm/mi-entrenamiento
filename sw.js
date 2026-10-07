// Hace que la app funcione sin internet: guarda sus archivos y los usa cuando no hay conexión.
// Con conexión siempre se pide la versión más nueva, así que las actualizaciones llegan solas.
const CACHE = 'mi-entrenamiento-v1';
const ARCHIVOS = ['./', 'index.html', 'estilos.css', 'animaciones.js', 'musculos.js', 'plan.js', 'app.js',
  'manifest.webmanifest', 'iconos/icono-192.png', 'iconos/icono-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(nombres => Promise.all(nombres.filter(n => n !== CACHE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(respuesta => {
      if (respuesta.ok) { const copia = respuesta.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
      return respuesta;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
