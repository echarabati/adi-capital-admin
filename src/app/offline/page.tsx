'use client';

import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="space-y-4 p-8 text-center">
        <WifiOff className="text-muted-foreground mx-auto h-16 w-16" />
        <h1 className="text-2xl font-bold">Sin conexión</h1>
        <p className="text-muted-foreground max-w-md">
          No hay conexión a internet. Por favor verifica tu conexión e intenta de nuevo.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground rounded-lg px-4 py-2 transition-opacity hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
