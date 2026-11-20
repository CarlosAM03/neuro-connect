// Fail closed on new advisories; retain visibility of the documented tooling risk.
const { spawnSync } = require('node:child_process');
if (!process.env.npm_execpath) throw new Error('Run through npm run audit:gate');
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'audit', '--omit=dev', '--json'], { encoding: 'utf8', windowsHide: true });
try {
  const audit = JSON.parse(result.stdout);
  if (audit.error || !audit.metadata || !audit.vulnerabilities || result.status > 1 || result.status === null) throw new Error('Audit unavailable');
  const allowed = new Set(['prisma', '@prisma/config', 'deepmerge-ts']);
  for (const [name, issue] of Object.entries(audit.vulnerabilities)) {
    if (!allowed.has(name) || issue.severity !== 'high') throw new Error(`Review required: ${name}`);
    for (const via of issue.via) {
      if (typeof via === 'string' ? !allowed.has(via) : via.url !== 'https://github.com/advisories/GHSA-ggr8-5vv4-36mx') throw new Error(`New advisory: ${name}`);
    }
  }
  console.log(`Policy gate: ${Object.keys(audit.vulnerabilities).length} affected tooling packages; only documented GHSA-ggr8-5vv4-36mx allowed. Not audit=0; human review required before public deployment.`);
} catch (error) {
  console.error(`Dependency gate failed: ${error.message}. Run npm audit --omit=dev for details.`);
  process.exitCode = 1;
}
