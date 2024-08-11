// Register service worker to control making site work offline

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/calify/sw.js')
    .then(() => { console.log('Service Worker Registered'); });
}

