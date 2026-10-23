export function isAllowedFrontendOrigin(origin: string): boolean {
  const configuredOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
  if (origin === configuredOrigin) return true;
  if (process.env.NODE_ENV === 'production') return false;

  try {
    const parsedOrigin = new URL(origin);
    return parsedOrigin.protocol === 'http:'
      && ['localhost', '127.0.0.1', '[::1]'].includes(parsedOrigin.hostname);
  } catch {
    return false;
  }
}
