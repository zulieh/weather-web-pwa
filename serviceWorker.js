const staticTodayWeather = "today-weather-site-v1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/index.js",
  "/img/SVG/magnifying-glass.svg",
  "/img/sprite.svg"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticTodayWeather).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})