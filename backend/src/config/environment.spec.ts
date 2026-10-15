import { validateEnvironment } from './environment';
describe('environment', () => {
  const valid = {
    DATABASE_URL: 'postgresql://localhost/test',
    JWT_SECRET: 'synthetic-test-only-secret-32-characters',
    JWT_EXPIRES_IN: '8h',
    CORS_ORIGINS: 'http://localhost:5173',
  };
  it('defaults preview off and supports only credential-free mock during Avance 1', () => {
    expect(validateEnvironment(valid)).toMatchObject({
      AI_PREVIEW_ENABLED: false,
      AI_PROVIDER: 'mock',
    });
    expect(
      validateEnvironment({ ...valid, AI_PREVIEW_ENABLED: 'true' })
        .AI_PREVIEW_ENABLED,
    ).toBe(true);
    expect(
      validateEnvironment({ ...valid, AI_PREVIEW_ENABLED: 'false' })
        .AI_PREVIEW_ENABLED,
    ).toBe(false);
  });
  it('rejects ambiguous preview configuration and real provider selection', () => {
    expect(() =>
      validateEnvironment({ ...valid, AI_PREVIEW_ENABLED: 'yes' }),
    ).toThrow('AI_PREVIEW_ENABLED');
    expect(() =>
      validateEnvironment({ ...valid, AI_PROVIDER: 'real-provider' }),
    ).toThrow('Only AI_PROVIDER=mock');
  });
  it('fails closed without critical configuration', () => {
    expect(() => validateEnvironment({})).toThrow('Missing DATABASE_URL');
    expect(() =>
      validateEnvironment({
        DATABASE_URL: 'postgresql://localhost/test',
        JWT_SECRET: 'short',
        JWT_EXPIRES_IN: '8h',
        CORS_ORIGINS: 'http://localhost:8080',
      }),
    ).toThrow('JWT_SECRET');
  });
});
