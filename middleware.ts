/**
 * Next.js Middleware
 *
 * Handles:
 * - Correlation ID generation for request tracing
 * - Auth redirect logic (if needed)
 *
 * @see OBS-003
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get or generate correlation ID
  const correlationId = request.headers.get('x-correlation-id') ?? crypto.randomUUID();

  // Clone the response
  const response = NextResponse.next();

  // Add correlation ID to response headers
  response.headers.set('x-correlation-id', correlationId);

  // Also set as request header for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-correlation-id', correlationId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Skip static files and images
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\..*).*)'],
};
