/**
 * Mirrors getFriendlyErrorMessage from the Flutter mobile app (connect/Utils/error_handler.dart)
 * for complete parity in user-facing error reporting.
 */
export function getFriendlyErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred. Please try again.';
  const message = (err.message || err.error_description || err.toString() || '').toLowerCase();

  // Network / Connection errors
  if (
    message.includes('network') ||
    message.includes('failed to fetch') ||
    message.includes('timeout') ||
    message.includes('connection refused') ||
    message.includes('failed host lookup')
  ) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Supabase / DB unique constraint errors
  if (
    message.includes('unique_constraint') ||
    message.includes('already exists') ||
    message.includes('duplicate key')
  ) {
    return 'This record already exists.';
  }

  // Supabase Auth specific error parsing
  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid_credentials')
  ) {
    return 'Incorrect email or password. Please try again.';
  }
  if (
    message.includes('email not confirmed') ||
    message.includes('email_not_confirmed')
  ) {
    return 'Please verify your email address before signing in.';
  }
  if (
    message.includes('user not found') ||
    message.includes('user_not_found')
  ) {
    return 'No account found with this email.';
  }
  if (
    message.includes('user already exists') ||
    message.includes('user already registered') ||
    message.includes('email already in use') ||
    message.includes('email_already_exists')
  ) {
    return 'An account with this email address already exists.';
  }
  if (
    message.includes('weak password') ||
    message.includes('password_too_short') ||
    message.includes('should be at least')
  ) {
    return 'Please choose a stronger password (at least 6 characters).';
  }
  if (
    message.includes('invalid verification code') ||
    message.includes('invalid_grant') ||
    message.includes('otp_expired') ||
    message.includes('invalid token') ||
    message.includes('token has expired')
  ) {
    return 'Invalid or expired verification code. Please request a new one.';
  }

  // Permission / RLS issues
  if (
    message.includes('row-level security') ||
    message.includes('violates row-level security policy') ||
    message.includes('permission denied')
  ) {
    return 'You do not have permission to perform this action.';
  }

  // Return clean text if it is already concise and descriptive
  const raw = err.message || err.error_description || (typeof err === 'string' ? err : '');
  if (raw && raw.length > 5 && raw.length < 120 && !raw.includes('{') && !raw.includes('PostgrestError')) {
    return raw;
  }

  return 'Something went wrong. Please try again.';
}
