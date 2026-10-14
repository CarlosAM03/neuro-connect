export function validateEnvironment(env: Record<string, unknown>) {
  for (const key of ['DATABASE_URL', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'CORS_ORIGINS']) {
    if (typeof env[key] !== 'string' || !env[key].trim()) throw new Error(`Missing ${key}`);
  }
  if ((env.JWT_SECRET as string).length < 32) throw new Error('JWT_SECRET must have at least 32 characters');
  const port = Number(env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
  for (const origin of (env.CORS_ORIGINS as string).split(',')) {
    const url = new URL(origin.trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin.trim()) throw new Error('Invalid CORS_ORIGINS');
  }
  return { ...env, PORT: port };
}
