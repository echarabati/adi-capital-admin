/**
 * SMTP Email Provider
 *
 * Uses Nodemailer for SMTP email delivery.
 * @see https://nodemailer.com
 */

import { logger } from '@/lib/logger';

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { getSmtpConfig } from '@/lib/env';
import type { EmailPayload, EmailResult } from './types';

let transporter: Transporter | null = null;

/**
 * Get or create SMTP transporter (singleton)
 */
function getTransporter(): Transporter {
  if (!transporter) {
    const config = getSmtpConfig();
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
  }
  return transporter;
}

/**
 * Send email using SMTP
 */
export async function sendWithSmtp(payload: EmailPayload): Promise<EmailResult> {
  try {
    const config = getSmtpConfig();
    const transport = getTransporter();

    const info = await transport.sendMail({
      from: config.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: process.env.SUPPORT_EMAIL || undefined,
      // Attachments for embedded images (e.g. logo) when running locally/SMTP without a public URL
      attachments: !process.env.EMAIL_LOGO_URL
        ? [
            {
              filename: 'email-logo.png',
              path: process.env.NEXT_PUBLIC_CLIENT_LOGO_DARK
                ? `./public${process.env.NEXT_PUBLIC_CLIENT_LOGO_DARK}`
                : './public/assets/timekast/email-logo.png',
              cid: 'logo', // referenced in layout.ts
            },
          ]
        : [],
      // Transactional email headers
      headers: {
        'Auto-Submitted': 'auto-generated',
        'X-Auto-Response-Suppress': 'All',
      },
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    logger.error('[SMTP] Error sending email:', message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Verify SMTP connection (useful for testing)
 */
export async function verifySmtpConnection(): Promise<boolean> {
  try {
    const transport = getTransporter();
    await transport.verify();
    return true;
  } catch {
    return false;
  }
}
