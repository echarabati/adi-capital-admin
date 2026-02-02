'use client';

/**
 * Register Service Worker update listener.
 * Handles page reload when new SW takes control.
 *
 * Mount once in Providers.tsx (or root layout client wrapper).
 */
export function registerSwListener() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  // Reload when new SW activates and takes control
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}
