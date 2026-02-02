/**
 * Register Page - Redirect to Login
 *
 * This page redirects users trying to access /register or /auth/register
 * to the login page. The login page handles both sign-in and sign-up flows.
 *
 * @see ISSUE-SK-008
 */

import { redirect } from 'next/navigation';

export default function RegisterPage() {
  redirect('/login');
}
