/**
 * Rate Limiting Module
 *
 * Provides rate limiting for auth endpoints.
 *
 * Strategy:
 * - Development: In-memory (no external deps required)
 * - Production: Upstash Redis (recommended for distributed)
 *
 * The module auto-selects based on UPSTASH_REDIS_REST_URL presence.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export interface RateLimitConfig {
  requests: number;
  windowSeconds: number;
  prefix: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const isUpstashConfigured = (): boolean => {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
};

// Default limits (can be overridden via env vars)
const LIMITS = {
  forgotPassword: {
    requests: parseInt(process.env.RATE_LIMIT_FORGOT_PASSWORD_REQUESTS || '5', 10),
    windowSeconds: parseInt(process.env.RATE_LIMIT_FORGOT_PASSWORD_WINDOW_SECONDS || '60', 10),
    prefix: 'ratelimit:forgot-password',
  },
  resetPassword: {
    requests: parseInt(process.env.RATE_LIMIT_RESET_PASSWORD_REQUESTS || '10', 10),
    windowSeconds: parseInt(process.env.RATE_LIMIT_RESET_PASSWORD_WINDOW_SECONDS || '60', 10),
    prefix: 'ratelimit:reset-password',
  },
  auth: {
    requests: parseInt(process.env.RATE_LIMIT_AUTH_REQUESTS || '10', 10),
    windowSeconds: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_SECONDS || '60', 10),
    prefix: 'ratelimit:auth',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// In-Memory Rate Limiter (Development / Small Apps)
// ─────────────────────────────────────────────────────────────────────────────

interface MemoryEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, MemoryEntry>();

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, entry] of memoryStore.entries()) {
        if (now > entry.resetAt) {
          memoryStore.delete(key);
        }
      }
    },
    5 * 60 * 1000
  );
}

function memoryRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const fullKey = `${config.prefix}:${key}`;
  const entry = memoryStore.get(fullKey);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(fullKey, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      limit: config.requests,
      remaining: config.requests - 1,
      reset: Math.floor((now + windowMs) / 1000),
    };
  }

  if (entry.count >= config.requests) {
    return {
      success: false,
      limit: config.requests,
      remaining: 0,
      reset: Math.floor(entry.resetAt / 1000),
    };
  }

  entry.count++;
  return {
    success: true,
    limit: config.requests,
    remaining: config.requests - entry.count,
    reset: Math.floor(entry.resetAt / 1000),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Upstash Rate Limiter (Production)
// ─────────────────────────────────────────────────────────────────────────────

let upstashRateLimiters: Map<string, Ratelimit> | null = null;

function getUpstashRateLimiter(config: RateLimitConfig): Ratelimit {
  if (!upstashRateLimiters) {
    upstashRateLimiters = new Map();
  }

  if (!upstashRateLimiters.has(config.prefix)) {
    const redis = Redis.fromEnv();
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.requests, `${config.windowSeconds} s`),
      analytics: true,
      prefix: config.prefix,
    });
    upstashRateLimiters.set(config.prefix, limiter);
  }

  return upstashRateLimiters.get(config.prefix)!;
}

async function upstashRateLimit(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
  const limiter = getUpstashRateLimiter(config);
  const result = await limiter.limit(key);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check rate limit for an identifier (usually IP address).
 * Auto-selects between in-memory (dev) and Upstash (prod).
 */
export async function checkRateLimit(
  identifier: string,
  type: keyof typeof LIMITS
): Promise<RateLimitResult> {
  const config = LIMITS[type];

  if (isUpstashConfigured()) {
    return upstashRateLimit(identifier, config);
  }

  return memoryRateLimit(identifier, config);
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}

/**
 * Extract client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Vercel/Cloudflare headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback for local development
  return '127.0.0.1';
}

/**
 * Create a 429 Too Many Requests response
 */
export function rateLimitExceededResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: result.reset - Math.floor(Date.now() / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(result),
      },
    }
  );
}

/**
 * Get current rate limit mode (for debugging/status)
 */
export function getRateLimitMode(): 'upstash' | 'memory' {
  return isUpstashConfigured() ? 'upstash' : 'memory';
}
