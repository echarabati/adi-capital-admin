'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component to catch and display errors gracefully
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="flex min-h-50 flex-col items-center justify-center rounded-xl border p-8"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <div className="bg-error/20 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <AlertTriangle className="text-error h-6 w-6" />
          </div>
          <h3 className="text-foreground mb-2 font-semibold">Algo salió mal</h3>
          <p className="text-muted-foreground text-sm">
            Ha ocurrido un error al cargar este componente.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="bg-primary text-primary-foreground hover:bg-primary-hover mt-4 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
