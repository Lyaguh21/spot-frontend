const CACHE_NAME = "spot-cache-v6";
const ASSETS = [
  "/index.html",
  "/manifest.webmanifest",
  "/icons/Logo.svg",
  "/icons/FullLogo.svg",
  "/icons/MainAppLogo.png",
  "/icons/MainAppLogo-192.png",
  "/icons/favicon-16.png",
  "/icons/favicon-32.png",
  "/icons/apple-touch-icon.png",
  "/icons/icon-48.png",
  "/icons/icon-72.png",
  "/icons/icon-96.png",
  "/icons/icon-128.png",
  "/icons/icon-192.png",
  "/icons/icon-256.png",
  "/icons/icon-512.png",
];

async function precacheAssets() {
  const cache = await caches.open(CACHE_NAME);

  await Promise.all(
    ASSETS.map(async (asset) => {
      try {
        const response = await fetch(asset, { cache: "reload" });

        if (!response.ok) {
          console.warn(`[sw] skip precache ${asset}: ${response.status}`);
          return;
        }

        await cache.put(asset, response);
      } catch (error) {
        console.warn(`[sw] skip precache ${asset}`, error);
      }
    }),
  );
}

async function fetchAndCache(request) {
  const response = await fetch(request);

  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }

  return response;
}

async function networkFirst(request, fallbackUrl) {
  try {
    return await fetchAndCache(request);
  } catch {
    const cached =
      (await caches.match(request)) ??
      (fallbackUrl ? await caches.match(fallbackUrl) : undefined);

    return cached ?? Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  return fetchAndCache(request);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    precacheAssets().then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) {
    return;
  }

  if (
    request.mode === "navigate" ||
    url.pathname === "/" ||
    url.pathname === "/index.html"
  ) {
    event.respondWith(networkFirst(request, "/index.html"));
    return;
  }

  if (url.pathname === "/manifest.webmanifest") {
    event.respondWith(networkFirst(request, "/manifest.webmanifest"));
    return;
  }

  event.respondWith(cacheFirst(request));
});
