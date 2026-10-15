// Creates local-only credentials; never overwrites existing environment files.
const fs = require('node:fs');
const crypto = require('node:crypto');
if (fs.existsSync('.env') || fs.existsSync('backend/.env')) {
  throw new Error('Environment exists. Preserve it and configure manually from .env.example.');
}
const password = crypto.randomBytes(24).toString('hex');
const jwt = crypto.randomBytes(48).toString('hex');
const seedPassword = crypto.randomBytes(16).toString('hex');
fs.writeFileSync('.env', `POSTGRES_USER=neuroconnect\nPOSTGRES_DB=neuroconnect\nPOSTGRES_PASSWORD=${password}\nPOSTGRES_PORT=5434\nJWT_SECRET=${jwt}\nJWT_EXPIRES_IN=8h\nPORT=3000\nCORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173\nSWAGGER_ENABLED=true\nFRONTEND_PORT=5173\nAPI_BASE_URL=http://localhost:3000/api/v1\nSEED_PASSWORD=${seedPassword}\nAI_PREVIEW_ENABLED=true\nAI_PROVIDER=mock\nAI_MODEL=\nAI_API_KEY=\n`);
fs.writeFileSync('backend/.env', `DATABASE_URL=postgresql://neuroconnect:${password}@localhost:5434/neuroconnect?schema=public\nJWT_SECRET=${jwt}\nJWT_EXPIRES_IN=8h\nPORT=3000\nCORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173\nSWAGGER_ENABLED=true\nSEED_PASSWORD=${seedPassword}\nAI_PREVIEW_ENABLED=true\nAI_PROVIDER=mock\nAI_MODEL=\nAI_API_KEY=\n`);
console.log('Created ignored .env and backend/.env. Credentials were not printed.');
