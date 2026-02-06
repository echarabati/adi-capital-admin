/**
 * Fund Cookie Utilities
 *
 * Cookie helpers for persisting selected fund across sessions.
 * Server-readable cookie for SSR support.
 *
 * @see DASH-002
 */

const FUND_COOKIE_NAME = 'selected-fondo';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Get the selected fund ID from cookie (client-side)
 */
export function getSelectedFundFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(new RegExp(`(^| )${FUND_COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Set the selected fund ID in cookie (client-side)
 */
export function setSelectedFundCookie(fondoId: string): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${FUND_COOKIE_NAME}=${encodeURIComponent(fondoId)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

/**
 * Clear the selected fund cookie (client-side)
 */
export function clearSelectedFundCookie(): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${FUND_COOKIE_NAME}=; path=/; max-age=0`;
}

/**
 * Get the fund cookie name for server-side reading
 */
export const SELECTED_FUND_COOKIE_NAME = FUND_COOKIE_NAME;
