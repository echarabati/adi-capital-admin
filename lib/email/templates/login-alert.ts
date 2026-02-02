/**
 * Login Alert Email Template
 *
 * Sent when a user logs in (if login alerts are enabled).
 * Security notification for new session detection.
 *
 * Feature flag: NEXT_PUBLIC_AUTH_LOGIN_ALERT (default: false)
 */

import { getEnv } from '@/lib/env';
import { emailLayout } from './layout';

interface LoginAlertParams {
  /** User's name (optional, for personalized greeting) */
  userName?: string;
  /** When the login occurred */
  loginAt: Date;
  /** IP address where login originated (optional) */
  ipAddress?: string;
  /** Browser/device info (optional) */
  userAgent?: string;
  /** URL to report suspicious activity (optional) */
  suspiciousUrl?: string;
}

/**
 * Check if login alerts are enabled
 */
export function isLoginAlertEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_AUTH_LOGIN_ALERT;
  return flag === 'true' || flag === 'TRUE' || flag === '1';
}

/**
 * Format date in Spanish locale
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Parse user agent to a more readable format
 */
function parseUserAgent(userAgent?: string): string {
  if (!userAgent) return 'Desconocido';

  // Simple parsing - extract browser and OS
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';

  return userAgent.slice(0, 50) + (userAgent.length > 50 ? '...' : '');
}

/**
 * Generate login alert HTML
 */
export function loginAlertEmail({
  userName,
  loginAt,
  ipAddress,
  userAgent,
  suspiciousUrl,
}: LoginAlertParams): string {
  const env = getEnv();
  const appName = env.NEXT_PUBLIC_APP_NAME || 'App';
  const supportEmail = env.NEXT_PUBLIC_SUPPORT_EMAIL || '';
  const greeting = userName ? `Hola ${userName},` : 'Hola,';
  const formattedDate = formatDate(loginAt);
  const device = parseUserAgent(userAgent);

  // Support/report link
  const reportUrl =
    suspiciousUrl ||
    (supportEmail
      ? `mailto:${supportEmail}?subject=Actividad%20sospechosa%20en%20mi%20cuenta`
      : '');
  const reportLink = reportUrl
    ? `<a href="${reportUrl}" style="color: #1e40af; text-decoration: underline;">Asegura tu cuenta</a>`
    : 'contacta a soporte';

  // Details table
  const detailsRows = [
    `<tr><td style="padding: 8px 0; color: #6b7280;"><strong>Fecha:</strong></td><td style="padding: 8px 0;">${formattedDate}</td></tr>`,
  ];
  if (ipAddress) {
    detailsRows.push(
      `<tr><td style="padding: 8px 0; color: #6b7280;"><strong>IP:</strong></td><td style="padding: 8px 0;">${ipAddress}</td></tr>`
    );
  }
  if (userAgent) {
    detailsRows.push(
      `<tr><td style="padding: 8px 0; color: #6b7280;"><strong>Navegador:</strong></td><td style="padding: 8px 0;">${device}</td></tr>`
    );
  }

  const content = `
    <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">Nuevo inicio de sesión</h2>
    <p style="margin: 0 0 16px 0;">${greeting}</p>
    <p style="margin: 0 0 16px 0;">
      Detectamos un nuevo inicio de sesión en tu cuenta de ${appName}.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background-color: #f9fafb; border-radius: 6px; padding: 16px; margin: 16px 0;">
      ${detailsRows.join('')}
    </table>
    <p style="color: #6b7280; font-size: 14px; margin: 16px 0;">
      Si fuiste tú, puedes ignorar este email.
    </p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="margin: 0; padding: 16px; background-color: #fef2f2; border-radius: 6px; border-left: 4px solid #dc2626;">
      <strong style="color: #dc2626;">¿No reconoces esta actividad?</strong><br />
      <span style="color: #374151;">Tu cuenta puede estar comprometida. ${reportLink} inmediatamente.</span>
    </p>
  `;

  return emailLayout(content, {
    preheader: `Nuevo inicio de sesión detectado en ${appName} - ${formattedDate}`,
  });
}

/**
 * Generate login alert plain text version
 */
export function loginAlertEmailText({
  userName,
  loginAt,
  ipAddress,
  userAgent,
}: LoginAlertParams): string {
  const env = getEnv();
  const appName = env.NEXT_PUBLIC_APP_NAME || 'App';
  const supportEmail = env.NEXT_PUBLIC_SUPPORT_EMAIL || 'soporte';
  const greeting = userName ? `Hola ${userName},` : 'Hola,';
  const formattedDate = formatDate(loginAt);
  const device = parseUserAgent(userAgent);

  let details = `Fecha: ${formattedDate}\n`;
  if (ipAddress) details += `IP: ${ipAddress}\n`;
  if (userAgent) details += `Navegador: ${device}\n`;

  return `
Nuevo inicio de sesión en ${appName}

${greeting}

Detectamos un nuevo inicio de sesión en tu cuenta.

${details}
Si fuiste tú, puedes ignorar este email.

---

¿NO RECONOCES ESTA ACTIVIDAD?

Tu cuenta puede estar comprometida.
Contacta soporte inmediatamente: ${supportEmail}
  `.trim();
}
