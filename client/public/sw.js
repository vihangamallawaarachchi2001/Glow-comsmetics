self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'Notification';
  const options = {
      body: data.body || 'You have a new notification.',
      icon: './vite.svg', 
      badge: './vite.svg' 
  };

  event.waitUntil(
      self.registration.showNotification(title, options)
  );
});
