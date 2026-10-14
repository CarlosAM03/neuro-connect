import { validateEnvironment } from './environment';
describe('environment', () => {
  it('fails closed without critical configuration', () => {
    expect(() => validateEnvironment({})).toThrow('Missing DATABASE_URL');
    expect(() => validateEnvironment({ DATABASE_URL: 'postgresql://localhost/test', JWT_SECRET: 'short', JWT_EXPIRES_IN: '8h', CORS_ORIGINS: 'http://localhost:8080' })).toThrow('JWT_SECRET');
  });
});
