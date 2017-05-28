/* global self, clients */
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
