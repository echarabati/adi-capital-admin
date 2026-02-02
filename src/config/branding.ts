/**
 * Branding Configuration
 *
 * Central place to configure app branding (name, logos, tagline).
 * These can be overridden via environment variables for each project.
 *
 * IMPORTANT: Only NEXT_PUBLIC_* vars are used (client-safe).
 */

export const branding = {
  /** App name shown in headers, auth screens, etc. */
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Mi App',

  /** Short tagline shown below app name */
  appTagline: process.env.NEXT_PUBLIC_APP_TAGLINE || '',

  /** App URL for links */
  appUrl: process.env.NEXT_PUBLIC_APP_URL || '',

  /**
   * Primary logo for PWA/emails (deterministic, no runtime fallback)
   * Priority: NEXT_PUBLIC_CLIENT_LOGO_URL env var → default TimeKast
   */
  logo: process.env.NEXT_PUBLIC_CLIENT_LOGO_URL || '/assets/timekast/timekast-logo-blue-full.png',

  /** Logo alt text */
  logoAlt: process.env.NEXT_PUBLIC_APP_NAME || 'TimeKast',

  /** Path to client logo SVG/PNG. Set to null to use app name text instead */
  clientLogoPath: process.env.NEXT_PUBLIC_CLIENT_LOGO || null,

  /** TimeKast branding paths */
  timekast: {
    logoBlue: '/assets/timekast/timekast-logo-blue.png',
    logoBlueText: '/assets/timekast/timekast-logo-blue-full.png',
    logoSilver: '/assets/timekast/timekast-logo-silver.png',
    logoSilverText: '/assets/timekast/timekast-logo-silver-full.png',
  },

  /** Get the appropriate TimeKast logo based on theme */
  getTimeKastLogo: (variant: 'icon' | 'full' = 'full', theme?: string) => {
    // Use blue for light theme, silver for dark themes (midnight/dark)
    const validTheme =
      theme === 'light' || theme === 'midnight' || theme === 'dark' ? theme : 'midnight';
    const color = validTheme === 'light' ? 'blue' : 'silver';
    const suffix = variant === 'full' ? '-full' : '';
    return `/assets/timekast/timekast-logo-${color}${suffix}.png`;
  },
} as const;

export type Branding = typeof branding;
