/* eslint-env serviceworker */
/* global WorkboxSW */

importScripts('./node_modules/workbox-sw/build/importScripts/workbox-sw.prod.v2.1.3.js')

const workbox = new WorkboxSW({clientsClaim: true})
workbox.precache([])

workbox.router.registerNavigationRoute('/index.html')

// cache loaded polyfill
workbox.router.registerRoute(
  '/bower_components/webcomponentsjs/:anything',
  workbox.strategies.cacheFirst()
)

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? JSON.parse(event.data.text()) : { body: 'new notification' }
  event.waitUntil(
    self.registration.showNotification('Vientos', {
      badge: 'images/push-badge.png',
      icon: 'images/logo.png',
      body: data.body,
      data: data.iri
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  console.log(event.notification)
  clients.openWindow('/conversation/' + event.notification.data.split('/').pop())
})
