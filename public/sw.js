// Custom SW additions - merged with next-pwa generated SW
// This listener enables SKIP_WAITING message from the client
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
