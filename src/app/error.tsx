'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        {/* Icon */}
        <div className="bg-error/20 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <AlertTriangle className="text-error h-10 w-10" />
        </div>

        {/* Title */}
        <h1 className="text-foreground mb-2 text-2xl font-semibold">Algo salió mal</h1>

        {/* Description */}
        <p className="text-muted-foreground mb-8 max-w-md">
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
        </p>

        {/* Error digest (dev only) */}
        {process.env.NODE_ENV === 'development' && error.digest && (
          <p className="text-muted-foreground mb-4 font-mono text-xs">Error ID: {error.digest}</p>
        )}

        {/* Action */}
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
