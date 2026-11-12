// Stub: unsuscribe el service worker viejo de Asedio Neón / Zancudos y limpia cachés,
// luego manda a la URL nueva.
const DEST = "https://millo-games.github.io/zancudos-al-ataque/";
self.addEventListener("install", (e) => { e.waitUntil(self.skipWaiting()); });
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of clients) {
      try {
        const u = new URL(c.url);
        const path = u.pathname.replace(/^\/asedio-neon\/?/, "");
        await c.navigate(DEST + path + u.search + u.hash);
      } catch (_) {}
    }
    await self.registration.unregister();
  })());
});
self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    const u = new URL(e.request.url);
    const path = u.pathname.replace(/^\/asedio-neon\/?/, "");
    e.respondWith(Response.redirect(DEST + path + u.search + u.hash, 302));
    return;
  }
  // Deja pasar el resto (imagen OG, favicon) para que los crawlers vean la vista previa.
});
