import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const astroCli = resolve('node_modules/astro/astro.js');
const result = spawnSync(
  process.execPath,
  [astroCli, ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      ASTRO_TELEMETRY_DISABLED: '1',
    },
  },
);

process.exit(result.status ?? 1);
