export function validateEnvironment(env: Record<string, unknown>) {
  for (const key of [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'CORS_ORIGINS',
  ]) {
    if (typeof env[key] !== 'string' || !env[key].trim())
      throw new Error(`Missing ${key}`);
  }
  if ((env.JWT_SECRET as string).length < 32)
    throw new Error('JWT_SECRET must have at least 32 characters');
  const database = new URL(env.DATABASE_URL as string);
  if (!['postgresql:', 'postgres:'].includes(database.protocol))
    throw new Error('DATABASE_URL must use PostgreSQL');
  if (!/^[1-9]\d*(ms|s|m|h|d|w)$/.test(env.JWT_EXPIRES_IN as string))
    throw new Error(
      'Invalid JWT_EXPIRES_IN; use a positive duration such as 8h',
    );
  const port = Number(env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('Invalid PORT');
  for (const origin of (env.CORS_ORIGINS as string).split(',')) {
    const url = new URL(origin.trim());
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.origin !== origin.trim()
    )
      throw new Error('Invalid CORS_ORIGINS');
  }
  const preview = env.AI_PREVIEW_ENABLED ?? 'false';
  if (!['true', 'false'].includes(String(preview)))
    throw new Error('AI_PREVIEW_ENABLED must be true or false');
  const provider = env.AI_PROVIDER ?? 'mock';
  if (provider !== 'mock')
    throw new Error('Only AI_PROVIDER=mock is supported during Avance 1');
  return {
    ...env,
    PORT: port,
    AI_PREVIEW_ENABLED: String(preview) === 'true',
    AI_PROVIDER: provider,
  };
}
